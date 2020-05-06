const roleBuilder = require("./role.builder");
const roleUpgrader = require("./role.upgrader");
const roleRepairer = require("./role.repairer");
const roleHarvester = require("./role.harvester");
const ResourceDataHandler = require('resourceDataHandler');

module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName, opt) {
            console.log("now i am ", opt);
            if (typeof opt === 'undefined') { opt = null; }

            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
            
            // remaining energy
            var remainingEnergy = energy - Math.floor(energy / 200)*200;
            var name = "A Mistake";

            if(roleName == 'builder'){
                if(remainingEnergy >= 50){
                    body.push(CARRY);
                    remainingEnergy -= 50;
                }
                if(remainingEnergy >= 100){
                    body.push(WORK);
                    remainingEnergy -= 100;
                }
                if(remainingEnergy >= 50){
                    body.push(MOVE);
                    remainingEnergy -= 50;
                }

                name = roleBuilder.gen();
            }
            else if(roleName == 'harvester'){
                if(remainingEnergy >= 50){
                    body.push(MOVE);
                    remainingEnergy -= 50;
                }
                if(remainingEnergy >= 100){
                    body.push(WORK);
                    remainingEnergy -= 100;
                }
                if(remainingEnergy >= 50){
                    body.push(CARRY);
                    remainingEnergy -= 50;
                }

                name = roleHarvester.gen();
            }
            else if(roleName == 'upgrader'){
                if(remainingEnergy >= 50){
                    body.push(MOVE);
                    remainingEnergy -= 50;
                }
                if(remainingEnergy >= 50){
                    body.push(CARRY);
                    remainingEnergy -= 50;
                }
                if(remainingEnergy >= 50){
                    body.push(MOVE);
                    remainingEnergy -= 50;
                }
                
                name = roleUpgrader.gen();
            }
            else if(roleName == 'repairer'){
                if(remainingEnergy >= 50){
                    body.push(MOVE);
                    remainingEnergy -= 50;
                }
                if(remainingEnergy >= 50){
                    body.push(CARRY);
                    remainingEnergy -= 50;
                }
                if(remainingEnergy >= 50){
                    body.push(MOVE);
                    remainingEnergy -= 50;
                }

                name = roleRepairer.gen();
            }
            //console.log("body ", body, " name ", name, " role ", roleName);

            // create creep with the created body and the given role
            if(opt == null){
                return this.createCreep(body, name, { role: roleName});
                
            }
                
            var ret = this.createCreep(body, name, { role: roleName, source: Memory.DebugMap[opt].id});

            if(ret == name){
                ResourceDataHandler.addCreep.call(Memory.DebugMap[opt],name);
                console.log("adding custom creep ", name);
            }
                
            return ret;
        };
};