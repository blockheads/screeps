const FactoryNode = require("./role.factoryNode");

var RoleFactory = {

    // generates a base creep
    generateBuild: function(maxPrice, node){
        console.log("used: ", Game.cpu.getUsed());
        console.log("max price: ", maxPrice);
        var parts = [];
        var total = 0;
        for(var i in node.base){
            total += BODYPART_COST[node.base[i]];
            parts.push(node.base[i]);
        }

        if(total >= maxPrice){
            return parts;
        }

        // otherwise let's iterate over our pattern
        while(true){
           
            for(var i in node.pattern){

                total += BODYPART_COST[node.pattern[i]];
                //console.log("total: ", total);
                if(total >= maxPrice){
                    return parts;
                }

                parts.push(node.pattern[i]);
            }
            
        }
 
    }

}

module.exports = RoleFactory;