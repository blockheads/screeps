var gen = require('util.gen');
require('prototype.room')();
const WorkerCreep = require('role.worker');

var roleBuilder = {

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
    
    /** @param {Creep} creep **/
    run: function(creep) {
        WorkerCreep.run(creep, this.performLogic);
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