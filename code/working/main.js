////////////////////////////
// Init Group Begin //
//////////////////////////

var characters = ["Redonx", "Mallet", "Bobbynator"];

function loadCharacters(){
	for (var c of characters) {
		start_character(c, "");
	}
	log("Loading Characters...");
	setTimeout(initParty, 8000);
}

function initParty(){
	for (var c of characters) {
		send_party_invite(c, "");
	}
	log("Party Invites sent!");
}

function stopCharacters(){
	for (var c of characters) {
		stop_character(c, "");
	}
	log("Characters stopped!");
}

//on_party_invite gets called _automatically_ by the game on an invite 
function on_party_invite(name) {

  if (get_player(name).owner != character.owner) return;
  set_message("Ok I'm in");
  accept_party_invite(name);
}


//Hotkeys!
map_key("3", "snippet", "loadCharacters()")
map_key("4", "snippet", "initParty()")
map_key("5", "snippet", "stopCharacters()")

////////////////////////////
// Init Group End //
//////////////////////////

// Avoid disconnection
var safeties=true; 

//Custom Settings
//ranger.name = "Redonx";
//Farming spots are found in G.maps.main
//const farmMonsterName = "arcticbee";
//const farmMap = "winterland";
//const farmMonsterNr = 10;
const farmMonsterName = "snake";
const farmMap = "main";
const farmMonsterNr = 6;
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
        //game_log("Attacking...");
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