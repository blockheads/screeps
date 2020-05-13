var gen = require('util.gen');
var resource = require('resource');
const States = require('role.states');
const FactoryNode = require('./role.factoryNode');

var roleHarvester = {
    // this defines the harvesters build
    init: function(creep){
        // uhh probably shouldn't be this dumb of a way to do this... i'm really tired atm
        creep.getResourceData().creeps.push(creep.name);
    },

    build: function(creep){
        return new FactoryNode([WORK,CARRY,MOVE],[WORK,WORK,CARRY]);
    },

    /** @param {Creep} creep **/
    run: function(creep) {
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
                States.runInit(creep, this.init, States.HARVEST);
                break;
            case States.HARVEST:
                States.runHarvest(creep, States.STORE, creep.memory.source);
                break;
            case States.STORE:
                States.runStore(creep, States.HARVEST);
                break;
        }
            
        
    },
    /**
     * generates a harvester name
     */
    gen: function(){
        name = "✂Harvester✂" + gen.get();
        return name;
    }
};

module.exports = roleHarvester;