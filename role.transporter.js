/**
 * Transport creep moves resources around
 */

const { STORAGE_PRIMARY } = require("./util.room");
const FactoryNode = require('./role.factoryNode');
var gen = require('util.gen');
const TransportCreep = require('role.transportCreep')


 var roleTransport = {
    
    build: function(creep){
        return new FactoryNode([CARRY,MOVE],[CARRY,CARRY,MOVE]);
    },

    init: function(creep){
        // grab nearest storage
        creep.getResourceData().transporters.push(creep.name);
    },

    run: function(creep){
        TransportCreep.run(creep, this.init, STORAGE_PRIMARY);
    },

    gen: function(){
        name = "🚆Transporter (B)🚆" + gen.get();
        return name;
    }
 }

module.exports = roleTransport;