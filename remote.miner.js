/*
 * Remote mining role, that should build and maintain their own container.
 * problematic: replacement request has too high priority
 */

var tasks = require('tasks');
var respawn = require('respawn');

module.exports = {
    run : function(creep){
        if(creep.memory.workable && creep.carry.energy == 0) {
            creep.memory.workable = false;
            // creep.say('getting');
	    }
	    if(!creep.memory.workable && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.workable = true;
	        // creep.say('delivering');
	    }
        // if(creep.ticksToLive == 100){ //request your replacement in time, problematic: has too high priority this way
        //     Game.rooms[creep.memory.homeRoom].requestCreep(respawn.bodies.remoteMiner(),undefined,{role : 'remoteMiner', myflag : creep.memory.myflag, homeRoom : creep.memory.homeRoom});
        // }
        var myflag = Game.flags[creep.memory.myflag];
        if(creep.room.name == myflag.pos.roomName){
            if(creep.memory.workable){
                var myContainer = myflag.pos.findInRange(FIND_STRUCTURES,1,{filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
                if(myContainer == undefined){
                    var csContainer = myflag.pos.findInRange(FIND_CONSTRUCTION_SITES,1,{filter:(s) => s.structureType == STRUCTURE_CONTAINER});
                    if(csContainer.length == 0){
                        creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
                    }
                    tasks.construct(creep,csContainer[0]);
                }
                else if(myContainer.hits < myContainer.hitsMax){
                    creep.repair(myContainer);
                }
                else{
                    var mySource = myflag.pos.lookFor(LOOK_SOURCES)[0];
                    tasks.mine(creep,mySource);
                }
            }
            else{
                var mySource = myflag.pos.lookFor(LOOK_SOURCES)[0];
                tasks.mine(creep,mySource);
            }
        }
        else{
            creep.moveTo(myflag);
        }
    }
}
