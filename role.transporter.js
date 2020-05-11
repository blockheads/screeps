/**
 * Transport creep moves resources around
 */

const WorkerCreep = require("./role.base");

// our protype class which uses methods from 
// role.worker
var TransportCreep = {

    run(creep, init, performLogic){
        // WORKER CREEP STATES
        // =-----------------=
        // INIT -> WITHDRAW
        // WITHDRAW -> HARVEST | WORKING .
        // WORKING -> WITHDRAW ^
        if(!creep.memory.state){
            creep.memory.state = States.INIT;
        }

        switch(creep.memory.state){
            case States.INIT:
                States.runInit(creep, init, States.WITHDRAW);
                break;
            case States.WITHDRAW:
                States.runWithdraw(creep, States.WORK, States.WITHDRAW);
                break;
            case States.WORK:
                States.runWork(creep, performLogic, States.WITHDRAW);
                break;
        }
        
    }
}

 var roleTransport = {
    performLogic: function(){
        // grab nearest storage
    },

    init: function(){
        // grab nearest storage
    },

    run: function(creep){
        Creep.run(this.performLogic);
    }
 }

module.exports = roleTransport;