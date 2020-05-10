/**
 * Wall Specific Repairer
 */

var gen = require('util.gen');
var resource = require('resource');
var roleUpgrader = require('role.upgrader');
require('WorkerCreep');

//import WorkerCreep from './WorkerCreep';

var roleWallRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        console.log("running.", creep.name);

        if( !creep.memory.working && creep.store[RESOURCE_ENERGY] != 0) {
            console.log("called in here");
            creep.say('❤️ repairing ❤️');
            creep.memory.withdraw = null;
            resource.DeselectSource(creep);
            creep.memory.working = true;
            creep.memory.source = null;

            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax &&
                                  (object.structureType == STRUCTURE_WALL ||
                                  object.structureType == STRUCTURE_RAMPART)
            });
            
            //targets.sort((a,b) => a.hits - b.hits);
            creep.memory.repairTarget = creep.pos.findClosestByPath(targets).id;
        
        }
        else if(!creep.memory.working && !creep.memory.withdraw &&  !creep.memory.source) {
            creep.getWithdraw();
        }

        else if(!creep.memory.working && !creep.memory.source && !creep.memory.withdraw) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
            creep.memory.source = resource.findOptimalSource(creep);
            creep.memory.withdraw = null;

        }

        if(creep.memory.working) {
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
            console.log("reparing...");
            var target = Game.getObjectById(creep.memory.repairTarget);

            if(!target){
                creep.memory.working = false;
                return;
            }
 

            if(creep.repair(Game.getObjectById(creep.memory.repairTarget)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.repairTarget), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            
            console.log("target: (", target.pos.x, ",", target.pos.y, ") health: ", target.hits);
            
          
        }
        else {
            // withdrawing
            if(creep.memory.withdraw){
               creep.withdrawContainer();
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
    gen: function (){
        name = "❤️WallRepairer❤️" + gen.get();
        return name;
    }

}

module.exports = roleWallRepairer;