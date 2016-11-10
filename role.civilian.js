let tasks = require('tasks');
let respawn = require('respawn');

module.exports = {
	builderTarget : function(room,numCivs){
		var progLeft = _.sum(room.find(FIND_MY_CONSTRUCTION_SITES), (cs) => cs.progressTotal - cs.progress);
		var energyPerCiv = respawn.bodies.civilian(room.energyCapacityAvailable).length * 50 / 3;
		var buildersNeeded = Math.ceil(progLeft/energyPerCiv); //if no spawn, will return Infinity, but Math.min can handle that
		var numBuilders = Math.min(buildersNeeded,numCivs);
		if(numBuilders == 0){ //if there are walls to be repaired, should have one builder even if no construction site
			var lowWalls = room.find(FIND_STRUCTURES,
				{filter: (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < room.memory.wallMax
			});
			if(lowWalls.length){
				numBuilders = 1;
			}
		}
		return numBuilders
	},
	run : function(creep){
		//preparing
		if(creep.memory.ontask && creep.carry.energy == 0){
			creep.memory.ontask = false;
			creep.memory.sourceNo = undefined; //resets the finding logic
            creep.say('getting');
		}
		if(!creep.memory.ontask && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.ontask = true;
			creep.memory.mytask = ' ' //remove current task so own task is not counted in the following
			var civs = creep.room.find(FIND_MY_CREEPS,{filter : (c) => c.memory.role == 'civilian'});
			var civsByTask = _.groupBy(civs,'memory.mytask');
			var numBuilders = civsByTask.builder != undefined ? civsByTask.builder.length : 0;
			// var numUpgraders= civsByTask.upgrader != undefined ? civsByTask.upgrader.length : 0;
			var emergencies = creep.room.find(FIND_FLAGS,{filter: (f) => /emergency/.test(f.name)}).length;
			var nukes = creep.room.find(FIND_NUKES).length;
			var hostiles = creep.room.find(FIND_HOSTILE_CREEPS,{filter: (c) => !_.contains(playerWhiteList,c.owner.username)}).length;
			var towers = creep.room.find(FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_TOWER}).length;
			if(hostiles > 0 && towers > 0){
				creep.memory.mytask = 'loader';
				creep.say('loading');
			}
			else if(numBuilders < this.builderTarget(creep.room,civs.length) ){
				creep.memory.mytask = 'builder';
				creep.say('building');
			}
			else if(emergencies > 0 && nukes > 0){
				creep.memory.mytask = 'panic';
				creep.say('panic',true);
			}
			else{
				creep.memory.mytask = 'upgrader';
				creep.say('upgrading');
			}
	    }
		//doing stuff
		if(creep.memory.ontask && creep.memory.mytask == 'builder'){
			var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			var lowWalls = creep.room.find(FIND_STRUCTURES,
				{filter : (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < creep.room.memory.wallMax
			});
			if(targets.length){
				tasks.construct(creep,targets[0]);
			}
			else if(lowWalls.length){
				tasks.repWall(creep);
			}
			else{
			    
			    if(creep.carry.energy>0)
			    {
			        creep.memory.mytask = 'upgrader';
				    creep.say('civ build>upgrading');
			    }
			    else
			    {
			       	creep.memory.ontask = false //switch back to getting if there is nothing left to build
				    creep.memory.sourceNo = undefined; //resets the finding logic
			    	creep.say('civ builder>getting');
			    }
			}
		}
		else if(creep.memory.ontask && creep.memory.mytask == 'upgrader'){
			if(creep.upgradeController(creep.room.controller)==ERR_NOT_IN_RANGE){
	            creep.moveTo(creep.room.controller);
	        }
		}
		else if(creep.memory.ontask && creep.memory.mytask == 'panic'){
			var emergencyFlags = creep.room.find(FIND_FLAGS,{filter: (f) => /emergency/.test(f.name)});
			var numFlags = emergencyFlags.length;
			var target = undefined
			for(flag of emergencyFlags){
	            var rampart = _.filter(flag.pos.lookFor(LOOK_STRUCTURES),
					(s) => s.structureType == STRUCTURE_RAMPART && (s.hits < 6000000 || s.hits < flag.memory.wallMax)
				);
	            if(rampart.length > 0){
	                target = rampart[0];
	                break;
	            }
	        }
			if(target != undefined){
				if(creep.repair(target) == ERR_NOT_IN_RANGE){
					creep.moveTo(target);
				}
				else{
					creep.moveTo(target);
					if(Game.time % 2){
						creep.say('The sky',true)
					}
					else{
						creep.say('is falling',true)
					}
				}
			}
			else{
				creep.memory.mytask = 'upgrader';
				creep.say('civ panic>upgrade');
			}
		}
		else if(creep.memory.ontask && creep.memory.mytask == 'loader'){
			var tower = _.sortBy(creep.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity}),'energy')[0];
			if(tower == undefined){
				creep.memory.ontask = false //switch back to getting if there is nothing left to build
				creep.memory.sourceNo = undefined; //resets the finding logic
				creep.say('nevermind2');
			}
			else if(creep.transfer(tower,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
				creep.moveTo(tower);
			}
		}
		else if(creep.ticksToLive < 100){
			creep.memory.role = 'recycler';
			creep.say('civ recycle');
		}
        else{ //get energy in priority: dropped, container, storage, harvest
			tasks.getenergy(creep);
	    }
	}
}
