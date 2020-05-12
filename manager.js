 // ROLE_MAP: { 
    //         HARVESTER: roleHarvester,
    //         UPGRADER: roleUpgrader,
    //         BUILDER: roleBuilder,
    //         REPAIRER: roleRepairer,
    //         LONG_HARVESTER: roleLongHarvester,
    //         SCOUT: roleScout,
    //         WALL_REPAIRER: roleWallRepairer,
    // },

const RoleManager = require('role.manager');
const SpawnManager = require('./manager.spawner');
const ResourceDataHandler = require('resourceDataHandler');

// ROLES name -> file name mapping
const ROLES = {};
ROLES['harvester'] = 'harvester';
ROLES['upgrader'] = 'worker.upgrader';
ROLES['builder'] = 'worker.builder';
ROLES['repairer'] = 'worker.repairer';
ROLES['longharvester'] = 'longHarvester';
ROLES['scout'] = 'scout';
ROLES['wallrepairer'] = 'worker.repairer.wall';

class Manager {

    constructor(){

        this._roleManager = new RoleManager();
        for (var i in ROLES) {
            const RoleClass = require('./role.' + ROLES[i]);
            this._roleManager.registerCreepRole(i, RoleClass);
        }
        // constructing our spawn managers for each room
        this._spawnManagers = {};
        for(var i in Memory.RoomData){
            this._spawnManagers[i] = new SpawnManager(i,ROLES);
        }

        return Manager.instance;
    }
    getRole(name){
        return this._roleManager.roles[name];
    }

    // updates general manager data
    update(){

        // get our max energy
        this.maxEnergy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
        // caching our max energy, it also determines if we should check for updates
        if(!Memory.maxEnergy ||  this.maxEnergy != Memory.maxEnergy){

            console.log("Max Energy updated... updating");
            for(var i in Memory.DebugMap){
                ResourceDataHandler.update.call(Memory.DebugMap[i], Game.spawns['Spawn1'].room, Game.getObjectById(i));    
            }

            Memory.maxEnergy =  this.maxEnergy;
            
        }

        // get our current energy
        this.currentEnergy = Game.spawns['Spawn1'].room.energyAvailable;
        // caching out current energy as well
        if(!Memory.currentEnergy || this.currentEnergy != Memory.currentEnergy){
         
            console.log("updating available storage.");

            for(var i in Memory.DebugMap){
                ResourceDataHandler.updateAvailable.call(Memory.DebugMap[i], i);
            }
            
            Memory.currentEnergy = this.currentEnergy;
        }

        // attempt to spawn a creep
        for(var i in this._spawnManagers){
            // right now since i'm lazy
            this._spawnManagers[i].spawn(this);
        }
    }

    respawn(memory){
        this._spawnManagers[memory.home].respawn(memory);
    }

    // debug method for printing out spawn queues
    printSpawns(){
        for(var i in this._spawnManagers){
            this._spawnManagers[i].printQueue();
        }
    }

}

const instance = new Manager();
module.exports = instance;