let SurName = ['Lord', 'Duke', 'Peasant', 'Slave','Grovler','MudBasket','Goblin',
               'Eggplant', 'Gamer', 'BelleDelphine', 'TempleOSOperator', 'CIA',
               'Expert', 'Assasin', 'Lvl 99', '😄', '😍😘', '🤑🤑🤑🤑', 
                '🤢' , '👺', '💩💩💩💩💩💩', '😡', '💝'];

let name = ['Terry', 'Greg', 'Vince', 'Nick', 'Noah', 'Matt', 'Jenessa',
            'Michael', 'Ryan', 'Charles', 'Josh', 'Clown', 'Frog', 'Gamer'];

let ending = ['Coward', 'Spineless', 'Impotent', 'Immortal', 'Craven', 'Desolater',
              'Imprisioned', 'Careing', 'Wise', 'Violent', 'Noided', 'Savant',
              'Sad'];

var nameGen = {
    
    /** retrieves a name for a creep **/
    get: function() {
        
        return SurName[Math.floor(Math.random()*SurName.length)] + " " + name[Math.floor(Math.random()*name.length)] + " the " +
        ending[Math.floor(Math.random()*ending.length)];
    }
};

module.exports = nameGen;