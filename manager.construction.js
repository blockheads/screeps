/**
 * This is the manager for automated construction
 */

const ResourceDataHandler = require("./resourceDataHandler");

 class ConstructionManager{
    
    constructor(room, roomData){
        this._room = room;
        this._roomData = roomData;

        // road map, contains list of paths most comonly used
        this._roadMap = new Map();

        // our construction site data
        if(Memory.constructionMap)
            this._constructionMap = Memory.constructionMap;

    }

    update(resourceData){

        //this._constructionSites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);

        this.getContainerSites(resourceData);

        Memory.constructionMap = this._constructionMap;
    }

    
    getContainerSites(resourceData){
        console.log("this._roomData.withdrawPoints.length: ", Object.keys(this._roomData.withdrawPoints).length);
        console.log("resourceData.length: ", Object.keys(resourceData).length);
        if(Object.keys(this._roomData.withdrawPoints).length < Object.keys(resourceData).length){
            for(var i in resourceData){
                if(Object.keys(resourceData[i].containers).length == 0){
                    
                    //if(this._constructionMap[])
                    
                }
                
            }
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