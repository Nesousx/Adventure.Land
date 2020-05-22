function mageSkills(target){

    //How much Mana should be kept in reserve
    let manaReserve = 0.8;
    let hpReserve = 0.8;

    //Shield Character
    if(character.hp < (character.max_hp * hpReserve)
        && character.mp > G.skills.reflection.mp
        && !is_on_cooldown("reflection")){
        use_skill("reflection", character);
        game_log("Mage shielded himself");
    }

    //Energize and Shield Party Members
    //parent.party_list is an array with the names of PartyMembers
    //We iterate over it
    parent.party_list.forEach(function(otherPlayerName){
        // !!! IMPORTANT !!! parent.entities only holds OTHER players, not
        //the current player running this code!! Therefor....
        let partyMember = parent.entities[otherPlayerName];
        //...we have to check if party member holds something or is undefined!!!
        if(partyMember) {
            //Shield Partymenber
            if(character.mp > G.skills.reflection.mp
                && partyMember.hp < (partyMember.max_hp * hpReserve)
                && !partyMember.rip
                && is_in_range(partyMember, "reflection")
                && !is_on_cooldown("reflection")){
                use_skill("reflection", partyMember);
                game_log("Mage shielded " + partyMember.name);
            }
            //Energize Partymenber
            if(character.mp > (character.max_mp * manaReserve)
                && partyMember.mp < (partyMember.max_mp * manaReserve)
                && !partyMember.rip
                && is_in_range(partyMember, "energize")
                && !is_on_cooldown("energize")){
                use_skill("energize", partyMember);
                game_log("Mage energized " + partyMember.name);
            }
        }
    });

    //Burst
    if(target
        && character.mp > (character.max_mp * manaReserve)
        && target.hp >= (character.mp * 0.5)
        && is_in_range(target, "burst")
        && !is_on_cooldown("burst")){
        use_skill("burst");
        game_log("Mage bursting enemy");
    }
}

function priestSkills(target){

    //How much Mana should be kept in reserve
    let manaReserve = 0.7;
    let hurtPartyMembers = 0;
    let healingThreshold = 0.8;

    //Priest heals himself
    if(character.hp < (character.max_hp * healingThreshold)
        //&& can_heal(character)
        && !is_on_cooldown("heal")){
        heal(character);
        game_log("Priest is healing himself");
    }

    //parent.party_list is an array with the names of PartyMembers
    //We iterate over it
    parent.party_list.forEach(function(otherPlayerName){
        // !!! IMPORTANT !!! parent.entities only holds OTHER players, not
        //the current player running this code!! Therefor....
        let partyMember = parent.entities[otherPlayerName];
        //...we have to check if party member holds something or is undefined!!!
        if (partyMember) {

            //Heal COMPLETE Party
            if(character.hp < (character.max_hp * healingThreshold))    hurtPartyMembers++;
            if(partyMember.hp < (partyMember.max_hp * healingThreshold)
                && partyMember.rip === false) hurtPartyMembers++;

            if(hurtPartyMembers >= 2
                && character.mp >= G.skills.partyheal.mp
                && !is_on_cooldown("partyheal")){
                use_skill("partyheal");
                game_log("Priest is healing Party");
            }
            //Heal ONE Partymember
            if(partyMember.hp < (partyMember.max_hp * healingThreshold)
                && !partyMember.rip
                //&& can_heal(partyMember)
                && is_in_range(partyMember, "heal")
                && !is_on_cooldown("heal")){
                heal(partyMember).then((message) => {
                    reduce_cooldown("heal", character.ping);
                    game_log("Priest is healing " + partyMember.name);
                }).catch((message) => {
                    log(character.name + " Heal failed: " + message.reason);
                });
            }
        }
    });
    if(target
        && character.mp > (character.max_mp * manaReserve)
        && character.mp > G.skills.curse.mp
        && is_in_range(target, "curse")
        && !is_on_cooldown("curse")){
        use_skill("curse");
        game_log("Priest cursed the enemy");
    }
}

function rangerSkills(target, farmMonsterName){

    //How much Mana should be kept in reserve
    let manaReserve = 0.8;

    //Use Ranger Skills
    if(character.mp > (character.max_mp * manaReserve)){
        //3-Shot
        if(character.mp > G.skills["3shot"].mp
            && !is_on_cooldown("attack")){
            let targets = Object.values(parent.entities).filter(entity => entity.mtype === farmMonsterName && is_in_range(entity, "3shot"));
            if(targets.length >= 3) use_skill("3shot", targets);
            game_log("Ranger used 3-Shot");
        }
        //Supershot
        if(character.mp > G.skills.supershot.mp
            && is_in_range(target, "supershot")
            && !is_on_cooldown("supershot")){
            use_skill("supershot");
            game_log("Ranger used Supershot");
        }
        //Hunters Mark
        if(character.mp > G.skills.huntersmark.mp
            && is_in_range(target, "huntersmark")
            && !is_on_cooldown("huntersmark")){
            use_skill("huntersmark");
            game_log("Ranger used Hunters Mark");
        }
    }
}