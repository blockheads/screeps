var gen = require('util.gen');
var resource = require('resource');
require('prototype.room')();
const WorkerCreep = require('role.worker');

var roleUpgrader = {

    performLogic: function(){
        if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        if(this.store[RESOURCE_ENERGY] == 0){
            this.memory.working = false;
        }
    },

    init: function(){
        console.log("initialized.");
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // WorkerCreep run method
        //WorkerCreep.run(creep, this.performLogic);
        WorkerCreep.run(creep, this.init, this.performLogic);
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