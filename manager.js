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
const ConstructionManager = require('./manager.construction');
const RoomData = require('./roomData');
const RoomDataHandler = require('RoomDataHandler');
const { ROLE_HARVESTER, ROLE_UPGRADER, ROLE_BUILDER, ROLE_REPAIRER, ROLE_LONG_HARVESTER, ROLE_SCOUT, ROLE_WALL_REPAIRER, 
    ROLE_HARVESTER_PRIORITY, ROLE_UPGRADER_PRIORITY, ROLE_BUILDER_PRIORITY, ROLE_REPIARER_PRIORITY, ROLE_LONG_HARVESTER_PRIORITY, 
    ROLE_SCOUT_PRIORITY, ROLE_WALL_REPAIRER_PRIORITY } = require('./util.role');

// ROLES name -> file name mapping , priority
const ROLES = {};
ROLES[ROLE_HARVESTER] = ['harvester', ROLE_HARVESTER_PRIORITY];
ROLES[ROLE_UPGRADER] = ['worker.upgrader', ROLE_UPGRADER_PRIORITY];
ROLES[ROLE_BUILDER] = ['worker.builder', ROLE_BUILDER_PRIORITY];
ROLES[ROLE_REPAIRER] = ['worker.repairer', ROLE_REPIARER_PRIORITY];
ROLES[ROLE_LONG_HARVESTER] = ['longHarvester', ROLE_LONG_HARVESTER_PRIORITY];
ROLES[ROLE_SCOUT] = ['scout', ROLE_SCOUT_PRIORITY];
ROLES[ROLE_WALL_REPAIRER] = ['worker.repairer.wall', ROLE_WALL_REPAIRER_PRIORITY];

// room data
const ROOMS = ['W47S15', 'W47S14'];

class Manager {

    constructor(){

        this._roleManager = new RoleManager();

        // load in our room memory
        this._loadRoomMemory();

        for (var i in ROLES) {
            const RoleClass = require('./role.' + ROLES[i][0]);
            this._roleManager.registerCreepRole(i, RoleClass); 
        }

        // constructing our spawn managers for each room
        this._spawnManagers = {};
        this._constructionManagers = {};
        for(var i in ROOMS){
 
            if(this._roomData[ROOMS[i]].controlled){
                this._spawnManagers[ROOMS[i]] = new SpawnManager(this._roomData[ROOMS[i]], ROLES);
                this._constructionManagers[ROOMS[i]] = new ConstructionManager(ROOMS[i]);
            }
                
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
        //if(!Memory.maxEnergy ||  this.maxEnergy != Memory.maxEnergy){

        for(var i in this._roomData){
            RoomDataHandler.update.call(this._roomData[i]);    
        }

        Memory.maxEnergy =  this.maxEnergy;
        
        //}

        // get our current energy
        //this.currentEnergy = Game.spawns['Spawn1'].room.energyAvailable;
        // caching out current energy as well
        //if(!Memory.currentEnergy || this.currentEnergy != Memory.currentEnergy){
         
            //console.log("updating available storage.");

        //for(var i in this._roomData){
            //RoomDataHandler.updateAvailable.call(this._roomData[i]);
        //}
        
        //Memory.currentEnergy = this.currentEnergy;
        //}

        // attempt to spawn a creep
        for(var i in this._spawnManagers){
            // right now since i'm lazy
            this._spawnManagers[i].spawn(this);
            
        }

        for(var i in this._constructionManagers){
            this._constructionManagers[i].update(this._roomData[i].resourceData);
        }

        // update our memory
        this._roomData = Memory.roomData;
    }

    respawn(memory,name){
        // we can re-work how this works later...
        // if(memory.home && memory.source){
        //       // deleting from other lad too
        //       for(var j=0; j < this._roomData[memory.home].resourceData[memory.source].creeps.length; j++){
        //         // iterate over our creep array
        //         if(this._roomData[memory.home].resourceData[memory.source].creeps[j] == name){
        //             this._roomData[memory.home].resourceData[memory.source].creeps.splice(j,1);
        //             memory.source = null; 
        //             //console.log("deleted ", name, " now ", memory.source, ".");
        //             return;
        //         }
        //     }
        // }
        
        console.log("memory home: ", memory.home);
        console.log("spawn managers: ", JSON.stringify(this._spawnManagers));
        this._spawnManagers[memory.home].respawn(memory);
    }

    // debug method for printing out spawn queues
    printSpawns(){
        for(var i in this._spawnManagers){
            this._spawnManagers[i].printQueue();
        }
    }

    /**
     * Get's resourceData corresponding to a particular creep
     */
    getCreepResourceData(creep){
        // error handling
        if(!creep.memory.home)
            throw "Error. invalid creep, requires home in memory.";
        if(!creep.memory.source)
            throw "Error. Creep need's a source specified in order to get resourceData.";

        return this._roomData[creep.memory.home].resourceData[creep.memory.source];
    }

    _loadRoomMemory(){

        if(!Memory.roomData){
            // our roomData is a map
            this._roomData = new Map();
            // iterate over specified rooms
            for(var j in ROOMS){

                console.log("generating room: ", Game.rooms[ROOMS[j]]);
                console.log("the room we want: ", JSON.stringify(Game.rooms));
                // if we have data on the room
                if(Game.rooms[ROOMS[j]]){
                    var controller = Game.rooms[ROOMS[j]].controller;
                    this._roomData[ROOMS[j]] = new RoomData(ROOMS[j], controller.my, true);
                    
                }
                else{
                    this._roomData[ROOMS[j]] = new RoomData(ROOMS[j], false, false);
                }
                
            }

            Memory.roomData = this._roomData;
        } 
        else{
            // otherwise we just load in our roomData normally
            this._roomData = Memory.roomData;
        }
        
    }
    
    pushPath(path, creep){
        this._constructionManagers[creep.memory.home].pushPath(path);
    }
    
    printPaths(){
        for(var i in ROOMS){
 
            if(this._roomData[ROOMS[i]].controlled){
                this._constructionManagers[ROOMS[i]].printPathMap();
            }
        }
    }

}

const instance = new Manager();
module.exports = instance;