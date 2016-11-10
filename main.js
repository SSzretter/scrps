var roleUpgrader = require('role.upgrader');
var roleCivilian = require('role.civilian');
var roleHunter = require('role.hunter');
var roleMiner = require('role.miner');
var roleRunner = require('role.runner');
var roleReserver = require('role.reserver');
var roleRepairer = require('role.repairer');
var roleColonist = require('role.colonist');
var remoteHunter = require('remote.hunter');
var remoteMiner = require('remote.miner');
var remoteRunner = require('remote.runner');
var roleClaimer = require('role.claimer');
var roleRecycler = require('role.recycler');
var roleThief = require('role.thief');
var roleRaider = require('role.raider');
var roleRaidHealer = require('role.raidHealer');
var roleDismantler = require('role.dismantler');
var roleMineralMiner = require('role.mineralMiner');
var roleTerminalManager = require('role.terminalManager');
var respawn = require('respawn');
var tasks = require('tasks');
var planOutheal = require('plan.outheal');
var utils = require('utils');
const profiler = require('screeps-profiler');

global.playerWhiteList = ['PiratenBraut','PhillipK','CokeJunkie','KaZoiden'];

require('prototyping')();


//profiler.enable();
module.exports.loop = function(){
	profiler.wrap(function() {
		for(var i in Memory.creeps) {
			if(!Game.creeps[i]) {
				delete Memory.creeps[i];
			}
		}

		var myrooms = _.filter(Game.rooms, (r) => r.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN}).length > 0 );
		for(var room of myrooms){
		    
		    room.memory.wallMax = 6000;
		    
			var towers = room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER});
			if(towers.length){
				for(i=0;i<towers.length;i++){
					var tower = towers[i];
					
					var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{filter: (c) => !_.contains(playerWhiteList,c.owner.username)});
                    if(hostile) {
                        tower.attack(hostile);
                        var username = hostile.owner.username;
                        Game.notify(`User ${username} spotted in room ${room.name}`,60);
                    } else if(tower.energy > 800){
						tower.repair(tower.pos.findClosestByRange(FIND_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits < 5000}));
						 tower.repair(tower.pos.findClosestByRange(FIND_STRUCTURES, {filter : (structure) => 
							 (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < 5000
						    })
						 );  //(structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits < structure.hitsMax) ||
					}
				}
			}
		}

		for(var name in Game.creeps){
			// var startCpu = Game.cpu.getUsed();
			var creep = Game.creeps[name];
			if(creep.memory.role == 'runner'){
				roleRunner.run(creep);
			}
			else if(creep.memory.role == 'miner'){
				roleMiner.run(creep);
			}
			else if(creep.memory.role == 'upgrader'){
				roleUpgrader.run(creep);
			}
			else if(creep.memory.role == 'civilian'){
				roleCivilian.run(creep);
			}
			else if(creep.memory.role == 'repairer'){
				roleRepairer.run(creep);
			}
			else if(creep.memory.role == 'hunter'){
				roleHunter.run(creep);
			}
			else if(creep.memory.role == 'remoteMiner'){
				remoteMiner.run(creep);
			}
			else if(creep.memory.role == 'remoteRunner'){
				remoteRunner.run(creep);
			}
			else if(creep.memory.role == 'reserver'){
				roleReserver.run(creep);
			}
			else if(creep.memory.role == 'remoteHunter'){
				remoteHunter.run(creep);
			}
			else if(creep.memory.role == 'shield'){
				var wayPoint = Game.flags[creep.memory.waypoint[0]];
	            if(wayPoint != undefined){
	                if(creep.room.name == wayPoint.pos.roomName){
	                    creep.memory.waypoint.shift();
	                }
	                creep.moveTo(wayPoint);
	            }
	            else{
	                creep.moveTo(Game.flags['Rally']);
	            }
			}
			else if(creep.memory.role == 'raider'){
				roleRaider.run(creep);
			}
			else if(creep.memory.role == 'raidHealer'){
				roleRaidHealer.run(creep);
			}
			else if(creep.memory.role == 'thief'){
				roleThief.run(creep);
			}
			else if(creep.memory.role == 'colonist'){
				roleColonist.run(creep);
			}
			else if(creep.memory.role == 'claimer'){
				roleClaimer.run(creep);
			}
			else if(creep.memory.role == 'recycler'){
				roleRecycler.run(creep);
			}
			else if(creep.memory.role == 'planOutheal'){
				planOutheal.run(creep);
			}
			else if(creep.memory.role == 'dismantler'){
				roleDismantler.run(creep);
			}
			else if(creep.memory.role == 'mineralMiner'){
				roleMineralMiner.run(creep);
			}
			else if(creep.memory.role == 'terminalManager'){
				roleTerminalManager.run(creep);
			}
			// var elapsed = Game.cpu.getUsed() - startCpu;
			// console.log('Creep '+name+' with role '+creep.memory.role+' has used '+elapsed+' CPU time');
		}
		// if('Raid' in Game.flags){
		// if(Game.time % 1000 == 0){
		// 	var raiderBody = [TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
		// 	var healerBody = [MOVE,HEAL,HEAL,MOVE];
		// 	Game.spawns.Spawn1.room.requestCreep(raiderBody,undefined,{role: 'raider', myflag:'defense1'} );
		// 	Game.spawns.Spawn1.room.requestCreep(raiderBody,undefined,{role: 'raider', myflag:'defense1'} );
		// 	Game.spawns.Spawn1.room.requestCreep(healerBody,undefined,{role: 'raidHealer', myflag:'defense1'});
		// 	//===================//
		// 	// Game.spawns.Spawn1.room.requestCreep(raiderBody,undefined,{role: 'raider', myflag:'defense2'} );
		// 	// Game.spawns.Spawn1.room.requestCreep(raiderBody,undefined,{role: 'raider', myflag:'defense2'} );
		// 	// Game.spawns.Spawn1.room.requestCreep(raiderBody,undefined,{role: 'raider', myflag:'defense2'} );
		// 	// Game.spawns.Spawn1.room.requestCreep(healerBody,undefined,{role: 'raidHealer', myflag:'defense2'});
		// 	// Game.spawns.Spawn1.room.requestCreep(healerBody,undefined,{role: 'raidHealer', myflag:'defense2'});
		// }
		// }
		respawn.run(myrooms);

		var startRoom = Game.rooms['W34N57'];
		// if(startRoom.controller.level >= 3){
		// 	startRoom.createConstructionSite(14,38,STRUCTURE_EXTENSION);
		// 	startRoom.createConstructionSite(13,38,STRUCTURE_EXTENSION);
		// 	startRoom.createConstructionSite(12,39,STRUCTURE_EXTENSION);
		// 	startRoom.createConstructionSite(18,36,STRUCTURE_EXTENSION);
		// 	startRoom.createConstructionSite(19,37,STRUCTURE_EXTENSION);
		// 	startRoom.createConstructionSite(27,19,STRUCTURE_TOWER);
		// }
		if(Game.spawns.cdevsp1.hits < Game.spawns.cdevsp1.hitsMax){
			startRoom.controller.activateSafeMode();
		}
		// var newRoom = Game.rooms['W55S18'];
		// var hostilesInNewRoom =  newRoom.find(FIND_HOSTILE_CREEPS,{filter: (c) => !_.contains(playerWhiteList,c.owner.username)});
		// if(hostilesInNewRoom.length > 0){
		// 	newRoom.controller.activateSafeMode();
		// }
	});
}
