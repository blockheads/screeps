var gen = require('util.gen');
var resource = require('resource');
const ResourceData = require('resourceData');

var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.goalRoom){

            for(var i in Memory.RoomData){
                if(!Memory.RoomData[i].initialized){
                    // store the uninitialized room as our goal room
                    creep.memory.goalRoom = i;
                }
            }

            // there's no other room's to explore to. just kill self
            if(!creep.memory.goalRoom){
                creep.suicide();
            }
        }
        // head to the goal room
        else{
            // we made it
            if(creep.memory.goalRoom == creep.room.name){
                console.log("At goal room.");
                Memory.RoomData[creep.memory.goalRoom].initialized = true;
                var roomSources =  Game.rooms[creep.memory.goalRoom].find(FIND_SOURCES);
                for(var i in roomSources){
                    Memory.RoomData[creep.memory.goalRoom].resourcedata[roomSources[i].id] =  new ResourceData(roomSources[i], Game.rooms[creep.memory.goalRoom]);
                }

                creep.memory.goalRoom = null;

            }
            else{
                console.log("moving to exit.");
                
                var exit = creep.room.findExitTo(creep.memory.goalRoom);
                console.log("exit: ", exit);
                creep.moveToPush(creep.pos.findClosestByRange(exit), {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
        }
        
    },
    /**
     * generates a harvester name
     */
    gen: function(){
        name = "Scout" + gen.get();
        return name;
    }
};

module.exports = roleScout;