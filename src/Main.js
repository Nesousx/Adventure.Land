load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/helperFunctions");
load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/evadeTarget");
load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/merchantSkills");
load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/mageSkills");
load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/priestSkills");
load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/rangerSkills");
//load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/followLead");
//load_code("https://raw.githubusercontent.com/Nesousx/Adventure.Land/master/src/farmAssist");

//Hotkeys!
map_key("3", "snippet", "loadCharacters()")
map_key("4", "snippet", "initParty()")
map_key("5", "snippet", "stopCharacters()")
map_key("9", "snippet", "parent.load_code('Main');say('/pure_eval setTimeout(parent.start_runner, 500)');parent.stop_runner()");

//Custom Settings
//ranger.name = "Redonx";
//Farming spots are found in G.maps.main
//const farmMonsterName = "arcticbee";
//const farmMap = "winterland";
//const farmMonsterNr = 10;
const farmMonsterName = "crab";
const farmMap = "main";
const farmMonsterNr = 8;
const merchantName = "Bobbynator";
const healthPotThreshold = 0.95, manaPotThreshold = 0.85;

setInterval(main, 1000 / 4); // Loops every 1/4 seconds.
setInterval(tier2Actions, 3000); // Loops every 3 seconds.

function main(){
    //If Character is dead, respawn
    if (character.rip) setTimeout(respawn, 15000);  
    //If character is moving, do nothing
    if(is_moving(character) || smart.moving) return;
    //Replenish Health and Mana
    //usePotions(healthPotThreshold, manaPotThreshold);
    usePotions();
	useRegenMP();
	useRegenHP();
    //Loot everything
    loot();
    
    //Merchant Skills are Tier 2 actions
    if(character.ctype === "merchant") return;

    //Finds a suitable target and attacks it. Also returns the target!
    let target = getTarget(farmMonsterName);
    if(target){
        //Kites Target
        //kiteTarget(target);
        //Circles Target
        //circleTarget(target);
        //Uses available skills
        if(character.ctype === "mage") mageSkills(target);
        if(character.ctype === "priest") priestSkills(target);
        if(character.ctype === "ranger") rangerSkills(target, farmMonsterName);
        //Attacks the target
        autoFight(target);
        game_log("Attacking...");
    }else{
        //Go to Farming Area
        getFarmingSpot(farmMonsterName, farmMap, farmMonsterNr, "move");
    }
}

function tier2Actions(){
    
    //If character is moving, do nothing
    if(is_moving(character) || smart.moving) return;
    
    //Puts potions on Slots not transferred to merchant
    relocateItems();
    //Transfer loot to merchant
    transferLoot(merchantName);
    
    //Run Merchant Skills
    if(character.ctype === "merchant"){
        merchantSkills();
        return;
    }
}