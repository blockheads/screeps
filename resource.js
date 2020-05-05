// initializing our resource map if it hasn't been defined
if(!Memory.ResourceMap){
    console.log("initialized resource map");
    ResourceMap = new Map();
    Memory.ResourceMap = ResourceMap;
    //console.log("wrote out: ", JSON.stringify(ResourceMap));
}

// debug purposes
console.log("Current Resource Map data...");
for (var source in Memory.ResourceMap) {
    screeps = Memory.ResourceMap[source];
    console.log(source + ' has ' + screeps + ' screeps active.');
    
}

// radius of range of resource mapping to storage
const RESOURCE_RADIUS = 7;

// this class stores all of our valuable resource data
// i'm forced to make this because of limited CPU
// and it absolutely will be more efficent and destroy
// my awesome dynamic creep resource pathing algorithm
class ResourceData {
    /**
     * Constructs a resource zone.
     * @param {String} id ID of the resource
     */
    constructor(id, room) {
      this.id =id;
      // right now we have to get the currently built
      // extensions around a resource... I guess we'll
      // leave this in, but with automated registry, they
      // will get registered as built
      // initialize this dope shit
      this.setAvailableSlots(room);
      this.bindStorage(room);
    }

    /**
     * Retrieves the storage elements near a defined resource
     * this happens per resource in a room once upon
     * Resource Map instantiation
     */
    bindStorage(room){
        
        
        // INITIALIZE OUR LISTS
        this.storage = [];
        
        var mainStorage = [];
        var towers = [];
        var containers = [];

        var resource = Game.getObjectById(this.id);
        var x = resource.pos.x;
        var y = resource.pos.y;

        // STORAGE (PRIMARY,SECONDARY)
        console.log("top: ", y-RESOURCE_RADIUS, " left: ", x-RESOURCE_RADIUS, " bottom: ", y+RESOURCE_RADIUS, " left: ", x+RESOURCE_RADIUS);
        // primary storage        
        var ret = room.lookAtArea(y-RESOURCE_RADIUS,x-RESOURCE_RADIUS,y+RESOURCE_RADIUS,x+RESOURCE_RADIUS);

        // grab all of our structures within our defined radius
        for(var i=y-1; i <= y+RESOURCE_RADIUS; i++){
            for(var j=x-1; j <= x+RESOURCE_RADIUS; j++){
                
                // a tile can have multiple objects on it
                for(var k in ret[i][j]){

                    
                    if(ret[i][j][k]["type"] == LOOK_STRUCTURES){
                        // then we check if it is a wall
                        console.log("current tile: (", j, ',', i, ") ");
                        console.log("struct: ", ret[i][j][k][LOOK_STRUCTURES]['structureType']);
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

    setAvailableSlots(room){
        
        // AVAIBLE SLOTS
        // getting our resource
        var resource = Game.getObjectById(this.id);

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

        this.avaibleSlots = 9-wallTotal;
    }
    
}

// TESTING
new ResourceData('5bbcaa7e9099fc012e63179d', Game.rooms['W47S15']);

// this makes kicking significant, if not the resources are near 
// equidistant so it really doesn't matter anyways
const KICK_OFFSET = 5;

var Resource = {

    findOptimalStorage: function(creep){
        // first search for spawns avaible
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN  &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        if(targets.length > 0) {
            return targets[0];
        }

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION  &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        if(targets.length > 0) {
            return targets[0];
        }

        // then containers
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        if(targets.length > 0) {
            _.sortBy(targets, s => creep.pos.getRangeTo(s));
            return targets[0];
        }
    },

    /**
     * returns a optimal Energy resource to retrieve 
     * given a screepy lad.
     * @param {Room} room ro
     */
    findOptimalSource: function(creep){
        
        // look at all of our current Active Sources
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        
        // check if this source has been initialized in our resource map
        for(var z in sources){
            
            var wallTotal = 0;
            if(!Memory.ResourceMap[sources[z].id]){
                
                x = sources[z].pos.x;
                y = sources[z].pos.y;
                // get this lad's walltotal
                var ret = creep.room.lookAtArea(y-1,x-1,y+1,x+1);
                //console.log("ret:", y-1 , x-1 , y+1,x+1 );

                
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
                console.log("Wall total: ", wallTotal);
                var avaibleSlots = 9 - wallTotal;
                Memory.ResourceMap[sources[z].id] = [avaibleSlots];
            }

            Memory.DebugMap = new Map();
            Memory.DebugMap[sources[z].id] = new ResourceData(sources[z].id, creep.room);

        }
        
        //find closest avaible spot for screepie

        // sort our sorces by distnace to our creep
        _.sortBy(sources, s => creep.pos.getRangeTo(s));
        for(var i in sources){

            //console.log("source ", sources[i].id, " has ", Memory.ResourceMap[sources[i].id][0] - (Memory.ResourceMap[sources[i].id].length-1), " available slots.");
            if(Memory.ResourceMap[sources[i].id][0] - (Memory.ResourceMap[sources[i].id].length-1) > 0){
                // we select any source nearby with a avaible spot
                Memory.ResourceMap[sources[i].id].push({name: creep.name, pos: creep.pos});
                return sources[i].id;
            }
            // now its a issue because we are full
            else{
                // try to kick out a creep.
                for(var j=1; j < Memory.ResourceMap[sources[i].id].length; j++){
                    // if there is a creep that has a longer range than us we take priority
                    // Game.creeps[Memory.ResourceMap[sources[i].id][j].name].pos.getRangeTo(sources[i]) = current creep in maps distance to resource
                    // creep.pos.getRangeTo(sources[i]) this current creeps distance to the resource
                    // wait i think this is backwards, idk code works now fuck it lmao. 
                    //console.log("is ", creep.pos.getRangeTo(sources[i]) + KICK_OFFSET, " < ", Game.creeps[Memory.ResourceMap[sources[i].id][j].name].pos.getRangeTo(sources[i]) );
                    if(creep.pos.getRangeTo(sources[i]) < Game.creeps[Memory.ResourceMap[sources[i].id][j].name].pos.getRangeTo(sources[i]) + KICK_OFFSET ){
                        //console.log("Kicking out, " + Memory.ResourceMap[sources[i].id][j].name + " from " + source + " replacing with " + creep.name);
                        this.DeselectSource(Game.creeps[Memory.ResourceMap[sources[i].id][j].name]);
                        Memory.ResourceMap[sources[i].id].push({name: creep.name, pos: creep.pos});
                        return sources[i].id;
                    }
                    
                }
                // otherwise attempt to stack on other's if within kick range
                for(var j=1; j < Memory.ResourceMap[sources[i].id].length; j++){
                    // if there is a creep that has a longer range than us we take priority
                    // Game.creeps[Memory.ResourceMap[sources[i].id][j].name].pos.getRangeTo(sources[i]) = current creep in maps distance to resource
                    // creep.pos.getRangeTo(sources[i]) this current creeps distance to the resource
                    //console.log("is ", creep.pos.getRangeTo(sources[i]), " < ", Game.creeps[Memory.ResourceMap[sources[i].id][j].name].pos.getRangeTo(sources[i]) + KICK_OFFSET);
                    if(creep.pos.getRangeTo(sources[i]) + KICK_OFFSET < Game.creeps[Memory.ResourceMap[sources[i].id][j].name].pos.getRangeTo(sources[i])){
                        //console.log("adding extra, to ", source, " name:", creep.name);
                        Memory.ResourceMap[sources[i].id].push({name: creep.name, pos: creep.pos});
                        return sources[i].id;
                    }
                    
                }
            }
        }

        // if none are avaible just choose the closest
        //console.log("None available. Pushed to least priority.")
        Memory.ResourceMap[sources[sources.length -1].id].push({name: creep.name, pos: creep.pos});
        return sources[sources.length -1].id;
    },
    /**
     * Removes a creep from the resourcemap list
     * @param {Creep} creep specified creep
     */
    DeselectSource: function(creep){
        this.DeleteCreep(creep.memory, creep.name);
    },

    /**
     * Removes a creep from the resourcemap list
     * @param {Memory} memory memory object, corresponding to creep
     * @param {String} name the name of the creep to delete
     */
    DeleteCreep: function(memory, name){
        //console.log("called into this function somehow");
        if( memory.source != null && Memory.ResourceMap[memory.source]){
            // delete it from the creep, set it null.
            
            var currentcreeps = Memory.ResourceMap[memory.source].length;
            //console.log("Deleting one creep from ", memory.source, " new amount is ", currentcreeps - 1)
            const index = Memory.ResourceMap[memory.source].indexOf(name);

            for(var j=1; j < Memory.ResourceMap[memory.source].length; j++){
                if(Memory.ResourceMap[memory.source][j].name == name){
                    Memory.ResourceMap[memory.source].splice(j,1)
                    memory.source = null; 
                    //console.log("deleted ", name, " now ", memory.source, ".");
                    return;
                }
            }

            //console.log("Failed to delete ", name, " from ", memory.source, " does not exist in list, setting source to null.");
            
        }
        memory.source = null; 
    }

}

module.exports =  Resource;
