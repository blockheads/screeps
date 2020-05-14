/**
 * The SpawnManager looks at current data about the game, and attempts to see
 * if it should spawn certain types of creeps. If so it add's them to the spawn priority
 * queue.
 */

const PriorityQueue = require("./util.priorityQueue");
const { ROLE_HARVESTER, ROLE_UPGRADER, ROLE_REPAIRER, ROLE_WALL_REPAIRER, ROLE_BUILDER } = require("./util.role");
const ResourceDataHandler = require("./resourceDataHandler");
const Node = require("./util.node");
const RoleFactory = require("./role.factory");

const BASE_CREEP_PRICE = 200;

class SpawnManager{

    constructor(roomData, roles){
        this._spawnQueue = new PriorityQueue(); 
        this._roomData = roomData;
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
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.home == this._roomData.id);
        var price = BASE_CREEP_PRICE + creeps.length*75;

        // ensure we don't go overboard here
        if(price > manager.maxEnergy)
                price = manager.maxEnergy
        
        // // and we don't try to spawn anything if we cannot.
        if(manager.currentEnergy < price)
            return;

        // get available spawns
        // have to add this later

        // can't be spawning
        if(Game.spawns['Spawn1'].spawning)
            return; 

        // spawn creep
        var data = this.getNext();
        console.log("data: ", data);  
        var creepData = data.value;
        console.log("creep data: ", creepData); 
        if(!creepData)
            return;
        var role = manager.getRole(creepData.role);
        var body = RoleFactory.generateBuild(price, role.build());
        //name generation
        var name = role.gen(); 
        //console.log("I would be spawing: ", JSON.stringify(creepData), ", ", JSON.stringify(body), ", ", name);

        Game.spawns['Spawn1'].createCreep(body, name, creepData);

    }

    printQueue(){
        var queue =  this._spawnQueue.getList();
        for(var i in queue){
            console.log("i: ", i, "(",  JSON.stringify(queue[i].value), ", ", queue[i].priority);
        }
    }

    /**
     * Get's the next creep on the priority queue
     */
    getNext(){
        //console.log("getNext empty ", this._spawnQueue.empty());
        if(this._spawnQueue.empty())
            return false;
        return this._spawnQueue.pop();
    }

    /**
     * Pushes a creep on the priority queue.
     * @param {Creep} creep The creep to push
     * @param {int} priority Priority value of creep in queue
     */
    push(role, priority, amount, memory){
        // let's initialize our memory for the curret creep
        // then the individual update functions can add to this
        if(!memory){
            memory = {};
        }
        memory.home = this._roomData.id;
        memory.role = role;
        for(var i=0; i < amount; i++){
            this._spawnQueue.push(new Node(memory, priority));
        }

    }

    /**
     * Pushes back a node on the queue, subtracting it's amount by one.
     * If the amount is 0, it does not push back
     * @param {Node} data the node to push back on the queue
     */
    pushBack(data){
        data.amount = data.amount - 1;
        console.log("data.amount: ", data.amount)
        if(data.amount > 0){
            this._spawnQueue.push(data);
            console.log("pushed back again.");
        }
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
        this.update(memory.role);
    }


    updateHarvesters(){
        // only spawn in claimed rooms
        if(!this._roomData.controlled)
            return;

        for(var i in this._roomData.resourceData){
            var currentHarvesters = ResourceDataHandler.getCurrentHarvesters.call(this._roomData.resourceData[i]);
            var maxHarvesters = ResourceDataHandler.getMaxHarvesters.call(this._roomData.resourceData[i]);

            var amount = maxHarvesters - currentHarvesters; 

            if(amount > 0){
                this.push(ROLE_HARVESTER,0,amount, {source: i});
            }
            
        }
        
    }

    updateUpgraders(){
        if(!this._roomData.controlled)
            return;

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_UPGRADER);
        var amount = 4-upgraders.length;

        if(amount > 0){
            this.push(ROLE_UPGRADER,1, amount);
        }

        
    }

    updateRepairers(){
        if(!this._roomData.controlled)
            return;

        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_REPAIRER);
        var amount = 1-repairers.length;

        if(amount > 0){
            this.push(ROLE_REPAIRER,2, amount);
        }

    }

    updateWallRepairers(){
        if(!this._roomData.controlled)
            return;

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_WALL_REPAIRER);
        var amount = 1-upgraders.length;

        if(amount > 0){
            this.push(ROLE_WALL_REPAIRER,3, amount);
        }

    }

    updateBuilders(){
        if(!this._roomData.controlled)
            return;

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_BUILDER);
        var amount = 0-builders.length;

        if(amount > 0){
            this.push(ROLE_BUILDER,4, amount);
        }

    }

}

module.exports = SpawnManager;