const RoleManager = function () {
	this.roles = {};
};

RoleManager.prototype.registerCreepRole = function (roleId, role) {
	this.roles[roleId] = role;
};

RoleManager.prototype.run = function (creep) {

    // don't run if spawning still
    if(creep.spawning)
        return
    
    // run each creep through our mapped roles.
    this.roles[creep.memory.role].run(creep);

}

module.exports = RoleManager;