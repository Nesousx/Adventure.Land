let reserveMoney = 500000;
let minCompoundScrolls = 100;
let trashName = ["cclaw", "crabclaw", "shoes1", "coat1", "pants1",
				"wshoes", "", "spores", "beewings", "wcap", "bfur", 
				"firestaff", "strearring", "stramulet", 
				"egg0", "egg1", "egg2", "egg3", "egg4", "egg5", 
				"egg6", "egg7", "egg8", "", "", "", 
				"", "", "", "", "", "", 
				"", "", "", "", "", "", 
				"", "", "", "", "", "", 
				"redenvelopev1", "redenvelopev2", "redenvelopev3", "", "", "", 
				"ornament", "mistletoe", "candycane", "merry", "", "",
				"x0", "x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8"];
let mPotionThreshold = 700;
let hPotionThreshold = 10;
let sellItemLevel = 3;
let profitMargin = 1.8;
let manaReserve = 0.5;

function merchantSkills(){

	//if(new Date().getSeconds() === 30){
	if(findTriple(0)) compoundItems(0);
	if(findTriple(1)) compoundItems(1);
	if(findTriple(2)) compoundItems(2);
	if(findTriple(3)) compoundItems(3);
	//searchItems2bSold Returns Array SLOTS. Therefor it can return ZEROES
	//So we have to specifically look for UNDEFINED
	if(searchItems2bSold(sellItemLevel) !== undefined
	  && findEmptyTradeSlots() !== undefined) sellItems(sellItemLevel, profitMargin);
	selLTrash();
	tidyInventory();
	merchantsLuck();
	buyCheapStuff();
	restoreParty();

	if (new Date().getMinutes() === 00
		|| new Date().getMinutes() === 15
		|| new Date().getMinutes() === 30
	   	|| new Date().getMinutes() === 45
	    || new Date().getMinutes() === 38){

		let farmCoord = getFarmingSpot(farmMonsterName, farmMap, farmMonsterNr, "coord");
		
		//Close merchant Stand
		//parent.socket.emit("merchant", {close:1})
		parent.close_merchant(41);
		//Buy Potions
		buyPotions();
		relocateItems();
		
		
        smart_move({to:farmMap}, () => {
			smart_move({x: farmCoord.x, y: farmCoord.y}, () => {
				tranferPotions();
				merchantsLuck();
				//Buy Scrolls
				smart_move({to:"scrolls"}, () => {
					buyScrolls();
					//Exchange gems
					smart_move({to:"exchange"}, () => {
						exchangeGems();
						//Deposit Money
						smart_move({to:"bank"}, () => {
							depositMoney();
							depositItems();
							//Go to the market and sell things
							openMerchantStand();
						});
					});
				});
			});
		});
	}
}

function buyPotions(){
	let mPotions = quantity("mpot0");
	let	hPotions = quantity("hpot0");

	if(mPotions < mPotionThreshold || hPotions < hPotionThreshold){

		if(mPotions < mPotionThreshold) buy_with_gold("mpot0", mPotionThreshold - mPotions);
		if(hPotions < hPotionThreshold )buy_with_gold("hpot0", hPotionThreshold - hPotions);
		log("Bought Potions!");
	}
}

function tranferPotions(){

	let potions = ["hpot0", "mpot0", "hpot1", "mpot1"];

	//parent.party_list is an array with the names of PartyMembers
	//We iterate over it
	parent.party_list.forEach(function(otherPlayerName){ 
		// !!! IMPORTANT !!! parent.entities only holds OTHER players, not
		//the current player running this code!! Therefor....
		let partyMember = parent.entities[otherPlayerName];
		//...we have to check if party member holds something or is undefined!!!
		if (partyMember) {
			for(let i = 0; i < potions.length; i++){
				if(locate_item(potions[i]) !== -1) send_item(partyMember,locate_item(potions[i]),Math.floor(quantity(potions[i]) / 3));
			}
			log("Delivered Potions!");
		}
	});
}

function tidyInventory(){
	for(let i = 34; i > 0; i--){
		if(character.items[i] && !character.items[i-1]){
			swap(i, i-1)
			log("Tidying Inventory...");
		}
	}
}

function buyScrolls(){
	if(quantity("cscroll0") <= minCompoundScrolls){
		buy("cscroll0", minCompoundScrolls - quantity("cscroll0"));
		log("Bought Scrolls!");
	}
}

function selLTrash(){
	for(let i = 0; i <= 34; i++){
		if(character.items[i]
		   && trashName.indexOf(character.items[i].name) !== -1
		   && !item_grade(character.items[i]) > 0) {
			log("Merchant is unloading trash: " + character.items[i].name);
			if(G.items[character.items[i].name].type === "material"){
				sell(i, character.items[i].q);
			}else{
				sell(i, character.items[i]);
			}
		}
	}		
}

function exchangeGems(){
	for(let i = 0; i <= 34; i++){
		if(character.items[i]
		  && (G.items[character.items[i].name].type === "gem"
		  || G.items[character.items[i].name].type === "box")){
			exchange(i);
			log("Item Exchanged!");
		}
	}
}

function depositMoney(){	
	bank_deposit(character.gold - reserveMoney);
	log("Money deposited! Money in Pocket: " + character.gold);
}

function depositItems(){
	for(let i = 0; i <= 34; i++){
		if(character.items[i]
		  && (character.items[i].level
		  && character.items[i].level > sellItemLevel)
		  || item_grade(character.items[i]) > 1){
		 	bank_store(i);
			log("Item Stored in bank!");
		}
	}
}

function compoundItems(level){
	let triple = findTriple(level);
	if(triple
	   && triple.length === 3
	   && !character.q.compound){
		compound(triple[0],triple[1],triple[2],locate_item("cscroll0"));
		log("Compounded an Item!");
	}
}

function findTriple(level){
	let compoundTriple = [];
	for(let i = 0; i <= 34; i++){
		if(character.items[i]
		   	&& character.items[i].level === level
		   	//Weapons can't be compounded. If item has attack attr, no compound
		 	&& !G.items[character.items[i].name].attack){
			for(let j = i + 1; j <= 34; j++){
				if(character.items[j]
				   && character.items[j].name === character.items[i].name
				   && character.items[j].level === level){
					for(let k = j + 1; k <= 34; k++){
						if(character.items[k]
						   && character.items[k].name === character.items[j].name
						   && character.items[k].level === level){
							log(" Slot i: "  + i + " item: " + character.items[i].name + " Slot j: "  + j + " item: " + character.items[j].name + " Slot k: "  + k + " item: " + character.items[k].name )
							compoundTriple.push(i, j, k);
							return compoundTriple
						}
					}
				}
			}
		}
	}
}

function searchItems2bSold(sellItemLevel = 2){
	for (let i = 0; i <= 34; i++){
		if(character.items[i]
		   && character.items[i].level === sellItemLevel) return i;
	}
}

function sellItems(sellItemLevel = 2, profitMargin = 2){
	trade(searchItems2bSold(sellItemLevel), findEmptyTradeSlots(),  item_value(character.items[searchItems2bSold(sellItemLevel)]) * profitMargin);
}

function findEmptyTradeSlots(){
	let tradeSlots = Object.keys(character.slots).filter(tradeSlot => tradeSlot.includes("trade"));

	//Returns i + 1 because character.slots is 0-indexed,
	//but Trate-Slots start with 1 NOT ZERO
	for (let i = 0; i < tradeSlots.length; i++){
		if(!character.slots[tradeSlots[i]]) return i + 1;
	}
}

function merchantsLuck(){
	for (i in parent.entities){
		if(parent.entities[i].player
		  && parent.entities[i].ctype
		  && !parent.entities[i].npc
		  && !parent.entities[i].s.mluck
		  && character.mp > (character.max_mp * manaReserve)
		  && character.mp > G.skills.mluck.mp
		  && distance(character, parent.entities[i]) < G.skills.mluck.range
		  && can_use("mluck")){
			use_skill("mluck", parent.entities[i].name);

			log("Buffing: " + parent.entities[i].name);
		}
	}
}

function buyCheapStuff(){
	for (i in parent.entities){
		let otherPlayer = parent.entities[i];
		if(otherPlayer.player
		  && otherPlayer.ctype === "merchant"
		  && otherPlayer.slots
		  && distance(character, otherPlayer) < G.skills.mluck.range){

			let tradeSlots = Object.keys(otherPlayer.slots).filter(tradeSlot => tradeSlot.includes("trade"));
			tradeSlots.forEach(tradeSlot => {
				if(otherPlayer.slots[tradeSlot]
				   && otherPlayer.slots[tradeSlot].price < item_value(otherPlayer.slots[tradeSlot])
				   && character.gold > otherPlayer.slots[tradeSlot].price){
					trade_buy(otherPlayer, tradeSlot);
					log("Bought " + otherPlayer.slots[tradeSlot].name + " from player: " + otherPlayer.name)
				}				
			});				  
		}
	}
}

function restoreParty(){
	if(parent.party_list.length < 4){
		log("Merchant restoring party.");
		parent.close_merchant(41);
		smart_move({to:farmMap}, () => {
			let farmCoord = getFarmingSpot(farmMonsterName, farmMap, farmMonsterNr, "coord");
			if(parent.party_list.length < 4){
				smart_move({x:farmCoord.x, y:farmCoord.y}, () => {
					loadCharacters();
					log("Merchant has restored party.");
					openMerchantStand();
				});
			}
		});
	}
}

function openMerchantStand(){
//Go to the market and sell things
	if(character.map != "main"){
		smart_move({to:"main"}, () => {
			smart_move({to:"town"}, () => {
				smart_move({x: character.x  + 45, y: character.y - 70}, () => {
					//parent.socket.emit("merchant",{num:41});
					parent.open_merchant(41);
				});
			});
		});
	}else{
		smart_move({to:"town"}, () => {
			smart_move({x: character.x  + 45, y: character.y - 70}, () => {
				//parent.socket.emit("merchant",{num:41});
				parent.open_merchant(41);
			});
		});
	}
}