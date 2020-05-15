/**
 * This manager deals with flags placed on the game world.
 */

 class FlagManager{

    constructor(){

    }

    update(){
        for(var i in Game.flags){
            var flag = Game.flags[i];

            console.log("flag: ", JSON.stringify(flag));
            var room = flag.pos.roomName;
            
            switch(flag.name){
                case "remote":
                    
                    break;
                default:
                    throw "Undefined Flag Name."
                    break;
            }
        }
    }
 }

 module.exports = FlagManager;