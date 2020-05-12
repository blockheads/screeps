const OopUtil = require('util.oop');
var resource = require('resource');

class BaseCreep{

    getWithdraw(){
        this.memory.working = false;
        this.memory.source = null;
        const containersWithEnergy = this.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                           i.store[RESOURCE_ENERGY] > 0
        });

        if(containersWithEnergy.length > 0){
            this.say('🏧');
            // store where we want to withdraw from
            this.memory.withdraw = containersWithEnergy[0].id;
            return true;
        }
        
        // failed
        return false;

    }

    /**
     * Nulls out withdraw
     */
    getSource(){
        this.memory.working = false;
        this.memory.source = resource.findOptimalSource(this);
        this.memory.withdraw = null;
        this.say('🔄');
    }


    /**
     * Container specific withdraw logic
     */
    withdrawContainer(){
        var target = Game.getObjectById(this.memory.withdraw);
        // check that the store we are withdrawing from isn't 0 now
        if(!target || target.store[RESOURCE_ENERGY] == 0){
            this.memory.withdrawing = false;
        }
        else {
            
            var ret = this.withdraw(target, RESOURCE_ENERGY);
            if( ret == ERR_NOT_IN_RANGE){
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            if(ret == 0){
                for(var i in Memory.DebugMap){
                    for(var j in Memory.DebugMap[i].storage){
                        if(Memory.DebugMap[i].storage[j].id == this.memory.withdraw){
                            console.log(this.name, " updated ", j, " to ", target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY]);
                            Memory.DebugMap[i].storage[j].available = target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY];
                        }
                    }
                    
                }
                
            }
        }
    }

    getContainerWithdraw(){
        const containersWithEnergy = this.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                           i.store[RESOURCE_ENERGY] > 0
        });

        return containersWithEnergy;

    }

    getHarvestSource(){
        return resource.findOptimalSource(this);
    }

}

OopUtil.extendClass(Creep, BaseCreep);
module.exports = BaseCreep;