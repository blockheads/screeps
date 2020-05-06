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
     * UNUSED METHOD, THIS IS A EXAMPLE OF HOW NOT TO PROGRAM SOMETHING
     * ACTUALLY, IT'S PRETTY DOPE BUT IT USES UP HELLA CPU.
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

        }
        
        //find closest avaible spot for screepie

        // sort our sorces by distnace to our creep
        _.sortBy(sources, s => creep.pos.getRangeTo(s));
        return sources[sources.length -1].id;
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
            
            //var currentcreeps = Memory.ResourceMap[memory.source].length;
            //console.log("Deleting one creep from ", memory.source, " new amount is ", currentcreeps - 1)

            for(var j=1; j < Memory.ResourceMap[memory.source].length; j++){
                if(Memory.ResourceMap[memory.source][j].name == name){
                    Memory.ResourceMap[memory.source].splice(j,1);
                    
                    //console.log("deleted ", name, " now ", memory.source, ".");
                    break;
                }
            }

            // deleting from other lad too
            for(var j=0; j < Memory.DebugMap[memory.source]['creeps'].length; j++){
                // iterate over our creep array
                if(Memory.DebugMap[memory.source]['creeps'][j] == name){
                    Memory.DebugMap[memory.source]['creeps'].splice(j,1);
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