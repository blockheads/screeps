/**
 * Prototype room function extensions
 */
module.exports = function() {

    Room.prototype.getRepairTargets = function () {
        if (!this._repairTargets) {
            this._repairTargets = this.find(FIND_STRUCTURES, {
                filter: struct => struct.hits < struct.hitsMax &&
                                  struct.structureType != STRUCTURE_WALL &&
                                  struct.structureType != STRUCTURE_RAMPART,
            })
            
            this._repairTargets = _.sortBy(this._repairTargets, struct => struct.hits - struct.hitsMax);
        }
        return this._repairTargets;
    };


    /**
     * Extension method for getting wall specific Structure repair
     * targets.
     */
    Room.prototype.getWallRepairTargets = function () {
        if (! this._repairTargetsWalls) {
            this._repairTargetsWalls = this.find(FIND_STRUCTURES, {
                filter: struct => struct.hits < struct.hitsMax &&
                (struct.structureType == STRUCTURE_WALL ||
                struct.structureType == STRUCTURE_RAMPART)
            })
            this._repairTargetsWalls = _.sortBy(this._repairTargetsWalls, struct => struct.hits - struct.hitsMax);
        }
        return this._repairTargetsWalls;
    };

}