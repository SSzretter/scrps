var roleDismantler = require('role.dismantler');

module.exports = {
    start : function(rallyFlag,targetFlag){
        //request appropriate creeps, rally and target are flags for the creep's memory
        var healBody = [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE]; // costs 2280, a rcl 6 room can support 2300
        Game.rooms['W52S17'].requestCreep(healBody,undefined,{role : 'planOutheal', num : 0 , homeRoom : 'W54S17'});
        Game.rooms['W52S17'].requestCreep(healBody,undefined,{role : 'planOutheal', num : 1 , homeRoom : 'W54S17'});
        Game.rooms['W54S17'].requestCreep(healBody,undefined,{role : 'planOutheal', num : 2 , homeRoom : 'W54S17'});
        Game.rooms['W54S17'].requestCreep(healBody,undefined,{role : 'planOutheal', num : 3 , homeRoom : 'W54S17'});
        Game.rooms['W52S17'].requestCreep(
            [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE],
            'Desmond',{role : 'planOutheal', subrole : 'dismantler' , homeRoom : 'W54S17'}
        );
        var disBody = [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE];
        Game.rooms['W52S17'].requestCreep(disBody,undefined,{role : 'planOutheal', subrole : 'dismantler' , homeRoom : 'W54S17'});
        Game.rooms['W52S17'].requestCreep(disBody,undefined,{role : 'planOutheal', subrole : 'dismantler' , homeRoom : 'W54S17'});
        Game.rooms['W54S17'].requestCreep(disBody,undefined,{role : 'planOutheal', subrole : 'dismantler' , homeRoom : 'W54S17'});
        Game.rooms['W54S17'].requestCreep(disBody,undefined,{role : 'planOutheal', subrole : 'dismantler' , homeRoom : 'W54S17'});
        Game.rooms['W52S17'].requestCreep(disBody,undefined,{role : 'planOutheal', subrole : 'dismantler' , homeRoom : 'W54S17'});
        Memory.planOutheal = {
            stage : 0,
            rally : rallyFlag,
            target : targetFlag
        };
    },
    trigger : function(){
        Memory.planOutheal.stage +=1;
        // if (Game.flags[Memory.planOutheal.rally].pos.roomName in Game.rooms ){
        //     if(Game.flags[Memory.planOutheal.rally].pos.findInRange(FIND_MY_CREEPS,1,{filter : (c) => c.memory.role == 'planOutheal'}).length > 0){
        //         Memory.planOutheal.stage = 1;
        //     }
        // }
    },
    run : function(creep){
        if(creep.memory.subrole == 'dismantler'){
            if(Memory.planOutheal.stage == 0 || Memory.planOutheal.stage == 1){
                creep.moveTo(Game.flags[Memory.planOutheal.rally]);
            }
            else if(Memory.planOutheal.stage == 2){
                if(creep.room.name != Game.flags['dismantle1'].pos.roomName){
                    creep.moveTo(Game.flags['dismantle1']);
                }
                else{
                    roleDismantler.run(creep); //the way dismantlers are called changed - be aware of that
                }
            }
        }
        else{
            //heal
            var damaged = _.sortBy(creep.pos.findInRange(FIND_MY_CREEPS,1,{filter : (c) => c.hits < c.hitsMax}),'hits');
            if(damaged.length){
                creep.heal(damaged[0]);
            }
            else{
                var damagedAtRange = _.sortBy(creep.pos.findInRange(FIND_MY_CREEPS,3,{filter : (c) => c.hits < c.hitsMax}),'hits');
                if(damagedAtRange.length){
                    creep.rangedHeal(damagedAtRange[0]);
                }
            }
            //where to go
            if(Memory.planOutheal.stage == 0){
                creep.moveTo(Game.flags[Memory.planOutheal.rally]);
            }
            else if(Memory.planOutheal.stage == 1){
                if(creep.room.name == Game.flags[Memory.planOutheal.target].pos.roomName){

                    var flagPos = Game.flags[Memory.planOutheal.target].pos;
                    var wishPos = [25,25];
                    switch (creep.memory.num){
                        case 0 :
                            wishPos = [flagPos.x,flagPos.y];
                            break;
                        case 1 :
                            wishPos = [flagPos.x - 1,flagPos.y];
                            break;
                        case 2 :
                            wishPos = [flagPos.x,flagPos.y - 1];
                            break;
                        case 3 :
                            wishPos = [flagPos.x - 1,flagPos.y - 1];
                            break;
                    }
                    creep.moveTo(...wishPos,{reusePath : 0});
                }
                else{
                    creep.moveTo(Game.flags[Memory.planOutheal.target],{reusePath : 0});
                }
            }
            else if(Memory.planOutheal.stage == 2){
                creep.moveTo(Game.creeps['Desmond']);
            }
        }
        if(Memory.planOutheal.stage == 3){
            creep.memory.role = 'recycler';
        }
    }
};
