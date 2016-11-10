 /*
  * very similar to role.reserver
  */

module.exports = {
	run : function(creep){
		var myflag = Game.flags[creep.memory.myflag];
        if(myflag == undefined){
            myflag = Game.flags['claim'];
        }
		var closeto = creep.pos.inRangeTo(Game.flags[creep.memory.myflag],4);
		if(closeto){
			var con = _.filter(Game.flags[creep.memory.myflag].pos.lookFor(LOOK_STRUCTURES),(s) => s.structureType == STRUCTURE_CONTROLLER)[0];
			var res = creep.claimController(con);
			if ( res == ERR_NOT_IN_RANGE){
				creep.moveTo(con);
			}
			else if(res==OK)
			{
			    creep.memory.role="colonist";
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
}
