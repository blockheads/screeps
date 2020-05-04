var gen = require('util.gen');
var resource = require('resource');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            
            const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                               i.store[RESOURCE_ENERGY] > 0
            });
            if(containersWithEnergy.length > 0) {
                creep.say('🏧 withdrawing');
                // store where we want to withdraw from
                creep.memory.withdraw = containersWithEnergy[0].id;
                
            }
            else{
                creep.say('🔄 harvest');

                creep.memory.source = resource.findOptimalSource(creep);
                console.log("found optimal source " + creep.memory.source);
                
            }

            
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
            creep.memory.withdraw = null;
            resource.DeselectSource(creep);
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            // withdrawing
            if(creep.memory.withdraw){
                // check that the store we are withdrawing from isn't 0 now
                if(Game.getObjectById(creep.memory.withdraw).store[RESOURCE_ENERGY] == 0){
                    creep.memory.withdraw = null;
                }
                else {
                    if(creep.withdraw(Game.getObjectById(creep.memory.withdraw), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(Game.getObjectById(creep.memory.withdraw), {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            // harvesting
            else if(creep.memory.source){
                if(creep.harvest(Game.getObjectById( creep.memory.source)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById( creep.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            // uninitialized
            else{
                // we just tell it it's 'building' to make it make up it's mind
                creep.memory.building = true;
            }
        }
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