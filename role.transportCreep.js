// our protype class which uses methods from 
// role.worker
const States = require('role.states');

var TransportCreep = {

    run(creep, init, storageType){
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
                States.runWithdraw(creep, States.STORE, States.WITHDRAW);
                break;
            case States.STORE:
                States.runStore(creep, States.WITHDRAW,storageType);
                break;
        }
        
    }
}

module.exports = TransportCreep;