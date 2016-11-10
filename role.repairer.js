/* This is a builder that prefers repairing non-walls over building.
 * So having at least one of these makes sure other infrastructure
 * does not degrade while a big building project is running.
 */

var tasks=require('tasks');
// var roleBuilder=require('role.builder');

module.exports = {
     run: function(creep) {

	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.memory.sourceNo = undefined; //resets the finding logic
            creep.say('getting');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('repairing');
	    }
	    if(creep.memory.repairing){
			if(tasks.rep(creep) == -1){ //try, if unsuccessful try next task
				if(tasks.repWall(creep) == -1){
					if(tasks.fill(creep,[STRUCTURE_TOWER]) == -1){
						var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
						tasks.construct(creep,targets[0]);
					}
				}
			}
	    }
		else if(creep.ticksToLive < 200){
			creep.memory.role = 'recycler';
		}
	    else { //get energy in priority: dropped, container, storage, harvest
			tasks.getenergy(creep);
	    }
     }
};
