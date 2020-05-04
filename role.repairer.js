var gen = require('util.gen');
var resource = require('resource');
var roleUpgrader = require('role.upgrader');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;

            
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.getCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                creep.say('🏧 withdrawing');
                // store where we want to withdraw from
                creep.memory.withdraw = targets[0].id;
                
            }
            else{
                creep.say('🔄 harvest');

                creep.memory.source = resource.findOptimalSource(creep);
                console.log("found optimal source " + creep.memory.source);
                
            }

            
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('❤️ repairing ❤️');
            creep.memory.withdraw = null;
            resource.DeselectSource(creep);
        }

        if(creep.memory.repairing) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            
            targets.sort((a,b) => a.hits - b.hits);
            
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else{
                roleUpgrader.run(creep);
            }
        }
        else {
            // withdrawing
            if(creep.memory.withdraw){
                if(creep.withdraw(Game.getObjectById(creep.memory.withdraw), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.withdraw), {visualizePathStyle: {stroke: '#ffffff'}});
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
                // we just tell it it's 'repairing' to make it make up it's mind
                creep.memory.repairing = true;
            }
        }
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