const ResourceData = require("./resourceData");
const ResourceDataHandler = require("./resourceDataHandler");


/**
 * Room data, is the data that is managed corresponding to each room that the AI
 * is aware of.
 */
class RoomData{

    constructor(roomId, controlled, initialized){
        this.controlled = controlled;
        this.initialized = initialized;
        this.resourceData = new Map();
        this.id = roomId;
        this.withdrawPoints = new Map();

        if(initialized){
            var room = Game.rooms[this.id];
            var roomSources = room.find(FIND_SOURCES);
            for(var i in roomSources){
                this.resourceData[roomSources[i].id] =  new ResourceData(roomSources[i], room);
                var containers = this.resourceData[roomSources[i].id].containers;
                for(var i in containers){
                    this.withdrawPoints[containers[i].id] = containers[i];
                }
            }
        }
        
    }

}

module.exports = RoomData;