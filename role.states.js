var States = {
    
    INIT: 0,
    WORK: 1,
    WITHDRAW: 2,
    HARVEST:  3,
    STORE: 4,

    /**
     * Runs stateful logic for a creep on initilization
     * @param {Creep} creep The creep to perform stateful logic
     * @param {func} init function pointer to call on creep initilization
     * @param {int} transitionState next state to move to from initilization
     */
    runInit: function(creep, init, transitionState){
        // console.log("creep spawning: ", creep.spawning);
        // state transition
        if(!creep.spawning){
            creep.memory.state = transitionState;
            return;
        }

        if(!creep.memory.init){
            init(creep);
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
    runHarvest: function(creep, transitionState, source){

        // if we are harvesting
        if(creep.memory.harvesting){

            // if we are full transition to the next state
            if(creep.store.getFreeCapacity() == 0){
                creep.memory.harvesting = false;
                creep.memory.state = transitionState; 
            }

            if(creep.harvest(Game.getObjectById( creep.memory.source)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById( creep.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
            }

            return;
        }

        // otherwise get harvest point
        creep.memory.source = source;
        creep.memory.harvesting = true;
        return; 

    },

    // this function NEEDS to be optimized
    runStore: function(creep, transitionState){

        if(creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.state = transitionState;
            creep.memory.storage = null;
            return;
        }

        //hauling
        if(!creep.memory.storage){
            // assigning this creep storage
            creep.getPriorityStorage();
            
        }
        else if(creep.memory.selectedStorage || creep.memory.storage.length > 0){
            
            if(!creep.memory.selectedStorage){
                creep.memory.selectedStorage = creep.memory.storage.shift();
            }

            storage = Game.getObjectById(creep.memory.selectedStorage);
            // ensure that our selected storage isn't full
            if(storage.store[RESOURCE_ENERGY] == storage.store.getCapacity(RESOURCE_ENERGY)){
                // just search for a new storage
                creep.memory.selectedStorage = null;
            }
            
            var ret = creep.transfer(storage, RESOURCE_ENERGY)
            
            if( ret == ERR_NOT_IN_RANGE){
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
            // null out and move to the next available storage element
            if( ret == 0 && creep.memory.selectedStorage){
                //Memory.DebugMap[creep.memory.source].storage[creep.memory.selectedStorage].available = storage.store[RESOURCE_ENERGY];
                creep.memory.selectedStorage = null;
            }
            
        }
        else{
            creep.memory.storage = null; 
            console.log("Nothing to do for ", creep.name);
            //roleBuilder.run(creep);       
        }
    }

}

module.exports = States;