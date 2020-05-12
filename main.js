const resource = require('resource');
const Spawner = require('spawner');

const roleHarvester = require('role.harvester');
const roleLongHarvester = require('role.longHarvester');
const roleScout = require('./role.scout');
// workers
const roleBuilder = require('role.worker.builder');
const roleUpgrader = require('role.worker.upgrader');
const roleRepairer = require("role.worker.repairer");
const roleWallRepairer = require('./role.worker.repairer.wall');
const BaseCreep = require('./role.base');
const Manager = require('manager');

// this map defines a role, each of these should be defined under their
// corresponding role. ie. role.harvester.js...


module.exports.loop = function () {
    
    //spawning in the lads
     for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            // update our spawner
            Manager.respawn(Memory.creeps[name]);
            // we have to get rid of their selected sources too
            resource.DeleteCreep(Memory.creeps[name], name);
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // update our managers
    Manager.update();

    Manager.printSpawns();

    Spawner.spawn();

    var tower = Game.getObjectById('5eb170065ed8e66cfe840485');
    if(tower) {
        // only repair if we are over half full.
        if(tower.store[RESOURCE_ENERGY] > 500){
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax &&
                                       structure.structureType != STRUCTURE_WALL &&
                                       structure.structureType != STRUCTURE_RAMPART &&
                                       structure.structureType != STRUCTURE_ROAD
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
                Memory.DebugMap['5bbcaa7e9099fc012e63179d'].storage['5eb170065ed8e66cfe840485'].available = tower.store.getCapacity(RESOURCE_ENERGY) - tower.store[RESOURCE_ENERGY];
            }
        }
       

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
            Memory.DebugMap[creep.memory.source].storage['5eb170065ed8e66cfe840485'].available = tower.store.getCapacity(RESOURCE_ENERGY) - tower.store[RESOURCE_ENERGY];
        }
    }

    // excecute creep logic
    for(var name in Game.creeps) {

        var creep = Game.creeps[name];
        
        Manager.getRole(creep.memory.role).run(creep);
        
    }
}