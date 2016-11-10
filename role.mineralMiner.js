// var tasks = require('tasks');
var utils = require('utils');

module.exports = {
	run : function(creep){
		var mineral = creep.room.find(FIND_MINERALS)[0];
        var myContainer = mineral.pos.findInRange(FIND_STRUCTURES,1,{filter: (s) => s.structureType == STRUCTURE_CONTAINER})[0];
        if(!utils.isPosEqual(creep.pos,myContainer.pos)){
            creep.moveTo(myContainer);
        }
        else{
            creep.harvest(mineral);
        }
	}
}
