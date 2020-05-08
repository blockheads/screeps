var gen = require('util.gen');
var resource = require('resource');
var roleUpgrader = require('role.upgrader');
const roleBuilder = require('./role.builder');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.mining && !creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.storage = null; 
            // Check if we have selected a source yet
            
            // if(!creep.memory.source){
            //     creep.memory.source = resource.findOptimalSource(creep);
            //     //console.log("selected optimal source " + creep.memory.source);
            // }
            if(creep.harvest(Game.getObjectById( creep.memory.source)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById( creep.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
            }

            // // remove storage
            // if(creep.memory.storage){
            //     creep.memory.storage = null;
            // }
            
        }
        else {
            creep.memory.mining = false;
            // if we aren't mining get our current carry 
            var carry = creep.carry.getUsedCapacity(RESOURCE_ENERGY);

            //console.log("creep ", creep.name, " carry ", carry);
            if(!carry || carry == 0){
                // mining
                //console.log("creep ", creep.name, " carry ", carry, " mining now.");
                creep.memory.mining = true;
            }
            else{
                //hauling
                if(!creep.memory.storage){
                    // assigning this creep storage
                    
                    creep.memory.storage = [];
                    
                    for(var i in Memory.DebugMap[creep.memory.source].storage){
                        var available = Memory.DebugMap[creep.memory.source].storage[i].available;
                        if(available != 0){
                            // subtract however much we are removing from available
                            if(carry > available){
                                console.log("removing everything from this guy.");
                                Memory.DebugMap[creep.memory.source].storage[i].available = 0;
                            }
                            else{
                                console.log("don't have enough to remove all available");
                                Memory.DebugMap[creep.memory.source].storage[i].available = Memory.DebugMap[creep.memory.source].storage[i].available - carry;
                            }
                            carry -= available;
                            console.log("creep ", creep.name, "selected storage ", Memory.DebugMap[creep.memory.source].storage[i].id, " with ", carry, "left.");
                            creep.memory.storage.push(Memory.DebugMap[creep.memory.source].storage[i].id);
                        }
                        if(carry <= 0 ){
                            break;
                        }
    
                    }
                }
                else if(creep.memory.selectedStorage || creep.memory.storage.length > 0){
                    
                    if(!creep.memory.selectedStorage){
                        creep.memory.selectedStorage = creep.memory.storage.shift();
                    }
    
                    storage = Game.getObjectById(creep.memory.selectedStorage);
                    // ensure that our selected storage isn't full
                    if(storage.store[RESOURCE_ENERGY] == storage.store.getCapacity(RESOURCE_ENERGY)){
                        // just search for a new storage
                        creep.memory.selectedStorage = null;
                    }
                    
                    var ret = creep.transfer(storage, RESOURCE_ENERGY)
                    
                    if( ret == ERR_NOT_IN_RANGE){
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    
                    // null out and move to the next available storage element
                    if( ret == 0 ){
                        creep.memory.selectedStorage = null;
                    }
                    
                }
                else{
                    creep.memory.storage = null; 
                    console.log("Nothing to do for ", creep.name);
                    roleBuilder.run(creep);       
                }
            }
            

            // delete from memory if we must
            // if(creep.memory.source){
            //     console.log("deselecting my source is currently: ", creep.memory.source, " ", creep.name);
            //     resource.DeselectSource(creep);
            //     console.log("my source is now ", creep.memory.source);
            // }
           
                
            // if we don't have any storage selected
            // if(!creep.memory.storage){
            //     creep.memory.storage = resource.findOptimalStorage(creep).id;
            //     //console.log("found optimal storage: ", creep.memory.storage);
            //     // no avaible storage to be found, just excute roleUpgrader code.
            //     // might want to add a delay so this doesn't use all of our cpu
                
            // }

            //var storage = Game.getObjectById(creep.memory.storage);
            
            
                
        }
        
    },
    /**
     * generates a harvester name
     */
    gen: function(){
        name = "✂Harvester✂" + gen.get();
        return name;
    }
};

module.exports = roleHarvester;