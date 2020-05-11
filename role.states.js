var States = {
    
    INIT: 0,
    WORK: 1,
    WITHDRAW: 2,
    HARVEST:  3,

    /**
     * Runs stateful logic for a creep on initilization
     * @param {Creep} creep The creep to perform stateful logic
     * @param {func} init function pointer to call on creep initilization
     * @param {int} transitionState next state to move to from initilization
     */
    runInit: function(creep, init, transitionState){

        // state transition
        if(!creep.spawning){
            creep.memory.state = transitionState;
            return;
        }

        if(!creep.memory.init){
            init();
            creep.memory.init = true;
        }

    },

    /**
     * Runs stateful logic for a working creep
     * @param {Creep} creep The creep to perform stateful logic
     * @param {func} performLogic function pointer to perform working logic
     * @param {int} transitionState next state to move to once done working
     */
    runWork: function(creep, performLogic, transitionState){

        // we work until we no longer have any energy remaining
        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.state = transitionState;
            creep.memory.working = false;
            return;
        }

        if(!creep.memory.working){
            creep.memory.working;
        }

        // otherwise we perform our main logic for this worker creep
        performLogic.call(creep);

    },

    /**
     * Attempts to withdraw from a container, transitions to the transitionState if succesfull
     * otherwise goes to failState.
     * @param {Creep} creep The creep to perform stateful logic
     * @param {func} transitionState int to the state to transition after done withdrawing.
     * @param {int} failState state to move on to if we are unable to withdraw from anything
     */
    runWithdraw: function(creep, transitionState, failState){

        // if we are withdrawing
        if(creep.memory.withdrawing){

            creep.withdrawContainer();

            // if we are full transition to the next state
            if(creep.store.getFreeCapacity() == 0){
                creep.memory.withdrawing = false;
                creep.memory.state = transitionState;   
            }
            return;
        }

        // otherwise get withdraw options
        withdrawContainers = creep.getContainerWithdraw();

        // if we have nothing to withdraw from we move to our fail state
        if(withdrawContainers.length <= 0 ){
            creep.memory.state = failState;
            return;  
        }

        // otherwise we are now withdrawing
        creep.memory.withdrawing = true;
        creep.memory.withdraw = withdrawContainers[0].id;
        return; 

    },

    /**
     * Attempts to harvest from a available source, and transitions on full
     * @param {Creep} creep The creep to perform stateful logic
     * @param {func} transitionState int to the state to transition after done harvesting.
     */
    runHarvest: function(creep, transitionState){

        // if we are harvesting
        if(creep.memory.harvesting){

            // if we are full transition to the next state
            if(creep.store.getFreeCapacity() == 0){
                creep.memory.harvesting = false;
                creep.memory.state = transitionState; 
            }
            return;
        }

        // otherwise get harvest point
        creep.memory.source = creep.getHarvestSource();
        creep.memory.harvesting = true;
        return; 

    }

}

module.exports = States;