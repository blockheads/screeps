// our protype class which uses methods from 
// role.worker
const States = require('role.states');
const { STORAGE_PRIMARY } = require('./util.room');

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
                States.runStore(creep, States.WITHDRAW, STORAGE_PRIMARY);
                break;
        }
        
    }
}

module.exports = TransportCreep;