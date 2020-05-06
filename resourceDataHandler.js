const CREEP_PER_ENERGY = 150;
const RESOURCE_RADIUS = 7;

var ResourceDataHandler = {

    updateTotalStore: function(){
        this.totalStore = 0;
        for(var i in this.storage){
            if(this.storage[i].structureType == STRUCTURE_TOWER)
                this.totalStore += Game.getObjectById(this.storage[i].id).store.getCapacity();
            else
                this.totalStore += Game.getObjectById(this.storage[i].id).store.getCapacity(RESOURCE_ENERGY);
        }
    },

    /**
     * Retrieves the storage elements near a defined resource
     * this happens per resource in a room once upon
     * Resource Map instantiation
     */
    updateStorage(room, resource){
        
        
        // INITIALIZE OUR LISTS
        this.storage = [];
        
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
                        var storageData = {"id":  ret[i][j][k][LOOK_STRUCTURES]['id'], "available": 0, "structureType": ret[i][j][k][LOOK_STRUCTURES]['structureType']};
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
        mainStorage.sort((a, b) => (distanceToSource( Game.getObjectById(a.id)) > distanceToSource( Game.getObjectById(b.id))) ? 1 : -1);
        towers.sort((a, b) => (distanceToSource( Game.getObjectById(a.id)) > distanceToSource( Game.getObjectById(b.id))) ? 1 : -1);
        containers.sort((a, b) => (distanceToSource( Game.getObjectById(a.id)) > distanceToSource( Game.getObjectById(b.id))) ? 1 : -1);

        this.storage = mainStorage.concat(towers,containers);
        console.log(JSON.stringify(this.storage));
        

    },

    /**
     * Updates the Memory.Debug Maps available storage
     */
    updateAvailable: function(source){
        console.log("storage: ", this.storage);
        for(var i in this.storage){
            var cstorage = Game.getObjectById( this.storage[i].id);
            if(cstorage.store[RESOURCE_ENERGY] < cstorage.store.getCapacity(RESOURCE_ENERGY)){
                this.storage[i].available = cstorage.store.getCapacity(RESOURCE_ENERGY) - cstorage.store[RESOURCE_ENERGY];
                console.log("storage ", i, " now has ", this.storage[i].available, " available energy.");
                
            }
                
        }
        
    },

    update: function(room, resource){
        ResourceDataHandler.updateStorage.call(this, room, resource);
        ResourceDataHandler.updateTotalStore.call(this);
        ResourceDataHandler.updateAvailable.call(this, resource.id);
    },
    
    shouldAddCreep: function(){
        if(this.creeps.length*200 < this.totalStore){
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

}

module.exports = ResourceDataHandler;

