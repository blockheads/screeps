/**
 * A worker creep performs the following actions
 * working,
 * withdrawing,
 * harvesting,
 */

const OopUtil = require('util.oop');
var resource = require('resource');

class WorkerCreep{

    getWithdraw(){
        this.memory.working = false;
        this.memory.source = null;
        const containersWithEnergy = this.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                           i.store[RESOURCE_ENERGY] > 0
        });

        if(containersWithEnergy.length > 0){
            this.say('🏧');
            // store where we want to withdraw from
            this.memory.withdraw = containersWithEnergy[0].id;
            return true;
        }
        
        // failed
        return false;

    }

    /**
     * Nulls out withdraw
     */
    getSource(){
        this.memory.working = false;
        this.memory.source = resource.findOptimalSource(this);
        this.memory.withdraw = null;
        this.say('🔄');
    }


    /**
     * Container specific withdraw logic
     */
    withdrawContainer(){
        var target = Game.getObjectById(this.memory.withdraw);
        // check that the store we are withdrawing from isn't 0 now
        if(target.store[RESOURCE_ENERGY] == 0){
            this.memory.withdraw = null;
        }
        else {
            
            var ret = this.withdraw(target, RESOURCE_ENERGY);
            if( ret == ERR_NOT_IN_RANGE){
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            if(ret == 0){
                for(var i in Memory.DebugMap){
                    for(var j in Memory.DebugMap[i].storage){
                        if(Memory.DebugMap[i].storage[j].id == this.memory.withdraw){
                            console.log(this.name, " updated ", j, " to ", target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY]);
                            Memory.DebugMap[i].storage[j].available = target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY];
                        }
                    }
                    
                }
                
            }
        }
    }

    run(performLogic){

        if( !this.memory.source && !this.memory.withdraw && !this.memory.working && this.store[RESOURCE_ENERGY] != 0) {
            this.memory.withdraw = null;
            this.memory.working = true;
            this.memory.source = null;

        }
        // else if(!creep.memory.working && !creep.memory.withdraw &&  !creep.memory.source) {
            
        // }
        else if(!this.memory.working && !this.memory.withdraw && !this.memory.source){
            this.getWithdraw();
        }

        if(!this.memory.working && !this.memory.source && !this.memory.withdraw) {
            this.getSource();
        }

        if(this.memory.working) {
            if(this.store[RESOURCE_ENERGY] == 0){
                this.memory.working = false;
            }
            
            // here were perform our main logic
            performLogic.call(this);
          
        }
        else {
            // withdrawing
            if(this.memory.withdraw){
                this.withdrawContainer();

               if(this.store.getFreeCapacity() == 0){
                this.memory.withdraw = null;
               }
            }
            // harvesting
            else if(this.memory.source){
                if(this.harvest(Game.getObjectById( this.memory.source)) == ERR_NOT_IN_RANGE) {
                    this.moveTo(Game.getObjectById( this.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                if(this.store.getFreeCapacity() == 0){
                    this.memory.source = null;
                }
            }
            // uninitialized
            else{
                // we just tell it it's 'repairing' to make it make up it's mind
                //creep.memory.repairing = true;
            }
        }
    }
}


OopUtil.extendClass(Creep, WorkerCreep);
module.exports = WorkerCreep;