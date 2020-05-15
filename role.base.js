const OopUtil = require('util.oop');
var resource = require('resource');
const Manager = require('manager');
const ResourceDataHandler = require('./resourceDataHandler');

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

            //var resourceData = Manager.getCreepResourceData(this);
            
            var ret = this.withdraw(target, RESOURCE_ENERGY);
            if( ret == ERR_NOT_IN_RANGE){
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            // this sucks TODO FIX
            if(ret == 0){
                for(var i in Memory.roomData){
                    for(var j in Memory.roomData[i].storage){
                        if(Memory.roomData[i].storage[j].id == this.memory.withdraw){
                            console.log(this.name, " updated ", j, " to ", target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY]);
                            Memory.roomData[i].storage[j].available = target.store.getCapacity(RESOURCE_ENERGY) - target.store[RESOURCE_ENERGY];
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

    getPriorityStorage(){

        this.memory.storage = [];
        //console.log("name: ", this.name, " home: ", this.memory.home);
        try{
            var resourceData = Manager.getCreepResourceData(this);
            this.memory.storage = ResourceDataHandler.getPossibleStorage.call(resourceData, this);
        }
        catch(err){
            //console.log("threw ", err);
        }
            
    }

    getResourceData(){
        return Manager.getCreepResourceData(this);
    }

    updateStorage(storage){
        var value = storage.store.getCapacity(RESOURCE_ENERGY) - storage.store[RESOURCE_ENERGY];
        console.log("udpating ", storage.id, " to ", value);
        ResourceDataHandler.updateStorageStruct.call(this.getResourceData(),storage.id, value);
    }

    moveToPush(target, visualizePathStyle){
        console.log("overridden!");
        
        this.moveTo(target,visualizePathStyle);
        var path = this.pos.findPathTo(target);
        Manager.pushPath(path, this);
        
       
    }

}

OopUtil.extendClass(Creep, BaseCreep);
module.exports = BaseCreep;