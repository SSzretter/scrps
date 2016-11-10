/*
 * Currently, dismantler has to be in target room already.
 *
 */

module.exports ={
    run : function(creep){
        var dismantleFlags = creep.room.find(FIND_FLAGS,{filter: (f) => /dismantle/.test(f.name)});
        var numFlags = dismantleFlags.length;
        var target = undefined;
        if(creep.room.name != Game.flags['dismantle1'].pos.roomName){
            var wayPoint = Game.flags[creep.memory.waypoint[0]];
            if(wayPoint != undefined){
                if(creep.room.name == wayPoint.pos.roomName){
                    creep.memory.waypoint.shift();
                }
                creep.moveTo(wayPoint);
            }
            else{
                creep.moveTo(Game.flags['dismantle1']);
            }
        }
        else{
            for(i=1 ; i<=numFlags ; i++){
                var myFlag = 'dismantle' + i;
                var structsAtPlace = _.filter(Game.flags[myFlag].pos.lookFor(LOOK_STRUCTURES), (s) => s.structureType != STRUCTURE_ROAD);
                if(structsAtPlace.length > 0){
                    target = structsAtPlace[0];
                    break;
                }
            }
            if(target != undefined){
                if(creep.dismantle(target) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
        }
    }
}
