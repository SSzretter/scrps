var tasks = require('tasks');

module.exports = {
	run : function(creep){
		if(creep.memory.homeRoom == undefined || creep.room.name == creep.memory.homeRoom ){
			var spawn = creep.room.find(FIND_STRUCTURES,
				{filter : (s) => s.structureType == STRUCTURE_SPAWN})[0];
			tasks.recycle(creep,spawn);
		}
		else{
			creep.moveTo(Game.rooms[creep.memory.homeRoom].find(FIND_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_SPAWN })[0]);
		}
	}
}
