const roleHarvester = require('role.harvester');
const roleLongHarvester = require('role.longHarvester');
const roleUpgrader = require('role.upgrader');
const resource = require('resource');
const roleBuilder = require('role.builder');
const roleRepairer = require("role.repairer");
const Spawner = require('spawner');
const roleScout = require('./role.scout');
const roleWallRepairer = require('./role.repairer.wall');


const HARVESTERS_MAX = 6;
const UPGRADERS_MAX = 6;
const BUILDERS_MAX = 4;
const REPAIRERS_MAX = 1;

module.exports.loop = function () {
    
    //spawning in the lads
     for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            // we have to get rid of their selected sources too
            resource.DeleteCreep(Memory.creeps[name], name);
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    
    // spawns our screepies
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
            Memory.DebugMap[creep.memory.source].storage['5eb170065ed8e66cfe840485'].available = tower.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY];
        }
    }

    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }

        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }

        if(creep.memory.role == 'longharvester'){
            roleLongHarvester.run(creep);
        }

        if(creep.memory.role == 'scout')
        {
            roleScout.run(creep);
        }
        
        if(creep.memory.role == 'wallrepairer'){
            roleWallRepairer.run(creep);
        }

    }
}