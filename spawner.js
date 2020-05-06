const { clamp, max } = require('lodash');

require('prototype.spawn')();
require('resourceData');  
const ResourceDataHandler = require('resourceDataHandler');

const INTIAL_UPGRADERS = 2;
const INITIAL_REPAIRERS = 1;
const INTIAL_BUILDERS = 1;

const UPGRADERS_MAX = 8;
const BUILDERS_MAX = 4;
const REPAIRERS_MAX = 3;

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
        // caching our max energy, it also determines if we should check for updates
        if(!Memory.maxEnergy || maxEnergy != Memory.maxEnergy){

            console.log("Max Energy updated... updating");
            for(var i in Memory.DebugMap){
                ResourceDataHandler.update.call(Memory.DebugMap[i], Game.spawns['Spawn1'].room, Game.getObjectById(i));    
            }

            Memory.maxEnergy = maxEnergy;
            
        }

        var currentEnergy = Game.spawns['Spawn1'].room.energyAvailable;
        // caching out current energy as well
        if(!Memory.currentEnergy || currentEnergy != Memory.currentEnergy){
            if(currentEnergy < Memory.currentEnergy){
                console.log("updating available storage.");

                for(var i in Memory.DebugMap){
                    ResourceDataHandler.updateAvailable.call(Memory.DebugMap[i], i);
                }
            }
            Memory.currentEnergy = currentEnergy;
        }

        // determining our creep price
        var price = BASE_CREEP_PRICE + totalCreeps*50;

        // ensure we don't go overboard here
        if(price > 800)
                price = maxEnergy
        
        //console.log("price is currently: ", price);

        // not going to try and spawn a creep if we don't have the energy
        if(currentEnergy < price){
            return;
        }
        
        // get's the source w/ least creeps that can add creeps
        var minCreeps = 999;
        var SourceIndex = -1;
        for(var i in Memory.DebugMap){
            
            if(Memory.DebugMap[i].creeps.length < minCreeps && ResourceDataHandler.shouldAddCreep.call(Memory.DebugMap[i])){
                minCreeps = Memory.DebugMap[i].creeps.length;
                SourceIndex = i;
            }
                
        }
        if(SourceIndex != -1){
            console.log("spawning: ", JSON.stringify(Memory.DebugMap[SourceIndex]));
            return Game.spawns['Spawn1'].createCustomCreep(price,'harvester', SourceIndex);
        }
        // failsafe, in case ^ breaks when colony dies out for some reason
        // don't think it will but i'm really tired rn
        // if(harvesters.length < INITIAL_HARVESTERS){
        //     price = BASE_CREEP_PRICE + harvesters.length*25;
        //     // ensure we don't go overboard here
        //     if(price > maxEnergy)
        //         price = maxEnergy
            
        //     //getting our source
        //     var ret = Game.spawns['Spawn1'].createCustomCreep(price,'harvester');
            

        //     if(ret == 0)
        //         console.log('Spawning new harvester: ' + newName);
        // }
        if(repairers.length < INITIAL_REPAIRERS) {
            

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

        // else if(harvesters.length < HARVESTERS_MAX){

        //     var ret = Game.spawns['Spawn1'].createCustomCreep(price,'harvester');
        //     if(ret == 0)
        //         console.log('Spawning new repairer: ' + newName);
        // }
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