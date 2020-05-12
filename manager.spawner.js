/**
 * The SpawnManager looks at current data about the game, and attempts to see
 * if it should spawn certain types of creeps. If so it add's them to the spawn priority
 * queue.
 */

const PriorityQueue = require("./util.priorityQueue");
const { ROLE_HARVESTER, ROLE_UPGRADER, ROLE_REPAIRER, ROLE_WALL_REPAIRER, ROLE_BUILDER } = require("./util.role");
const ResourceDataHandler = require("./resourceDataHandler");
const Node = require("./util.node");

const BASE_CREEP_PRICE = 200;

class SpawnManager{

    constructor(roomId, roles){
        this._spawnQueue = new PriorityQueue();
        this._room = roomId;
        // for right now we just reconstruct our queue each time this
        // manager is initialized, later on we can save it in memory
        // and re-load it to save start-up time...
        for(var i in roles){
            this.update(i);
        }
    }

    /**
     * Attempts to spawn a creep at the top of the spawn queue
     */
    spawn(manager){
        var price = BASE_CREEP_PRICE + Game.creeps.length*75;

        // ensure we don't go overboard here
        if(price > manager.maxEnergy)
                price = manager.maxEnergy
        
        // and we don't try to spawn anything if we cannot.
        if(manager.currentEnergy < price)
            return;

        //var creepData = this.getNext();
        //var creepBuild = manager.getRole(creepData.value).getBuild(price);
    }

    printQueue(){
        return this._spawnQueue.print();
    }

    /**
     * Get's the next creep on the priority queue
     */
    getNext(){
        return this._spawnQueue.pop()[0];
    }

    /**
     * Pushes a creep on the priority queue.
     * @param {Creep} creep The creep to push
     * @param {int} priority Priority value of creep in queue
     */
    push(data, priority, amount){
        this._spawnQueue.push(new Node(data, priority, amount));
    }

    /**
     * Updates a specific creep role type in the spawn queue.
     * @param {Int} role Creep Role Type integer
     */
    update(role){

        switch(role){
            case ROLE_HARVESTER:
                this.updateHarvesters();
                break;
            case ROLE_UPGRADER:
                this.updateUpgraders();
                break;
            case ROLE_REPAIRER:
                this.updateRepairers();
                break;
            case ROLE_WALL_REPAIRER:
                this.updateWallRepairers();
                break;
            case ROLE_BUILDER:
                this.updateBuilders();
                break;
            
        }
    }

    // respawns a creep that died
    respawn(memory){
        console.log("creep died should re-add to spawnQueue");
    }


    updateHarvesters(){
        // only spawn in claimed rooms
        if(!Memory.RoomData[this._room].controlled)
            return;


        for(var i in Memory.RoomData[this._room].resourcedata){
            var currentHarvesters = ResourceDataHandler.getCurrentHarvesters.call(Memory.RoomData[this._room].resourcedata[i]);
            var maxHarvesters = ResourceDataHandler.getMaxHarvesters.call(Memory.RoomData[this._room].resourcedata[i]);

            var amount = maxHarvesters - currentHarvesters;

            if(amount > 0){
                this.push(ROLE_HARVESTER,10,amount);
            }
            
        }
        
    }

    updateUpgraders(){
        if(!Memory.RoomData[this._room].controlled)
            return;

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_UPGRADER);
        var amount = 5-upgraders.length;

        if(amount > 0){
            this.push(ROLE_UPGRADER,9, amount);
        }

        
    }

    updateRepairers(){
        if(!Memory.RoomData[this._room].controlled)
            return;

        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_REPAIRER);
        var amount = 1-repairers.length;

        if(amount > 0){
            this.push(ROLE_REPAIRER,8, amount);
        }

    }

    updateWallRepairers(){
        if(!Memory.RoomData[this._room].controlled)
            return;

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_WALL_REPAIRER);
        var amount = 1-upgraders.length;

        if(amount > 0){
            this.push(ROLE_WALL_REPAIRER,7, amount);
        }

    }

    updateBuilders(){
        if(!Memory.RoomData[this._room].controlled)
            return;

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_BUILDER);
        var amount = 0-builders.length;

        if(amount > 0){
            this.push(ROLE_BUILDER,6, amount);
        }

    }

}

module.exports = SpawnManager;