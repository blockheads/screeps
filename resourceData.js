const ResourceDataHandler = require('resourceDataHandler');


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
      ResourceDataHandler.update.call(this, room, source);
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

}

const ROOMS = ['W47S15', 'W47S14'];

if(!Memory.RoomData){
    Memory.RoomData = new Map();
    // iterate over specified rooms
    for(var j in ROOMS){
        // retrieve all of the room's sources
        Memory.RoomData[ROOMS[j]] = new Map();
        Memory.RoomData[ROOMS[j]].resourcedata = new Map();
        console.log("generating room: ", Game.rooms[ROOMS[j]]);
        console.log("the room we want: ", JSON.stringify(Game.rooms));
        // if we have data on the room
        if(Game.rooms[ROOMS[j]]){
            Memory.RoomData[ROOMS[j]].initialized = true;
            var roomSources =  Game.rooms[ROOMS[j]].find(FIND_SOURCES);
            for(var i in roomSources){
                Memory.RoomData[ROOMS[j]].resourcedata[roomSources[i].id] =  new ResourceData(roomSources[i], Game.rooms[ROOMS[j]]);
            }
        }
        else{
            Memory.RoomData[ROOMS[j]].initialized = false;
        }
        
    }

    
} 

module.exports = ResourceData;