module.exports = {
    run : function(creep){
        var myflag = Game.flags[creep.memory.myflag];
        if(myflag == undefined){
            myflag = Game.flags['Raid'];
        }
        var damaged = _.sortBy(creep.pos.findInRange(FIND_MY_CREEPS,1,{filter: (c) => c.hits < c.hitsMax}),'hits');
        if(damaged.length){
            creep.heal(damaged[0]);
        }
        else{
            var damagedAtRange = _.sortBy(creep.pos.findInRange(FIND_MY_CREEPS,3,{filter: (c) => c.hits < c.hitsMax}),'hits');
            if(damagedAtRange.length){
                creep.rangedHeal(damagedAtRange[0]);
            }
        }
        if(creep.room.name==myflag.pos.roomName){
            var closestRaider = creep.pos.findClosestByRange(FIND_MY_CREEPS,{filter: (c) => c.memory.role == 'raider'});
            if(closestRaider != undefined){
                creep.moveTo(closestRaider,{reusePath:0});
            }
            else{
                creep.moveTo(myflag,{reusePath:0});
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
