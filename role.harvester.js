var gen = require('util.gen');
var resource = require('resource');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.store.getFreeCapacity() > 0) {
            // Check if we have selected a source yet
            
            if(!creep.memory.source){
                creep.memory.source = resource.findOptimalSource(creep);
                console.log("selected optimal source " + creep.memory.source);
            }
            if(creep.harvest(Game.getObjectById( creep.memory.source)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById( creep.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            
        }
        else {
            //hauling

            // delete from memory if we must
            if(creep.memory.source){
                console.log("deselecting my source is currently: ", creep.memory.source, " ", creep.name);
                resource.DeselectSource(creep);
                console.log("my source is now ", creep.memory.source);
            }
           
                
            // if we don't have any storage selected
            if(!creep.memory.storage){
                creep.memory.storage = resource.findOptimalStorage(creep).id;
                
                // no avaible storage to be found, just excute roleUpgrader code.
                // might want to add a delay so this doesn't use all of our cpu
                if(!creep.memory.storage){
                    roleUpgrader.run(creep);
                }
            }
            else{
                // ensure that our selected storage isn't full
                if(Game.getObjectById(creep.memory.storage).getFreeCapacity == 0 ){
                    // just search for a new storage
                    creep.memory.storage = null;
                }

                else(creep.transfer(Game.getObjectById(creep.memory.storage), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.storage), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            
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