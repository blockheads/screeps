/**
 * A worker creep performs the following actions
 * working,
 * withdrawing,
 * harvesting,
 */

const States = require('role.states');

var WorkerCreep = {

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
                States.runWithdraw(creep, States.WORK, States.HARVEST);
                break;
            case States.HARVEST:
                States.runHarvest(creep, States.WORK, creep.getHarvestSource());
                break;
            case States.WORK:
                States.runWork(creep, performLogic, States.WITHDRAW);
                break;
        }
        
    }
}


module.exports = WorkerCreep;