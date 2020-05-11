/**
 * A worker creep performs the following actions
 * working,
 * withdrawing,
 * harvesting,
 */

const OopUtil = require('util.oop');

const STATE_INIT = 0;
const STATE_WORKING = 1;
const STATE_WITHDRAWING = 2;
const STATE_HARVESTING = 3;
const STATE_MOVING = 4;

// based off https://screepsworld.com/2017/09/screeps-tutorial-handling-creep-roles-with-a-state-machine/
/**
 * Runs stateful logic for a creep on initilization
 * @param {Creep} creep The creep to perform stateful logic
 * @param {func} init function pointer to call on creep initilization
 * @param {int} transitionState next state to move to from initilization
 */
var runInit = function(creep, init, transitionState){

    // state transition
    if(!creep.spawning){
        creep.memory.state = transitionState;
        WorkerCreep.actualRun(creep);
        return;
    }

    if(!creep.memory.init){
        init();
        creep.memory.init = true;
    }

}

/**
 * Runs stateful logic for a working creep
 * @param {Creep} creep The creep to perform stateful logic
 * @param {func} performLogic function pointer to perform working logic
 * @param {int} transitionState next state to move to once done working
 */
var runWork = function(creep, performLogic, transitionState){

    // we work until we no longer have any energy remaining
    if(creep.store[RESOURCE_ENERGY] == 0){
        creep.memory.state = transitionState;
        creep.memory.working = false;
        WorkerCreep.actualRun(creep);
        return;
    }

    if(!creep.memory.working){
        creep.memory.working;
    }

    // otherwise we perform our main logic for this worker creep
    performLogic.call(creep);

}

/**
 * Attempts to withdraw from a container, transitions to the transitionState if succesfull
 * otherwise goes to failState.
 * @param {Creep} creep The creep to perform stateful logic
 * @param {func} transitionState int to the state to transition after done withdrawing.
 * @param {int} failState state to move on to if we are unable to withdraw from anything
 */
var runWithdraw = function(creep, transitionState, failState){

    // if we are withdrawing
    if(creep.memory.withdrawing){

        creep.withdrawContainer();

        // if we are full transition to the next state
        if(creep.store.getFreeCapacity() == 0){
            creep.memory.withdrawing = false;
            creep.memory.state = transitionState;
            WorkerCreep.actualRun(creep);   
        }
        return;
    }

    // otherwise get withdraw options
    withdrawContainers = creep.getContainerWithdraw();

    // if we have nothing to withdraw from we move to our fail state
    if(withdrawContainers.length <= 0 ){
        creep.memory.state = failState;
        WorkerCreep.actualRun(creep);
        return;  
    }

    // otherwise we are now withdrawing
    creep.memory.withdrawing = true;
    creep.memory.withdraw = withdrawContainers[0].id;
    WorkerCreep.actualRun(creep);
    return; 

}

/**
 * Attempts to harvest from a available source, and transitions on full
 * @param {Creep} creep The creep to perform stateful logic
 * @param {func} transitionState int to the state to transition after done harvesting.
 */
var runHarvest = function(creep, transitionState){

    // if we are harvesting
    if(creep.memory.harvesting){

        // if we are full transition to the next state
        if(creep.store.getFreeCapacity() == 0){
            creep.memory.harvesting = false;
            creep.memory.state = transitionState;
            WorkerCreep.actualRun(creep);   
        }
        return;
    }

    // otherwise get harvest point
    creep.memory.source = creep.getHarvestSource();
    creep.memory.harvesting = true;
    WorkerCreep.actualRun(creep);
    return; 

}


var WorkerCreep = {

    run(creep, performLogic){

        //state 1: working
        //state 2: withdrawing
        //state 3: source
        if( !creep.memory.source && !creep.memory.withdraw && !creep.memory.working && creep.store[RESOURCE_ENERGY] != 0) {
            creep.memory.withdraw = null;
            creep.memory.working = true;
            creep.memory.source = null;

        }
        // else if(!creep.memory.working && !creep.memory.withdraw &&  !creep.memory.source) {
            
        // }

        // retrieve resources
        else if(!creep.memory.working && !creep.memory.withdraw && !creep.memory.source){
            creep.getWithdraw();
        }

        if(!creep.memory.working && !creep.memory.source && !creep.memory.withdraw) {
            creep.getSource();
        }

        if(creep.memory.working) {
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
            
            // here were perform our main logic
            performLogic.call(creep);
          
        }
        else {
            // withdrawing
            if(creep.memory.withdraw){
                creep.withdrawContainer();

               if(creep.store.getFreeCapacity() == 0){
                creep.memory.withdraw = null;
               }
            }
            // harvesting
            else if(creep.memory.source){
                if(creep.harvest(Game.getObjectById( creep.memory.source)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById( creep.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                if(creep.store.getFreeCapacity() == 0){
                    creep.memory.source = null;
                }
            }
            // uninitialized
            else{
                // we just tell it it's 'repairing' to make it make up it's mind
                //creep.memory.repairing = true;
            }
        }
    },

    actualRun(creep, init, performLogic){
        // WORKER CREEP STATES
        // =-----------------=
        // INIT -> WITHDRAW
        // WITHDRAW -> HARVEST | WORKING .
        // WORKING -> WITHDRAW ^
        if(!creep.memory.state){
            creep.memory.state = STATE_INIT;
        }

        switch(creep.memory.state){
            case STATE_INIT:
                runInit(creep, init, STATE_WITHDRAWING);
                break;
            case STATE_WITHDRAWING:
                runWithdraw(creep, STATE_WORKING, STATE_HARVESTING);
                break;
            case STATE_HARVESTING:
                runHarvest(creep, STATE_WORKING);
                break;
            case STATE_WORKING:
                runWork(creep, performLogic, STATE_WITHDRAWING);
                break;
        }
        
    }
}


module.exports = WorkerCreep;