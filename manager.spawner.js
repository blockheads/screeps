/**
 * The SpawnManager looks at current data about the game, and attempts to see
 * if it should spawn certain types of creeps. If so it add's them to the spawn priority
 * queue.
 */

const PriorityQueue = require("./util.priorityQueue");
const { ROLE_HARVESTER, ROLE_UPGRADER, ROLE_REPAIRER, ROLE_WALL_REPAIRER, ROLE_BUILDER, ROLE_TRANSPORTER, ROLE_CONTROLLER_TRANSPORTER } = require("./util.role");
const ResourceDataHandler = require("./resourceDataHandler");
const Node = require("./util.node");
const RoleFactory = require("./role.factory");
const States = require("./role.states");
const RoomDataHandler = require("./RoomDataHandler");

const BASE_CREEP_PRICE = 200;

class SpawnManager{

    constructor(roomData, roles){
       
        this._roomData = roomData;
        // for right now we just reconstruct our queue each time this
        // manager is initialized, later on we can save it in memory
        // and re-load it to save start-up time...
        this._roles = roles;
        

        this._spawnQueue = new PriorityQueue();

        for(var i in roles){
            this.updateRole(i);
        }

        Memory.spawnQueue = this._spawnQueue;
        
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
        //console.log("data: ", data);  
        var creepData = data.value;
        //console.log("creep data: ", creepData); 
        if(!creepData)
            return;
        var role = manager.getRole(creepData.role);
        var body = RoleFactory.generateBuild(price, role.build());
        //name generation
        var name = role.gen(); 
        console.log("I would be spawing: ", JSON.stringify(creepData), ", ", JSON.stringify(body), ", ", name);

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
    push(role, amount, memory){
        // let's initialize our memory for the curret creep
        // then the individual update functions can add to this
        if(!memory){
            memory = {};
        }

        //need to define in manager map if this throws exception
        var priority = this._roles[role][1];

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
    updateRole(role){

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
            
        }
    }

    update(){
       var constructionSites = Game.rooms[this._roomData.id].find(FIND_CONSTRUCTION_SITES);

       if(constructionSites.length > 0)
           this.updateBuilders();

        // need a withdraw point to update this.
        if(RoomDataHandler.hasWithdrawPoint.call(this._roomData))
            this.updateTransporters();

    }

    // respawns a creep that died 
    respawn(memory, name){
        if(memory.home && memory.source){
            // deleting from other lad too
            for(var j=0; j < this._roomData.resourceData[memory.source].harvesters.length; j++){
              // iterate over our creep array
              if(this._roomData.resourceData[memory.source].harvesters[j] == name){
                  this._roomData.resourceData[memory.source].harvesters.splice(j,1);
                  //console.log("deleted ", name, " now ", memory.source, ".");
              }

              
            }

            for(var j=0; j < this._roomData.resourceData[memory.source].transporters.length; j++){
                // iterate over our creep array
                if(this._roomData.resourceData[memory.source].transporters[j] == name){
                    this._roomData.resourceData[memory.source].transporters.splice(j,1);
                    //console.log("deleted ", name, " now ", memory.source, ".");
                }
  
            }

        }

        console.log("creep died should re-add to spawnQueue");
        // re-init.
        memory.state = States.INIT;
        this.updateRole(memory.role);
    }


    updateHarvesters(){
        // only spawn in claimed rooms
        if(!this._roomData.controlled)
            return;

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_HARVESTER);

        for(var i in this._roomData.resourceData){

            //ResourceDataHandler.resetHarvesters.call(this._roomData.resourceData[i], harvesters);
            
            var currentHarvesters = ResourceDataHandler.getCurrentHarvesters.call(this._roomData.resourceData[i]);
            var maxHarvesters = ResourceDataHandler.getMaxHarvesters.call(this._roomData.resourceData[i]);

            var amount = maxHarvesters - currentHarvesters-this._spawnQueue.getRoleAmount(ROLE_HARVESTER); 

            if(amount > 0){
                this.push(ROLE_HARVESTER,amount, {source: i});
            }
            
        }
        
    }

    updateUpgraders(){
        if(!this._roomData.controlled)
            return;

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_UPGRADER);
        var amount = 4-upgraders.length-this._spawnQueue.getRoleAmount(ROLE_UPGRADER);

        if(amount > 0){
            this.push(ROLE_UPGRADER, amount);
        }

        
    }

    updateRepairers(){
        if(!this._roomData.controlled)
            return;

        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_REPAIRER);
        var amount = 1-repairers.length-this._spawnQueue.getRoleAmount(ROLE_REPAIRER);

        if(amount > 0){
            this.push(ROLE_REPAIRER, amount);
        }

    }

    updateWallRepairers(){
        if(!this._roomData.controlled)
            return;

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_WALL_REPAIRER);
        var amount = 1-upgraders.length-this._spawnQueue.getRoleAmount(ROLE_WALL_REPAIRER);

        if(amount > 0){
            this.push(ROLE_WALL_REPAIRER, amount);
        }

    }

    updateBuilders(){
        if(!this._roomData.controlled)
            return;

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_BUILDER);
        var amount = 1- builders - this._spawnQueue.getRoleAmount(ROLE_BUILDER);

        if(amount > 0){
            this.push(ROLE_BUILDER, amount);
        }
        

    }

    updateTransporters(){

        if(!this._roomData.controlled)
            return;

        var resourceAmount = Object.keys(this._roomData.resourceData).length;

        for(var i in this._roomData.resourceData){

            // we need a withdraw point for our transporters to work...
            if(ResourceDataHandler.hasWithdrawPoint.call(this._roomData.resourceData[i])){
                var currentTransporters = ResourceDataHandler.getCurrentTransporters.call(this._roomData.resourceData[i]);
                var maxTransporters = ResourceDataHandler.getMaxTransporters.call(this._roomData.resourceData[i]);
    
                var amount = maxTransporters - currentTransporters - this._spawnQueue.getRoleAmount(ROLE_TRANSPORTER); 
    
                if(amount > 0){
                    this.push(ROLE_TRANSPORTER, amount, {withdrawPoint: ResourceDataHandler.getWithdrawPoint.call(this._roomData.resourceData[i]), source: i});
                }
            }
            
        }

        // controller storage transport spawns
        if(this._roomData.controllerStorage){
            var controllerTransporters = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE_CONTROLLER_TRANSPORTER);
            var amount = 1 - controllerTransporters - this._spawnQueue.getRoleAmount(ROLE_CONTROLLER_TRANSPORTER);

            if(amount > 0){
                this.push(ROLE_CONTROLLER_TRANSPORTER, amount, { source: i});
            }
        }

    }

}

module.exports = SpawnManager;