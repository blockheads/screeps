/**
 * Wall Specific Repairer
 */

var gen = require('util.gen');
var resource = require('resource');
require('prototype.room')();
const WorkerCreep = require('role.worker');

//import WorkerCreep from './WorkerCreep';



var roleWallRepairer = {

    // perform logic required for our run function
    performLogic : function () {
        console.log("ROLE WALL REPAIRER reparing...", this.name);

        targets = this.room.getWallRepairTargets();
        var target = targets[0];

        if(this.repair(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
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
    gen: function (){
        name = "❤️WallRepairer❤️" + gen.get();
        return name;
    }

}

module.exports = roleWallRepairer;