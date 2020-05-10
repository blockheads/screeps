var gen = require('util.gen');
var resource = require('resource');
var roleUpgrader = require('role.upgrader');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                           i.store[RESOURCE_ENERGY] > 0
        });

        if( !creep.memory.repairing && creep.store[RESOURCE_ENERGY] != 0) {
            console.log("called in here");
            creep.say('❤️ repairing ❤️');
            creep.memory.withdraw = null;
            resource.DeselectSource(creep);
            creep.memory.repairing = true;
            creep.memory.source = null;

            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            
            targets.sort((a,b) => a.hits - b.hits);
            creep.memory.repairTarget = targets[0].id;
            for( var i in targets){
                console.log("targets[i].structureType ",  targets[i].structureType, "== StructureContainer && ",  "targets[i].structureType.hits ", targets[i].hits, " < 100000");
                if(targets[i].structureType == STRUCTURE_CONTAINER && targets[i].hits < 100000){
                    creep.memory.repairTarget = targets[i].id;
                }
            }
        }
        else if(!creep.memory.repairing && !creep.memory.withdraw && containersWithEnergy.length > 0 && !creep.memory.source) {
            creep.say('🏧 withdrawing');
            // store where we want to withdraw from
            creep.memory.withdraw = containersWithEnergy[0].id;
            
            
        }

        else if(!creep.memory.repairing && !creep.memory.source && !creep.memory.withdraw) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
            creep.memory.source = resource.findOptimalSource(creep);
            creep.memory.withdraw = null;

        }

        if(creep.memory.repairing) {
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.repairing = false;
            }
            console.log("reparing...");
            var target = Game.getObjectById(creep.memory.repairTarget);

            if(creep.repair(Game.getObjectById(creep.memory.repairTarget)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.repairTarget), {visualizePathStyle: {stroke: '#ffaa00'}});
            }

            if(target.structureType == STRUCTURE_ROAD && target.hits == 5000){
                creep.memory.repairing = false;
            }

            if(target.structureType == STRUCTURE_WALL && target.hits == 10000){
                creep.memory.repairing = false;
            }
            
            console.log("target: (", target.pos.x, ",", target.pos.y, ") health: ", target.hits);
            
          
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
                // we just tell it it's 'repairing' to make it make up it's mind
                //creep.memory.repairing = true;
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