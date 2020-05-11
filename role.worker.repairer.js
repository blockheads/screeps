var gen = require('util.gen');
var resource = require('resource');
const WorkerCreep = require('role.worker');
require('prototype.room')();

//import WorkerCreep from './WorkerCreep';


var roleRepairer = {
    // perform logic required for our run function
    performLogic: function () {

        if(this.store[RESOURCE_ENERGY] == 0){
            this.memory.working = false;
        }
        console.log("ROLE REPAIRER I have been called. reparing...");
        var targets = this.room.getRepairTargets();
        
        if(targets.length <= 0){
            console.log("no targets");
            this.memory.working = false;
            return;
        }

        var target = targets[0];

        if(this.repair(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }

        if(target.structureType == STRUCTURE_ROAD && target.hits == 5000){
            this.memory.working = false;
        }

        if(target.structureType == STRUCTURE_WALL && target.hits == 10000){
            this.memory.working = false;
        }
        
        console.log("target: (", target.pos.x, ",", target.pos.y, ") health: ", target.hits);

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
     * generates a buildeer name
     */
    gen: function(){
        name = "❤️Repairer❤️" + gen.get();
        return name;
    }
};

module.exports = roleRepairer;