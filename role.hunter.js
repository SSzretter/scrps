module.exports ={
	run: function(creep){
		var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{filter: (c) => !_.contains(playerWhiteList,c.owner.username)});
		if (creep.attack(target) == ERR_NOT_IN_RANGE){
			creep.moveTo(target);
		}
		if(target === null && creep.ticksToLive < 1500){
			creep.memory.role = 'recycler';
		}
	}
}
