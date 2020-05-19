var gen = require('util.gen');
var resource = require('resource');
require('prototype.room')();
const WorkerCreep = require('role.worker');
const FactoryNode = require('./role.factoryNode');
const RoomDataHandler = require('./RoomDataHandler');
const { ROLE_CONTROLLER_TRANSPORTER } = require('./util.role');

var roleUpgrader = {
    build: function(creep){
        return new FactoryNode([WORK,CARRY,MOVE,MOVE],[WORK,WORK,WORK,CARRY]);
    },

    performLogic: function(){
        if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
            this.moveToPush(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        if(this.store[RESOURCE_ENERGY] == 0){
            this.memory.working = false;
        }
    },

    init: function(){
        console.log("initialized.");
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        // WorkerCreep run method
        //WorkerCreep.run(creep, this.performLogic);
        
        // if we have a controller storage, and a transporter
        if(RoomDataHandler.getControllerStorage.call(creep.getRoomData())){

            creep.memory.withdrawPoint = RoomDataHandler.getControllerStorage.call(creep.getRoomData());
            WorkerCreep.runWithTransport(creep, this.init, this.performLogic);
        }
        else{

            creep.memory.withdrawPoint = null;
            WorkerCreep.run(creep, this.init, this.performLogic);
        }
        
    },
    
    /**
     * generates a upgrader name
     */
    gen: function(){
        name = "📤Upgrader📤" + gen.get();
        return name;
    }
};

module.exports = roleUpgrader;