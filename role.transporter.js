/**
 * Transport creep moves resources around
 */

const WorkerCreep = require("./role.base");

// our protype class which uses methods from 
// role.worker
var TransportCreep = {

    run(performLogic){
        if( !this.memory.withdraw && !this.memory.working && this.store[RESOURCE_ENERGY] != 0) {
            this.memory.withdraw = null;
            this.memory.working = true;
        }

        else if(!this.memory.working && !this.memory.withdraw){
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
        // grab nearest storage
    },

    run: function(creep){
        Creep.run(this.performLogic);
    }
 }

module.exports = roleTransport;