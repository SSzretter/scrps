var tasks = require('tasks')

module.exports = {
	run : function(creep){
		if (creep.memory.mine != 0 && creep.memory.mine != 1){ //this works only assuming two mines and two miners
			var miners = creep.room.find(FIND_MY_CREEPS,{filter: (c) => c.memory.role == 'miner'});
			if(miners.length && miners[0].memory.mine == 1){
				creep.memory.mine = 0;
			}
			else{
				creep.memory.mine = 1;
			}
		}
		var mySource = creep.room.find(FIND_SOURCES)[creep.memory.mine];
		if(mySource!==undefined)
		{
	    	var myContainer = _.filter(mySource.pos.findInRange(FIND_STRUCTURES,1),(s) => s.structureType == STRUCTURE_CONTAINER)[0];
	    	var myDropped = mySource.pos.findInRange(FIND_DROPPED_ENERGY,1)[0];
		}
		else
		{
		    creep.memory.mine=0;
		}
		var myEnergy = ( myContainer != undefined ? myContainer.store.energy : 0 ) + ( myDropped != undefined ? myDropped.amount : 0 );
		if (myEnergy < 2000){ //should limit overmining and triggering invaders too early, but is a bit of a waste to check every tick
			tasks.mine(creep,mySource);
		}
	}
}
