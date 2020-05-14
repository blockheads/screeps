const { floor, map } = require("lodash");

const CREEP_PER_ENERGY = 150;
const RESOURCE_RADIUS = 10;

var ResourceDataHandler = {

    updateTotalStore: function(){
        this.totalStore = 0;
        for(var i in this.storage){
            if(this.storage[i].structureType != STRUCTURE_TOWER && this.storage[i].structureType != STRUCTURE_CONTAINER && this.storage[i].structureType != STRUCTURE_STORAGE){
                this.totalStore += Game.getObjectById(this.storage[i].id).store.getCapacity(RESOURCE_ENERGY);            
            }
        }
    },

    /**
     * Retrieves the storage elements near a defined resource
     * this happens per resource in a room once upon
     * Resource Map instantiation
     */
    updateStorage(room, resource){
        
        
        // INITIALIZE OUR LISTS
        this.storage = new Map();
        
        var mainStorage = [];
        var towers = [];
        var containers = [];

        var x = resource.pos.x;
        var y = resource.pos.y;

        // STORAGE (PRIMARY,SECONDARY)
        console.log("top: ", y-RESOURCE_RADIUS, " left: ", x-RESOURCE_RADIUS, " bottom: ", y+RESOURCE_RADIUS, " left: ", x+RESOURCE_RADIUS);
        // primary storage        
        var ret = room.lookAtArea(y-RESOURCE_RADIUS,x-RESOURCE_RADIUS,y+RESOURCE_RADIUS,x+RESOURCE_RADIUS);

        // grab all of our structures within our defined radius
        for(var i=y-RESOURCE_RADIUS; i <= y+RESOURCE_RADIUS; i++){
            for(var j=x-RESOURCE_RADIUS; j <= x+RESOURCE_RADIUS; j++){
                
                // a tile can have multiple objects on it
                for(var k in ret[i][j]){
                 
                    //console.log("current tile: (", j, ',', i, ") ");
                    //console.log(ret[i][j][k]["type"]);
                
                   
                    if(ret[i][j][k]["type"] == LOOK_STRUCTURES){
                        // then we check if it is a wall
                        
                        //console.log("struct: ", ret[i][j][k][LOOK_STRUCTURES]['structureType']);
                        var storageData = {"id":  ret[i][j][k][LOOK_STRUCTURES]['id'], "available": 0, "structureType": ret[i][j][k][LOOK_STRUCTURES]['structureType'],
                                           "pos": ret[i][j][k][LOOK_STRUCTURES]['pos']};
                        //console.log("current type: ", ret[i][j][k]["type"]);

                        if(ret[i][j][k][LOOK_STRUCTURES]['structureType'] == STRUCTURE_EXTENSION
                         ||ret[i][j][k][LOOK_STRUCTURES]['structureType'] == STRUCTURE_SPAWN ){
                            mainStorage.push(storageData);
                        }
                        if(ret[i][j][k][LOOK_STRUCTURES]['structureType'] == STRUCTURE_TOWER ){
                            towers.push(storageData);
                        }
                        if(ret[i][j][k][LOOK_STRUCTURES]['structureType'] == STRUCTURE_CONTAINER){
                            containers.push(storageData);
                        }
                    }
                }
                
            }
        }
        // our distance function
        function distanceToSource(store){
            var x2 = Math.pow(store.pos.x - resource.pos.x, 2);
            var y2 = Math.pow(store.pos.y - resource.pos.y, 2);
            return Math.sqrt(x2 + y2);
        }
        // sort our arrays
        mainStorage = mainStorage.sort((a, b) => (distanceToSource( Game.getObjectById(a.id)) > distanceToSource( Game.getObjectById(b.id))) ? 1 : -1);
        towers = towers.sort((a, b) => (distanceToSource( Game.getObjectById(a.id)) > distanceToSource( Game.getObjectById(b.id))) ? 1 : -1);
        containers = containers.sort((a, b) => (distanceToSource( Game.getObjectById(a.id)) > distanceToSource( Game.getObjectById(b.id))) ? 1 : -1);

        this.containers = containers;

        var storageList = mainStorage.concat(towers,containers);

        // store in our map
        for(var i in storageList){
            this.storage[storageList[i].id] =  storageList[i];
        }

        console.log(JSON.stringify(this.storage));

        
    },

    /**
     * Updates the Memory.Debug Maps available storage
     */
    updateAvailable: function(source){
        //console.log("storage: ", this.storage);
        for(var i in this.storage){
            var cstorage = Game.getObjectById( this.storage[i].id);
            if(cstorage.store[RESOURCE_ENERGY] < cstorage.store.getCapacity(RESOURCE_ENERGY)){
                this.storage[i].available = cstorage.store.getCapacity(RESOURCE_ENERGY) - cstorage.store[RESOURCE_ENERGY];
                //console.log("storage ", i, " now has ", this.storage[i].available, " available energy.");
                
            }
                
        }
        
    },

    update: function(room, resource){
        ResourceDataHandler.updateStorage.call(this, room, resource);
        ResourceDataHandler.updateTotalStore.call(this);
        ResourceDataHandler.updateAvailable.call(this, resource.id);
    },
    
    shouldAddCreep: function(){
        // this is the forumla I calculated. Initialyl have 6 creeps?
        // so it goes like 400 | 5, 700 | 4, 1000 | 3, 1300 |2, ...
        var maxCreeps = 5 - floor((Memory.maxEnergy-400)/300);
        //onsole.log("max creeps: ", maxCreeps);
        if(this.creeps.length < maxCreeps){
            return true;
        }
        return false;
    },
    
    /**
     * Method which returns boolean determining if this source
     * zone needs another harvester based on it's total score
     * and active creeps
     */
    addCreep: function(creepName){   
        this.creeps.push(creepName);
    },

    getCurrentHarvesters: function(){
        // this is the forumla I calculated. Initialyl have 6 creeps?
        // so it goes like 400 | 5, 700 | 4, 1000 | 3, 1300 |2, ...
        return this.creeps.length;
     
    },

    getMaxHarvesters: function(){
        // this is the forumla I calculated. Initialyl have 6 creeps?
        // so it goes like 400 | 5, 700 | 4, 1000 | 3, 1300 |2, ...
        return 5 - floor((Memory.maxEnergy-400)/300);
     
    },

    getPossibleStorage: function(creep){
        var carry = creep.store[RESOURCE_ENERGY];
        var possibleStorage = [];

        for(var i in this.storage){
            var available = this.storage[i].available;
            if(available != 0){
                // subtract however much we are removing from available
                if(carry > available){
                    console.log("removing everything from this guy.");
                    this.storage[i].available = 0;
                }
                else{
                    console.log("don't have enough to remove all available");
                    this.storage[i].available = this.storage[i].available - carry;
                }
                carry -= available;
                console.log("this ", creep.name, "selected storage ", this.storage[i].id, " with ", carry, "left.");
                possibleStorage.push(this.storage[i].id);
            }
            if(carry <= 0 ){
                break;
            }
        }

        return possibleStorage;

    }

}

module.exports = ResourceDataHandler;

