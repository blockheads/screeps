const ResourceDataHandler = require("./resourceDataHandler");

var RoomDataHandler = {

    update: function(){
        for(var i in this.resourceData){ 
            ResourceDataHandler.update.call(this.resourceData[i], Game.spawns['Spawn1'].room, Game.getObjectById(i));
        }

    },

    updateAvailable: function(){
        for(var i in this.resourceData){
            //console.log("updating: ", JSON.stringify(this.resourceData[i]));
            ResourceDataHandler.updateAvailable.call(this.resourceData[i]);
        }
    },
    
}

module.exports = RoomDataHandler;

