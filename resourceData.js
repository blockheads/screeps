const RESOURCE_RADIUS = 7;
const CREEP_PER_ENERGY = 150;
// this class stores all of our valuable resource data
// i'm forced to make this because of limited CPU
// and it absolutely will be more efficent and destroy
// my awesome dynamic creep resource pathing algorithm
class ResourceData {

    // radius of range of resource mapping to storage

    /**
     * Constructs a resource zone.
     * @param {Source} source The resource which this is all based on
     */
    constructor(source, room) {
      this.id = source.id;
      // right now we have to get the currently built
      // extensions around a resource... I guess we'll
      // leave this in, but with automated registry, they
      // will get registered as built
      // initialize this dope shit
      this.creeps = [];

      this.setAvailableSlots(room, source);
      this.updateStorage(room, source);
      this.update();
    }

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
                        var storageData = {"id":  ret[i][j][k][LOOK_STRUCTURES]['id'], "available": true, "structureType": ret[i][j][k][LOOK_STRUCTURES]['structureType']};
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
        

    }

    setAvailableSlots(room, resource){
        
        // AVAIBLE SLOTS
        // getting our resource

        var x = resource.pos.x;
        var y = resource.pos.y;
        
        // calculating avaible slots for a given resource
        var ret = room.lookAtArea(y-1,x-1,y+1,x+1);
                
        var wallTotal = 0;

        for(var i=y-1; i <= y+1; i++){
            for(var j=x-1; j <= x+1; j++){
                
                //console.log("current tile: (", j, ',', i, ") ");
                // a tile can have multiple objects on it
                for(var k in ret[i][j]){
                    //console.log("current type: ", ret[i][j][k]["type"]);
                    if(ret[i][j][k]["type"] == LOOK_TERRAIN){
                        // then we check if it is a wall
                        if(ret[i][j][k][LOOK_TERRAIN] == 'wall'){
                            wallTotal++;
                        }
                    }
                }
                
            }
        }

        this.availableSlots = 9-wallTotal;
    }
    
    update(){
        this.updateTotalStore();
    }

    updateTotalStore(){
        this.totalStore = 0;
        for(var i in this.storage){
            if(this.storage[i].structureType == STRUCTURE_TOWER)
                this.totalStore += Game.getObjectById(this.storage[i].id).store.getCapacity();
            else
                this.totalStore += Game.getObjectById(this.storage[i].id).store.getCapacity(RESOURCE_ENERGY);
        }
    }

    shouldAddCreep(){
        if(this.creeps.length*150 < this.totalStore){
            return true;
        }
        return false;
    }

    /**
     * Method which returns boolean determining if this source
     * zone needs another harvester based on it's total score
     * and active creeps
     */
    addCreep(creepName){   
        this.creeps.push(creepName);

    }

}

var roomSources =  Game.rooms['W47S15'].find(FIND_SOURCES_ACTIVE);
for(var i in roomSources){
    Memory.DebugMap[roomSources[i].id] =  new ResourceData(roomSources[i], Game.rooms['W47S15']);
}

module.exports = ResourceData;