var gen = require('util.gen');
var resource = require('resource');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;

            var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                               i.store[RESOURCE_ENERGY] > 0
            });
            if(containersWithEnergy.length > 0) {
                creep.say('🏧 withdrawing');
                containersWithEnergy = _.sortBy(containersWithEnergy, s => creep.pos.getRangeTo(s)).reverse();
                // store where we want to withdraw from
                creep.memory.withdraw = containersWithEnergy[0].id;
                
            }
            else{
                creep.say('🔄 harvest');
                if(!creep.memory.source){
                    creep.memory.source = resource.findOptimalSource(creep);
                    //console.log("found optimal source " + creep.memory.source);
                } 
                
            }
            
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
            creep.memory.withdraw = null;
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var target = targets[0];
                // this is a little slow
                targets = _.sortBy(targets, s => creep.pos.getRangeTo(s)).reverse();
                for(var i in targets){
                    if(targets[i].structureType == STRUCTURE_CONTAINER){
                        target = targets[i];
                    }
                }

                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            // withdrawing
            if(creep.memory.withdraw){
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
                        for(var i in Memory.DebugMap){
                            for(var j in Memory.DebugMap[i].storage){
                                if(Memory.DebugMap[i].storage[j] == creep.memory.withdraw){
                                    console.log(creep.name, " updated ", j, " to ", target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY])
                                    Memory.DebugMap[i].storage[j].available = target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY];
                                }
                            }
                            
                        }
                        
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