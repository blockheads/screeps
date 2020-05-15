/**
 * This is the manager for automated construction
 */

 class ConstructionManager{
    
    constructor(room){
        this._room = room;

        // road map, contains list of paths most comonly used
        this._roadMap = new Map();
    }

    
    pushPath(path){

        if(this._roadMap.has(path)){
            this._roadMap.set(path,this._roadMap.get(path) + 1);
            return;
        }
        // otherwise we just set it to 0 for our first occurence
        this._roadMap.set(path, 0);        
    }

    /**
     * Displays our beautiful path map
     */
    printPathMap(){
        console.log("!-------ROAD MAP-----------!");
        this._roadMap.forEach( p => {
            console.log("Path: ", JSON.stringify(p), " #", this._roadMap.get(p));
        });
    }

 }

 module.exports = ConstructionManager;