/**
 * A worker creep performs the following actions
 * working,
 * withdrawing,
 * harvesting,
 */

const OopUtil = require('util.oop');

class WorkerCreep{

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