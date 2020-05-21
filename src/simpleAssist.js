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

clearTimeout(window.loop);
window.loop = setInterval(function(){
	
	//Merchant Skills are Tier 2 actions
    if(character.ctype === "merchant") return;
	
	loot();
	if(character.max_hp - character.hp > 200 ||
	   character.max_mp - character.mp > 300)
		use_hp_or_mp();
	
	// Party leader
	var leader = get_player(character.party);
	
	// Current target and target of leader.
	var currentTarget = get_targeted_monster();
	
	
	var leaderTarget = get_target_of(leader)
	
	// Change the target.
	if (!currentTarget || currentTarget != leaderTarget){ 
		// Current target is empty or other than the leader's.
		change_target(leaderTarget);
		currentTarget = get_targeted_monster();
	}
	
	// Attack the target.
	if(currentTarget && can_attack(currentTarget)){
		currentTarget=get_nearest_monster({min_xp:100,max_att:120});
		if(currentTarget) change_target(currentTarget);
		// Current target isn't empty and attackable.
		attack(currentTarget);
	}
	
	if (!leader) {
		set_message("leader not ready");
		return
	}
	
	//Move to leader.
	if(!character.moving)
		// Move only if you are not already moving.
		move(leader.real_x, leader.real_y);

            set_message("Dpsing");
},1000/4);
