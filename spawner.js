require('prototype.spawn')();

const HARVESTERS_MAX = 6;
const UPGRADERS_MAX = 6;
const BUILDERS_MAX = 4;
const REPAIRERS_MAX = 1;

var Spawner = {
    // first pump out 4 small harvesters

    spawn: function(){

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        if(harvesters.length < HARVESTERS_MAX) {
            var ret = Game.spawns['Spawn1'].createCustomCreep(200,'harvester');

            if(ret == 0)
                console.log('Spawning new harvester: ' + newName);
        }
        else if(upgraders.length < UPGRADERS_MAX) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(200,'upgrader');
            if(ret == 0)
                console.log('Spawning new upgrader: ' + newName);
        }
        else if(repairers.length < REPAIRERS_MAX) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(200,'repairer');
            if(ret == 0)
                console.log('Spawning new repairer: ' + newName);
        }
        else if(builders.length < BUILDERS_MAX) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(200,'builder');
            if(ret == 0)
                console.log('Spawning new builder: ' + newName);
        }
    }
    
}

module.exports =  Spawner;