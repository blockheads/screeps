/**
 * Transport creep moves resources around
 */

const { STORAGE_PRIMARY } = require("./util.room");
const FactoryNode = require('./role.factoryNode');
var gen = require('util.gen');
const States = require('role.states');

// our protype class which uses methods from 
// role.worker
var TransportCreep = {

    run(creep, init){
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
            case States.STORE:
                States.runStore(creep, States.WITHDRAW, STORAGE_PRIMARY);
                break;
        }
        
    }
}

 var roleTransport = {
    
    build: function(creep){
        return new FactoryNode([WORK,CARRY,MOVE],[CARRY,CARRY,MOVE]);
    },

    init: function(creep){
        // grab nearest storage
        creep.getResourceData().transporters.push(creep.name);
    },

    run: function(creep){
        TransportCreep.run(creep, this.init);
    },

    gen: function(){
        name = "🚆Transporter🚆" + gen.get();
        return name;
    }
 }

module.exports = roleTransport;