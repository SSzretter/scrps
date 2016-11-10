/*
 * Currently only works on flag named 'Steal'.
 *
 */

var tasks = require('tasks')

module.exports = {
    run : function(creep){
        if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
            creep.say('stealing');
	    }
	    if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.delivering = true;
	        creep.say('delivering');
	    }

        if(creep.room.name != creep.memory.homeRoom){
            if(creep.memory.delivering){
				creep.moveTo(Game.rooms[creep.memory.homeRoom].find(FIND_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_STORAGE })[0] );
            }
            else if(creep.room.name == Game.flags['Steal'].pos.roomName){
                target=Game.flags['Steal'].pos.findClosestByRange(FIND_STRUCTURES,{
                    filter: (s) => s.energy > 25 || ((s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store.energy > 25)
                });
                if(creep.withdraw(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
            else{
                creep.moveTo(Game.flags['Steal']);
            }
        }
        else if (creep.room.name == creep.memory.homeRoom){
			if (creep.memory.delivering){
				tasks.fill(creep,[STRUCTURE_STORAGE]);
			}
			else if(creep.ticksToLive < 250){
				creep.memory.role = 'recycler';
			}
			else{
				creep.moveTo(Game.flags['Steal']);
			}
		}
    }
}
