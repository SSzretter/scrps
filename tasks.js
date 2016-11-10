module.exports = {
	mine : function(creep,target){
		var mycontainer = target.pos.findInRange(FIND_STRUCTURES,1,{filter: (s)=> s.structureType == STRUCTURE_CONTAINER});
		if(mycontainer.length > 0){
			creep.harvest(target);
			creep.moveTo(mycontainer[0]);
		}
		else{
			if(creep.harvest(target) == ERR_NOT_IN_RANGE ){
				creep.moveTo(target);
			}
		}
	},

	contain : function(creep){
		var mycontainer=creep.pos.findInRange(FIND_STRUCTURES,2,{
			filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
		});
		if (mycontainer[0].hits < mycontainer[0].hitsMax){ //maintain my own container
			creep.repair(mycontainer[0]);
		}
		else if (creep.transfer(mycontainer[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
			creep.moveTo(mycontainer[0]);
		}
	},

	pick : function(creep,target){
		var code = creep.pickup(target);
		if(code == ERR_NOT_IN_RANGE){
			creep.moveTo(target);
		}
		return code
	},

	get : function(creep,target){
		var code = creep.withdraw(target,RESOURCE_ENERGY);
		if(code == ERR_NOT_IN_RANGE){
			creep.moveTo(target);
		}
		return code;
	},

	determineSource : function(creep){
		var stdNo = creep.room.memory[creep.memory.role + 'Source'];
		if(stdNo == undefined){
			switch (creep.memory.role){
				case 'civilian':
					stdNo = 0;
					break;
				case 'runner':
					stdNo = 1;
					break;
				case 'terminalManager':
					stdNo = 1;
					break;
				case 'upgrader':
					stdNo = 0;
					break;
				case 'repairer':
					stdNo = 0;
					break;
				case 'remoteUpgrader':
					stdNo = 0;
					break;
				default:
					stdNo = 0;
					break;
			}
		}
		var sources = creep.room.find(FIND_SOURCES);
		var stdSource = sources[stdNo];
		var otherNo = (stdNo == 1) ? 0 : 1;
		var otherSource = sources[otherNo];
		if(stdSource!==undefined)
		{
		  	var stdContainer = stdSource.pos.findInRange(FIND_STRUCTURES,1,{filter : (s) => s.structureType == STRUCTURE_CONTAINER})[0];
	    	var stdDropped = stdSource.pos.findInRange(FIND_DROPPED_ENERGY,1)[0];
		}
		var stdEnergy = ( stdContainer != undefined && stdContainer.store.energy != undefined ? stdContainer.store.energy : 0 ) + ( stdDropped != undefined ? stdDropped.amount : 0 );
		if(otherSource!=undefined)
			var otherContainer = otherSource.pos.findInRange(FIND_STRUCTURES,1,{filter : (s) => s.structureType == STRUCTURE_CONTAINER})[0];
		if(otherDropped!=undefined)
			var otherDropped = otherSource.pos.findInRange(FIND_DROPPED_ENERGY,1)[0];
		var otherEnergy = ( otherContainer != undefined && otherContainer.store.energy != undefined ? otherContainer.store.energy : 0 ) + ( otherDropped != undefined ? otherDropped.amount : 0 );
		var threshold = 1000;
		if(otherEnergy > threshold && (otherEnergy-threshold) > stdEnergy){
			return otherNo;
		}
		else{
			return stdNo;
		}
	},

	getenergy : function(creep){ //get energy in priority: dropped, container, storage, harvest
		var sourceNo = creep.memory.sourceNo;
		if(sourceNo == undefined){ //determine where to get the energy from
			sourceNo = this.determineSource(creep);
			creep.memory.sourceNo = sourceNo;
		}
		var sources = creep.room.find(FIND_SOURCES);
		var mysource = sources[sourceNo];
		if(mysource!==undefined)
		{
		    var mycontainer = mysource.pos.findInRange(FIND_STRUCTURES,1,{filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
		    var targets = mysource.pos.findInRange(FIND_DROPPED_ENERGY,3);
		}
		
	
		var stock = creep.room.find(FIND_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store.energy > 0});

		
		if (mycontainer != undefined && mycontainer.store.energy == mycontainer.storeCapacity){ //fixes container overflowing
			this.get(creep,mycontainer);
		}
		else if (targets!==undefined && targets.length){
			this.pick(creep,targets[0]);
		}
		else if(mycontainer != undefined && mycontainer.store.energy >= creep.carryCapacity - (creep.carry.energy != undefined ? creep.carry.energy : 0) ){
			this.get(creep,mycontainer);
		}
		else if(stock.length){
			this.get(creep,stock[0]);
		}
		else if(creep.getActiveBodyparts(WORK)){
			this.mine(creep,mysource);
		}
	},

	fill : function(creep,prioritylist){
		var valid = false; //use this to determine whether there was some sensible task to do
		for(i=0; i<prioritylist.length; i++){
		    if(prioritylist[i]==STRUCTURE_CONTAINER || prioritylist[i]==STRUCTURE_STORAGE){
		        var target=creep.room.find(FIND_STRUCTURES, {
				    filter: (s) => s.structureType == prioritylist[i] && (s.store.energy<s.storeCapacity)
			    })[0];
		    }
		    else{
    			var target=creep.pos.findClosestByRange(FIND_STRUCTURES, {
    				filter: (s) => s.structureType == prioritylist[i] && (s.energy < s.energyCapacity)
    			});
		    }
    		if(target != null){
				if(creep.transfer(target,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(target);
				}
				valid = true;
				break;
			}
		}
		if(!valid){
			return -1
		}
	},

	construct : function(creep,target){
		if(creep.build(target)==ERR_NOT_IN_RANGE){
			creep.moveTo(target);
		}
	},

	repWall : function(creep){
		var target = creep.pos.findClosestByRange(FIND_STRUCTURES,{filter : (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < creep.room.memory.wallMax});
		if(target != null){
			if(creep.repair(target) == ERR_NOT_IN_RANGE){
				creep.moveTo(target);
			}
		}
		else{
			return -1
		}
	},

	rep : function(creep){
		var target=creep.pos.findClosestByRange(FIND_STRUCTURES, {filter : (structure) => (
			structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits < structure.hitsMax)
		});
		if(target != null){
			if(creep.repair(target) == ERR_NOT_IN_RANGE){
				creep.moveTo(target);
			}
		}
		else{
			return -1
		}
	},

	recycle : function(creep,spawn){
		if(spawn != undefined){
			if(spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE){
				creep.moveTo(spawn);
			}
		}
		else{
			creep.suicide();
		}
	}


}
