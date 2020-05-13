const ResourceDataHandler = require("./resourceDataHandler");

var RoomDataHandler = {

    update: function(){
        for(var i in this.resourceData){ 
            ResourceDataHandler.update.call(this.resourceData[i], Game.spawns['Spawn1'].room, Game.getObjectById(i));
        }

    },

    updateAvailable: function(){
        for(var i in this.resourceData){
            ResourceDataHandler.updateAvailable.call(this.resourceData[i], i);
        }
    },
    
}

module.exports = RoomDataHandler;

