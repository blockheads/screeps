var gen = require('util.gen');
require('prototype.room')();
const WorkerCreep = require('role.worker');
const FactoryNode = require('./role.factoryNode');

var roleBuilder = {
    build: function(creep){
        return new FactoryNode([WORK,CARRY,MOVE],[WORK,CARRY,MOVE]);
    },

    performLogic: function(){
        var targets = this.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            var target = targets[0];
            // this is a little slow
            targets = _.sortBy(targets, s => this.pos.getRangeTo(s)).reverse();
            for(var i in targets){
                if(targets[i].structureType == STRUCTURE_CONTAINER){
                    target = targets[i];
                }
            }

            if(this.build(target) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
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
     * generates a buildeer name
     */
    gen: function(){
        name = "🔨Builder🔨" + gen.get();
        return name;
    }
};

module.exports = roleBuilder;