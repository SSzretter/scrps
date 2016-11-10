/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */


var tasks=require('tasks');

module.exports = {
    run: function(creep){
         if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.memory.sourceNo = undefined; //resets the finding logic
            creep.say('harvesting');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }

	    if(creep.memory.upgrading){
	        if(creep.upgradeController(creep.room.controller)==ERR_NOT_IN_RANGE){
	            creep.moveTo(creep.room.controller);
	        }
	    }
		else if(creep.ticksToLive < 100){
			creep.memory.role = 'recycler';
		}
        else { //get energy in priority: dropped, container, storage, harvest
			tasks.getenergy(creep);
	    }
    }
};
