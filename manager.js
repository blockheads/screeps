 // ROLE_MAP: { 
    //         HARVESTER: roleHarvester,
    //         UPGRADER: roleUpgrader,
    //         BUILDER: roleBuilder,
    //         REPAIRER: roleRepairer,
    //         LONG_HARVESTER: roleLongHarvester,
    //         SCOUT: roleScout,
    //         WALL_REPAIRER: roleWallRepairer,
    // },

const RoleManager = require('role.manager');

// ROLES name -> file name mapping
const ROLES = {'harvester'    : 'harvester',
               'upgrader'     : 'worker.upgrader',
               'builder'      : 'worker.builder',
               'repairer'     : 'worker.repairer',
               'longharvester': 'longHarvester',
               'scout'        : 'scout',
               'wallrepairer' : 'worker.repairer.wall'};

class Manager {

    constructor(){

        this._roleManager = new RoleManager();
        for (var i in ROLES) {
            const RoleClass = require('./role.' + ROLES[i]);
            this._roleManager.registerCreepRole(i, RoleClass);
        }
            
        return Manager.instance;
    }

    getRole(name){
        return this._roleManager.roles[name];
    }

}

const instance = new Manager();
module.exports = instance;