/**
 * Transporter creep which suplies the upgraders resources
 */

 /**
 * Transport creep moves resources around
 */

const { STORAGE_PRIMARY } = require("./util.room");
const FactoryNode = require('./role.factoryNode');
var gen = require('util.gen');
const { STORAGE_CONTROLLER } = require('./util.room');

const TransportCreep = require('role.transportCreep')


 var roleTransport = {
    
    build: function(creep){
        return new FactoryNode([CARRY,MOVE],[CARRY,CARRY,MOVE]);
    },

    init: function(creep){
        // grab nearest storage
    },

    run: function(creep){
        TransportCreep.run(creep, this.init, STORAGE_CONTROLLER);
    },

    gen: function(){
        name = "🚆Transporter (C)🚆" + gen.get();
        return name;
    }
 }

module.exports = roleTransport;