const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const resource = require('resource');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');

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
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    if(harvesters.length < HARVESTERS_MAX) {
        var newName = roleHarvester.gen();
        
        var ret = Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
        if(ret == 0)
            console.log('Spawning new harvester: ' + newName);
    }
    else if(upgraders.length < UPGRADERS_MAX) {
        var newName = roleUpgrader.gen();
        
        var ret = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'upgrader'}});
        if(ret == 0)
            console.log('Spawning new upgrader: ' + newName);
    }
    else if(repairers.length < REPAIRERS_MAX) {
        var newName = roleRepairer.gen();
        
        var ret = Game.spawns['Spawn1'].spawnCreep([WORK,MOVE,CARRY,MOVE], newName,
            {memory: {role: 'repairer'}});
        if(ret == 0)
            console.log('Spawning new repairer: ' + newName);
    }
    else if(builders.length < BUILDERS_MAX) {
        var newName = roleBuilder.gen();
        
        var ret = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
        if(ret == 0)
            console.log('Spawning new builder: ' + newName);
    }
    
    
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