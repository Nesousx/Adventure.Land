function loadCharacters() {
	start_character("Redonx", "");
	start_character("Mallet", "");
	start_character("Bobbynator", "");
	log("Loading Characters...");
	setTimeout(initParty, 8000);
}

function initParty() {
	send_party_invite("Redonx");
	send_party_invite("Mallet");
	send_party_invite("Bobbynator");
	log("Party Invites sent!");
}

function stopCharacters() {
	stop_character("Redonx");
	stop_character("Mallet");
	stop_character("Bobbynator");
	log("Characters stopped!");
}

function getFarmingSpot(farmMonsterName = "crab", farmMap = "main", farmMonsterNr = 8, action){
	for (map in G.maps){
		for(monster in G.maps[map].monsters){
			let currentMonster = G.maps[map].monsters[monster]
			if(map === farmMap
				&& currentMonster.type === farmMonsterName
			   	&& currentMonster.count === farmMonsterNr){
				if(action === "move"){
					//Switch Map if needed
					if(character.map != map){
						smart_move({to:map});
					//If Map correct, go to Monster
					}else{
						smart_move({x:currentMonster.boundary[0] + ((currentMonster.boundary[2] - currentMonster.boundary[0]) / 2),y:currentMonster.boundary[1] + ((currentMonster.boundary[3] - currentMonster.boundary[1]) / 2)});
					}
				}else if(action === "coord"){
					return {x:currentMonster.boundary[0] + ((currentMonster.boundary[2] - currentMonster.boundary[0]) / 2),y:currentMonster.boundary[1] + ((currentMonster.boundary[3] - currentMonster.boundary[1]) / 2)}
				}
			}
		}
	}
}

function getTarget(farmTarget){

	let target = get_targeted_monster();
	if(target) return target;
	
	if(!target){
		//Returns monster that targets character
		target = get_nearest_monster({
			target:character.name
		});
		if(target){
			change_target(target);
			return target;
		}
		//Returns monster that targets party-member
		parent.party_list.forEach(partyMemberName => {
			target = get_nearest_monster({
				target:partyMemberName
			});
			if(target){
				change_target(target);
				return target;
			}
		});
		//Returns any monster that targets nobody
		target = get_nearest_monster({
			max_att:150,
			type:farmTarget,
			no_target:true
		});
		if(target){
			change_target(target);
			return target;
		}
	}
}

function autoFight(target){

    if(!is_in_range(target, "attack")){
        smart_move(
            character.x + (target.x - character.x) * 0.3,
            character.y + (target.y - character.y) * 0.3
        );
    }
    else if (!is_on_cooldown("attack")){
        attack(target).then((message) => {
            reduce_cooldown("attack", character.ping);
        }).catch((message) => {
            log(character.name + " attack failed: " + message.reason);
        });
    }
}

function transferLoot(merchantName){
    let merchant = get_player(merchantName);
    if(character.ctype === "merchant") return;
    if(character.ctype !== "merchant"
       && merchant
       && merchant.owner === character.owner
       && distance(character, merchant) < 400){
        //Transfer Gold
        if(character.gold > 1000) send_gold(merchant, character.gold)
        //Transfer Items
        if(character.items.filter(element => element).length > 4){
            for(let i = 0; i <= 34; i++){
                send_item(merchant, i, 9999);
            }
            log(character.name + " sent items to merchant.");
        }
    }   
}

function relocateItems(){
    
    if(locate_item("hpot1") !== -1 
       && locate_item("hpot1") !== 35)  swap(locate_item("hpot1"), 35);
    if(locate_item("mpot1") !== -1 
       && locate_item("mpot1") !== 36) swap(locate_item("mpot1"), 36);
    if(locate_item("hpot0") !== -1 
       && locate_item("hpot0") !== 37) swap(locate_item("hpot0"), 37);
    if(locate_item("mpot0") !== -1 
       && locate_item("mpot0") !== 38)swap(locate_item("mpot0"), 38);
    //Compound Scroll
    if(locate_item("cscroll0") !== -1 
       && locate_item("cscroll0") !== 39)swap(locate_item("cscroll0"), 39);
    //Upgrade Scroll
    if(locate_item("scroll0") !== -1 
       && locate_item("scroll0") !== 40)swap(locate_item("scroll0"), 40);
}

//on_party_invite gets called _automatically_ by the game on an invite 
function on_party_invite(name) {

    if (get_player(name).owner != character.owner) return;
    accept_party_invite(name);
}

//Replenish Health and Mana
function usePotions() {
if (character.hp <= character.max_hp - 300 || character.mp<= character.max_hp - 250) {
  use_hp_or_mp();
	}
}

function useRegenMP() {
if (character.mp < character.max_mp - 100) {
  use('regen_mp');
  //game_log("Test - Used MP regen skill");	
	}
}

function useRegenHP() {
if (character.hp < character.max_hp - 50) {
  use('regen_hp');
  //game_log("Test - Used HP regen skill");
	}
}