const CREEP_PER_ENERGY = 200;

var ResourceDataHandler = {

    updateTotalStore: function(){
        this.totalStore = 0;
        for(var i in this.storage){
            if(this.storage[i].structureType == STRUCTURE_TOWER)
                this.totalStore += Game.getObjectById(this.storage[i].id).store.getCapacity();
            else
                this.totalStore += Game.getObjectById(this.storage[i].id).store.getCapacity(RESOURCE_ENERGY);
        }
    },

    update: function(){
        ResourceDataHandler.updateTotalStore.call(this);
    },
    
    shouldAddCreep: function(){
        if(this.creeps.length*200 < this.totalStore){
            return true;
        }
        return false;
    },
    
    /**
     * Method which returns boolean determining if this source
     * zone needs another harvester based on it's total score
     * and active creeps
     */
    addCreep: function(creepName){   
        this.creeps.push(creepName);
    },

}

module.exports = ResourceDataHandler;

