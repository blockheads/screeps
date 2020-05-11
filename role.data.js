/**
 * Data/ constants corresponding to creeps :o) <--- Happy holidays from bobo the clown
 */

 var data = {

    // here all the string names for each role are defined, later mapped
    // to each class
    HARVESTER: 'harvester',
    UPGRADER: 'upgrader',
    BUILDER: 'builder',
    REPAIRER: 'repairer',
    LONG_HARVESTER: 'longharvester',
    SCOUT: 'scout',
    WALL_REPAIRER: 'wallrepairer',

    // /**
    //  * ROLE MAP stores all of the data mapping each role to it's specific class
    //  * this allows us to just iterate over this and call their expected behavior for each
    //  * role
    //  */
    ROLE_MAP: { 
            HARVESTER: roleHarvester,
            UPGRADER: roleUpgrader,
            BUILDER: roleBuilder,
            REPAIRER: roleRepairer,
            LONG_HARVESTER: roleLongHarvester,
            SCOUT: roleScout,
            WALL_REPAIRER: roleWallRepairer,
    },

}


module.exports = data;