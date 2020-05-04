const roleBuilder = require("./role.builder");
const roleUpgrader = require("./role.upgrader");
const roleRepairer = require("./role.repairer");

module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
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
            
            var name = "A Mistake";

            if(roleName == 'builder'){
                name = roleBuilder.gen();
            }
            else if(roleName == 'harvester'){
                name = roleBuilder.gen();
            }
            else if(roleName == 'upgrader'){
                name = roleUpgrader.gen();
            }
            else if(roleName == 'repairer'){
                name = roleRepairer.gen();
            }

            // create creep with the created body and the given role
            return this.createCreep(body, name, { role: roleName});
        };
};