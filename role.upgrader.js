var gen = require('util.gen');
var resource = require('resource');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                           i.store[RESOURCE_ENERGY] > 0
        });

        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
            creep.memory.withdraw = null;
            resource.DeselectSource(creep);
            creep.memory.source = null;
        }

        else if(!creep.memory.withdraw && containersWithEnergy.length > 0 && !creep.memory.source) {
            creep.say('🏧 withdrawing');
            // store where we want to withdraw from
            creep.memory.withdraw = containersWithEnergy[0].id;
            
            
        }

        else if(!creep.memory.source && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
            creep.memory.source = resource.findOptimalSource(creep);
            creep.memory.withdraw = null;

        }
        
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }

        }
        else if(creep.memory.withdraw){

            var target = Game.getObjectById(creep.memory.withdraw);
            // check that the store we are withdrawing from isn't 0 now
            if(target.store[RESOURCE_ENERGY] == 0){
                creep.memory.withdraw = null;
            }
            else {
                
                var ret = creep.withdraw(target, RESOURCE_ENERGY);
                if( ret == ERR_NOT_IN_RANGE){
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(ret == 0){
                    Memory.DebugMap[creep.memory.source].storage[creep.memory.withdraw].available = target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY];
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

            // we just tell it it's 'repairing' to make it make up it's mind
            creep.memory.upgrading = true;
        }
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