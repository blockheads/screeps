const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const resource = require('resource');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const Spawner = require('spawner');

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
    
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
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
        
    }
}