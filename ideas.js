GCL MUST BE > 1 TO DO REMOTE TASKS but place flag on controller and set these vars: 

create a harvest flag to create a remoteMiner (and remoteRunner) - to get those processes up


create a claim flag that will continuously spawn a colonist to build the new spawn point
Game.flags['r2claim'].memory.reserved=false;
Game.flags['r2claim'].memory.homeRoom='W34N57';  // the home room that should spawn the creep for this flag
Game.flags['r2claim'].memory.underAttack=false;

not sure if this is needed but a flag with reserve in it will spawn a reserver -- but it should probably be role 'claimer' (look at this code!!)
Game.flags['r2reserve'].memory.reserved=false;
Game.flags['r2reserve'].memory.homeRoom='W34N57';  // the home room that should spawn the creep for this flag
Game.flags['r2reserve'].memory.underAttack=false;

Place flag 'placespawn' so colonist will create spawn point?

look at reserver / claim logic - it looks to me like reserved on flag should go false when creep despawns (or sometime after)...



(in no particular order)

Things that I should do urgently.

*support for multiple Waypoints, preferably in moveTo

*only spawn terminalManagers when needed, but I don't want to give up the safety net of an additional runner

*better repairer logic, to minimize traffic jams. Idea: only make a list what needs to be repaired every 500 ticks or so. could be combined with:
*integrate repair into the civilian role


*clean up code; write a better system to control on a room basis.

Then:
*labs and boosting

===================================
all the rest:

*implement proper spawning in advance

*spawn dedicated loader creeps if a tower is empty and there are not enough civilians to fill all of them


*fix problems with overwriting the queue (fixed... maybe?)
*monitor of remote mining works like expected
*monitor if not prioritizing repairers will repair enough

*a clean solution to the waypoint dilemma

*a better requestList spawning

*automatic nuke defense (at least for one nuke)
*arbitrary remote roles


combat related:
*better tower code
*defensive and offensive creep squads
*siege code
