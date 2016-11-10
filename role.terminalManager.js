var roleRunner = require('role.runner');

module.exports = {
    run : function(creep){
        var mineral = creep.room.find(FIND_MINERALS)[0];
        var mineralType = mineral.mineralType;
        var mineralContainer = mineral.pos.findInRange(FIND_STRUCTURES,1,{filter:(s)=>s.structureType == STRUCTURE_CONTAINER})[0];
        if(!creep.memory.getting && _.sum(creep.carry) == 0){
            if(creep.ticksToLive < 100){
    			creep.memory.role = 'recycler';
    		}
            else if(mineralContainer != undefined && creep.room.terminal != undefined && mineralContainer.store[mineralType] >= creep.carryCapacity){
                creep.memory.getting = true;
                creep.memory.mytask = 'getMineral';
            }
            else if(creep.room.storage != undefined && creep.room.terminal != undefined && creep.room.storage.store.energy > 100000 && creep.room.terminal.store.energy < 50000){
                creep.memory.getting = true;
                creep.memory.mytask = 'getEnergy';
            }
            else{
                creep.memory.mytask = 'runner';
            }
        }
        if(creep.memory.getting && _.sum(creep.carry) == creep.carryCapacity){
            creep.memory.getting = false;
            creep.memory.mytask = 'deliver';
        }

        if(creep.memory.mytask == 'deliver'){
            if(creep.transfer(creep.room.terminal,_.findKey(creep.carry,(x) => x > 0)) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.terminal);
            }
        }
        else if(creep.memory.mytask == 'runner'){
            roleRunner.run(creep);
        }
        else if(creep.memory.mytask == 'getMineral'){
            if(creep.withdraw(mineralContainer,mineralType) == ERR_NOT_IN_RANGE){
                creep.moveTo(mineralContainer);
            }
        }
        else if(creep.memory.mytask == 'getEnergy'){
            if(creep.withdraw(creep.room.storage,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.storage);
            }
        }

    }
}
