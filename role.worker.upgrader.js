var gen = require('util.gen');
var resource = require('resource');
require('prototype.room')();

var roleUpgrader = {

    performLogic: function(){
        if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        if(this.store[RESOURCE_ENERGY] == 0){
            this.memory.working = false;
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.run(this.performLogic);   
    },
    
    /**
     * generates a upgrader name
     */
    gen: function(){
        name = "📤Upgrader📤" + gen.get();
        return name;
    }
};

module.exports = roleUpgrader;