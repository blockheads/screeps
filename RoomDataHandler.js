const ResourceDataHandler = require("./resourceDataHandler");

var RoomDataHandler = {

    update: function(){
        for(var i in this.resourceData){ 
            ResourceDataHandler.update.call(this.resourceData[i], Game.spawns['Spawn1'].room, Game.getObjectById(i));
            var containers = this.resourceData[this.resourceData[i].id].containers;
            for(var i in containers){
                this.withdrawPoints[containers[i].id] = containers[i];
            }
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

