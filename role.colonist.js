/*
 * This role gets energy from the home room, then walks to the target room and changes
 * role according to the situation.
 */

var tasks = require('tasks');

module.exports = {
	run : function(creep){
		var myflag = Game.flags[creep.memory.myflag];
		if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('col getting');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('col upgrading');
	    }

		if(creep.memory.upgrading){
			if(creep.room.name == Game.flags[creep.memory.myflag].pos.roomName){
				if(creep.upgradeController(creep.room.controller)==ERR_NOT_IN_RANGE){
					creep.moveTo(creep.room.controller);
				}
				else
				{
					//console.log(creep.upgradeController(creep.room.controller));
				}
				
			}
			else{
				var wayPoint = Game.flags[creep.memory.waypoint];
	            if(wayPoint != undefined){
	                if(creep.room.name == wayPoint.pos.roomName){
	                    creep.memory.waypoint = undefined
	                }
	                creep.moveTo(wayPoint);
	            }
	            else{
	                creep.moveTo(myflag);
	            }
			}
		}
		else{   //remote colonist (claim)
			if(creep.room.name == Game.flags[creep.memory.myflag].pos.roomName){
				var spawns = creep.room.find(FIND_MY_STRUCTURES, {filter : (s) => s.structureType == STRUCTURE_SPAWN});
				if(!spawns.length){
				    if(Game.flags['placespawn']!==undefined)
    					Game.flags['placespawn'].pos.createConstructionSite(STRUCTURE_SPAWN);
				}
				creep.memory.role = 'civilian'
			}
			else{
				tasks.getenergy(creep);
			}
		}
	}
}
