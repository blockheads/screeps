const { clamp, max } = require('lodash');

require('prototype.spawn')();
require('resourceData');  
const ResourceDataHandler = require('resourceDataHandler');

const SCOUTS = 1;

const INTIAL_UPGRADERS = 2;
const INITIAL_REPAIRERS = 1;
const INTIAL_BUILDERS = 0;
const INITIAL_LONG_RANGE_HARVESTER = 1;
const WALL_REPAIRER = 1;

const UPGRADERS_MAX = 4;
const BUILDERS_MAX = 0;
const REPAIRERS_MAX = 1;

const BASE_CREEP_PRICE = 200;

var Spawner = {
    // first pump out 4 small harvesters

    spawn: function(){

        console.log("construction sites: ", Game.constructionSites);

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var longharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'longharvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var wallrepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallrepairer');
        var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == 'scout');

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
         
            console.log("updating available storage.");

            for(var i in Memory.DebugMap){
                ResourceDataHandler.updateAvailable.call(Memory.DebugMap[i], i);
            }
            
            Memory.currentEnergy = currentEnergy;
        }

        // determining our creep price
        var price = BASE_CREEP_PRICE + totalCreeps*75;

        // ensure we don't go overboard here
        if(price > maxEnergy)
                price = maxEnergy
        
        //console.log("price is currently: ", price);


        //spawning in a scout if we have a uninitialized room.
        if(scouts.length < SCOUTS){
            for(var i in Memory.RoomData){
                if(!Memory.RoomData[i].initialized){
                    // store the uninitialized room as our goal room
                    var ret = Game.spawns['Spawn1'].createCustomCreep(200,'scout');
                    if(ret == 0)
                        console.log('Spawning new scout: ' + newName);
                    }
            }
        }
        

        // not going to try and spawn a creep if we don't have the energy
        if(currentEnergy < price){
            return;
        }
        
        // get's the source w/ least creeps that can add creeps
        var minCreeps = 999;
        var SourceIndex = -1;
        for(var i in Memory.DebugMap){
            console.log("should add creep: ", ResourceDataHandler.shouldAddCreep.call(Memory.DebugMap[i]));
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

        // FOR ROLE IN ROLE LIST
            


        // if(longharvesters.length < INITIAL_LONG_RANGE_HARVESTER){
            
        //     return Game.spawns['Spawn1'].createCustomCreep(price,'longharvester');
        // }
        if(wallrepairers.length < WALL_REPAIRER){
            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'wallrepairer');
            if(ret == 0)
                console.log('Spawning new repairer: ' + newName);
        }
        else if(repairers.length < INITIAL_REPAIRERS) {
            

            var ret = Game.spawns['Spawn1'].createCustomCreep(price,'repairer');
            if(ret == 0)
                console.log('Spawning new repairer: ' + newName);
        }
        else if(upgraders.length < INTIAL_UPGRADERS) {
            
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