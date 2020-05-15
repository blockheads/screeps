/**
 * This is the manager for automated construction
 */

const ResourceDataHandler = require("./resourceDataHandler");

 class ConstructionManager{
    
    constructor(room){
        this._room = room;

        // road map, contains list of paths most comonly used
        this._roadMap = new Map();
    }

    update(resourceData){
        this.getContainerSites(resourceData);
    }

    
    getContainerSites(resourceData){
        for(var i in resourceData){
            console.log("i: ", i );
            ResourceDataHandler.getContainerLocation(i, this._room);
        }
    }

    pushPath(path){
       
        for(var i in path){
            var pos =  JSON.stringify({x: path[i].x, y: path[i].y});
            //console.log("Position: ", pos);
            if(this._roadMap.get(pos)){
                this._roadMap.set(pos, this._roadMap.get(pos) + 1);
            }
            else{
                // otherwise we just set it to 0 for our first occurence
                this._roadMap.set(pos, 1);
            }
            
        }
        
    }

    /**
     * Displays our beautiful path map
     */
    printPathMap(){
        console.log("!-------ROAD MAP-----------!");
        for (let [k,v] of this._roadMap) {
            console.log("Key: " + k, " val: ", v);
        }
    }

 }

 module.exports = ConstructionManager;