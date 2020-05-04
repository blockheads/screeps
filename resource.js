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

/*
room = Game.rooms['W47S15'];
// our current room for debug W47S15
var sources = room.find(FIND_SOURCES);

for(var i in sources){
    x = sources[i].pos.x;
    y = sources[i].pos.y;
    var ret = room.lookAtArea(y-1,x-1,y+1,x+1);
    //console.log("ret:", y-1 , x-1 , y+1,x+1 );

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
    console.log("Wall total: ", wallTotal);
}
*/

var Resource = {

    findOptimalStorage: function(creep){
        // first search for spawns avaible
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
            }
        });
        if(targets.length > 0) {
            return targets[0];
        }

        // then extenstensions
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION &&
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
        var sources = creep.room.find(FIND_SOURCES);
        
        // check if this source has been initialized in our resource map
        for(var i in sources){
            
            if(!Memory.ResourceMap[sources[i].id]){
                Memory.ResourceMap[sources[i].id] = [];
            }

        }
        
        var minSource = sources[0].id;
        var minScreeps = 999; 
        for (var source in Memory.ResourceMap) {
            screeps = Memory.ResourceMap[source];
            console.log(source + ' has ' + screeps + ' screeps active.');
            if(screeps.length < minScreeps){
                minScreeps = screeps.length;
                minSource = source;
            }
        }
        console.log("selected ", minSource, " now has ", minScreeps+1);
        Memory.ResourceMap[minSource].push(creep.name);
        return minSource;
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
        console.log("called into this function somehow");
        if( memory.source != null && Memory.ResourceMap[memory.source]){
            // delete it from the creep, set it null.
            
            var currentcreeps = Memory.ResourceMap[memory.source].length;
            console.log("Deleting one creep from ", memory.source, " new amount is ", currentcreeps - 1)
            const index = Memory.ResourceMap[memory.source].indexOf(name);
            if (index > -1) {
                Memory.ResourceMap[memory.source].splice(index, 1);
            }
            else{
                console.log("Failed to delete ", name, " from ", memory.source, " does not exist in list, setting source to null.");
            }
            
        }
        memory.source = null; 
    }

}

module.exports =  Resource;
