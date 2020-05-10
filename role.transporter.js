/**
 * Transport creep moves resources around
 */

const WorkerCreep = require("./role.worker");

// our protype class which uses methods from 
// role.worker
class TransportCreep{

    run(performLogic){
        if( !this.memory.source && !this.memory.withdraw && !this.memory.working && this.store[RESOURCE_ENERGY] != 0) {
            this.memory.withdraw = null;
            this.memory.working = true;
        }
        // else if(!creep.memory.working && !creep.memory.withdraw &&  !creep.memory.source) {
            
        // }
        else if(!this.memory.working && !this.memory.withdraw && !this.memory.source){
            this.getWithdraw();
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
            
            // uninitialized
            else{
                // we just tell it it's 'repairing' to make it make up it's mind
                //creep.memory.repairing = true;
            }
        }
    }
}

 var roleTransport = {
    performLogic: function(){

    },

    run: function(creep){
        Creep.run(this.performLogic);
    }
 }

OopUtil.extendClass(Creep, TransportCreep);
module.exports = TransportCreep;