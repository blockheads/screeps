const { clamp, max } = require('lodash');

require('prototype.spawn')();

const INITIAL_HARVESTERS = 6;
const INTIAL_UPGRADERS = 2;
const INITIAL_REPAIRERS = 1;
const INTIAL_BUILDERS = 0;

const HARVESTERS_MAX = 8;
const UPGRADERS_MAX = 8;
const BUILDERS_MAX = 4;
const REPAIRERS_MAX = 2;

const BASE_CREEP_PRICE = 200;

var Spawner = {
    // first pump out 4 small harvesters

    spawn: function(){

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        var totalCreeps = harvesters.length + upgraders.length + builders.length + repairers.length;
        var maxEnergy = Game.spawns['Spawn1'].room.energyCapacityAvailable;

        // determining our creep price
        var price = BASE_CREEP_PRICE + totalCreeps*25;
        // ensure we don't go overboard here
        if(price > maxEnergy)
                price = maxEnergy

        console.log("price is currently: ", price);

        // first creep to spawn
        if(harvesters.length < INITIAL_HARVESTERS){
            price = BASE_CREEP_PRICE + harvesters.length*25;
            // ensure we don't go overboard here
            if(price > maxEnergy)
                price = maxEnergy

            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'harvester');

            if(ret == 0)
                console.log('Spawning new harvester: ' + newName);
        }
        else if(repairers.length < INITIAL_REPAIRERS) {
            

            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'repairer');
            if(ret == 0)
                console.log('Spawning new repairer: ' + newName);
        }
        else if(upgraders.length <= INTIAL_UPGRADERS) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'upgrader');
            if(ret == 0)
                console.log('Spawning new upgrader: ' + newName);
        }
        
        else if(builders.length < INTIAL_BUILDERS) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'builder');
            if(ret == 0)
                console.log('Spawning new builder: ' + newName);
        }

        else if(harvesters.length < HARVESTERS_MAX){

            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'harvester');
            if(ret == 0)
                console.log('Spawning new repairer: ' + newName);
        }
        else if(upgraders.length < UPGRADERS_MAX) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'upgrader');
            if(ret == 0)
                console.log('Spawning new upgrader: ' + newName);
        }
        else if(builders.length < BUILDERS_MAX) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'builder');
            if(ret == 0)
                console.log('Spawning new builder: ' + newName);
        }
        else if(repairers.length < REPAIRERS_MAX) {
            
            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'repairer');
            if(ret == 0)
                console.log('Spawning new repairer: ' + newName);
        }

    }
    
}

module.exports =  Spawner;