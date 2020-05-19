# Adventure.Land

NB: forked from : https://github.com/johnnyawesome/Adventure.Land

This is my code for Adventure.Land, an epic indie MMO RPG, where you have to write JavaScript code to fully automate everything that happens. You can check out [Adventure.Land here.](https://adventure.land/) This is the [Youtube Trailer of the game](
https://www.youtube.com/watch?v=HJAj9u2TEZc).

The basic idea of the game itself is super appealing: The most forbidden thing in *any* game is to write a bot for it. *Here, BOTTING IS THE GAME!* :)

(This is not my first coding game, I also played [Screeps](https://screeps.com/), and you can [check out my source here](https://github.com/johnnyawesome/Screeps)).

## Getting started

These are two great guides that will give you an overview over the game:

- [Sin's Guide to life in Adventure Land](https://steamcommunity.com/sharedfiles/filedetails/?id=1636142608)
- [FAQ's by Trexnamedtom](https://steamcommunity.com/sharedfiles/filedetails/?id=1640326394)

## Battletested

This code is simple, but *it works*, I made sure of that.

I only publish a new version of my Adventure.Land scripts if they ran flawlessly over several days.

So you can be sure, if you use (some or all of) my code, *it works, and it's stable and reliable*.

## Code overview

The game lets you create multiple modules, which I did, to keep things organized.

Also, many players hardcode their character's names everywhere in the game. I tried to avoid that as much as possible, so I don't have to touch many places in the code when starting a new character.

Most code I've seen has one single"main" loop that runs ~250ms, so 4 times per second. This is suggested for optimal farming performance. My code does have two "main" loops. Running everything every 250 milliseconds might give you great farming-performance, but it's horrible for performance overall. Therefor, I made a "tierTwo" loop that only runs every 3 seconds. All non-essential routines get called from there.

## The Characters

You can use four characters at the same time, I opted for:

- Mage
- Priest
- Ranger
- Merchant

The merchant is the most capable character so far. Most people only use him to sell things on the marketplace.
My code takes a different approach: Because the merchant cannot generate gold on his own, he acts as support-character for the party, so they don't get interrupted and can keep farming 100% of the time.

## What the code does

This is a work in progress, and things will change. I don't have a high level yet, and can only farm low level enemies.
Once I can go for harder enemies, the code will most certainly change a lot.

Here's a list of what the code is capable of so far:

## General

- Hotkeys: To load characters / create a party / stop characters
- Auto-move to the designated farming spot, over several maps / continents.
- Auto-Farm designated mob's
- Auto-use potions (heal & mana)
- Auto-Kite enemies. (All characters I use (Mage, Priest, Ranger) are ranged characters.)

## Individual characters

- The mage can: auto-attack enemies (farming), energize partymembers, burst enemies and shield hurt allies from damage
- The Ranger is also capable to auto-attack enemies (farming), he can use the "hunters mark" and he uses the supertshots (higher dps) skill on enemies. He also uses Multishot for optimal farming efficiency.
- The priest also can farm on it's own, heal partymembers and heal the whole party at once if needed. He can also debuff (curse) enemies

The individual character modules are still very basic. Farming low-level mob's did not require writing complex code, or even character interaction (beyond healing), so far.

### The merchant

The merchant can sell your loot on the marketplace. You can just drop your loot inside his store, set a price and he'll sell it.

I decided that, because the merchant cannot farm / generate gold on his own, he should act as a support characters for the "productive" characters.

So he takes care of a lot of things for you!

Every 15 minutes, he does a round:

- Close the merchant stand
- Buys potions for all characters
- Walks to the current farming spot
- Delivers the potions to all characters
- Gets all their items...
- ...and all their gold
- Goes back to the market
- Buys scrolls (if needed) to upgrade the items he got from the farming characters
- Exchanges any gems / chests he received
- Deposits all gold above a certain limit in the bank. (Remember, to auto-buy things, he cannot deposit all gold, he needs to keep some)
- Goes back to town and opens up his little stand

Once the stand is open, he continues his work:

- Auto-craft (compound) multiple items into a higher level item
- Put these higher level items in the stand for sale
- Sell "trash", so your inventory doesn't fill up. You can designate what is considered "trash" depending on what your current enemies drop.
- Tidy the inventory so there are no gaps (from crafting / selling things)
- Give other players the "merchant's luck"-buff, with a chance to duplicate an item from them
- Auto-buy cheap items from other merchants. If they sell an item under it's value, he'll buy it automatically. 

## General functions

There's a  module called "helperFunctions": It holds all functions in one place which are useful to every character (not to waste module-slots). They are quite helpful and take care of a lot of things:

- Starting / stopping characters and creating a party
- Finding a target to attack
- Auto-Transfer loot (to the merchant)
- Relocate potions to slots that are not tansferred to the merchant
- Handle party-invitations

## Adjust the code

I tried to make the code as open as possible. However, you have to change four things in the "Main"-Module, so the code knows *what you want to farm* and *who your merchant is*.

Adjust these four variables, and you're good to go:

```javascript
//Farming spots are found in G.maps
const farmMonsterName = "arcticbee";
const farmMap = "winterland";
const farmMonsterNr = 10;
const merchantName = "YourMechantsName";
```
- "farmMonsterName" needs to be a string. It's the name of the [monster you want to farm](https://adventure.land/docs/guide/all/monsters) (e.g. "arcticbee" or "crab").
- "farmMap" also neets to be a string. It's the [map](https://adventure.land/docs/code/data/maps) you want to farm on. There are different maps, like "main" or "halloween" or  "winterland". Assign the map you want to farm on to "farmMap".
- "farmMonsterNr" *is important*! Some monsters spawn on *multiple locations*!
  Example: On the "main" continent, there are several spawns of bees.
  - Put your character on the "main" map and enter this command into your console and run it: **smart_move({to:"bee"});**
  - *Run the command several times*.
  - Even though you entered the *same* command multiple times, your character will walk to *different* spawns of bees.
  - Your farming-party will be scattered because of this
  - The way to fix this is to look at all the spawns and find one that has a unique "count"-variable (which is the count of monsters that spawn there)
  - Look into [G.maps](https://adventure.land/docs/code/data/maps), click the map you want to farm on and look for the monster-name you want to farm. If there are multiple spawns, check the "count" variables for each spawn. *Find a "count"-value that is unique!*
  "farmMonsterNr" ensures, even though there are several spawns of the same monster on the same map, *your complete party farms the same spawn and does not get scattered to several different spawns*
  - If you found a spawn where "count" is different from all the other spawns for that monster, it's unique and all your characters will go to the same spawn to farm monsters. Yay!
- "merchantName" must be the name of your merchant, as a string. It's used to transfer the farming-party's loot / gold to the merchant etc.

## To do's

- At the moment, I do not have all skills unlocked. Therefor, I have not written code for them yet.
- Also, I farm weak enemies. There is no party-coordination going on atm. I chose to farm weak mob's to be able to 1-shot them  (which ideally gives me 3 mob kills per tick). Coordinating the party would interfere with maximum farming efficiency. (If the characters would follow a leader for example, he could miss out on farming a few ticks, because he's walking). Even kiting is turned off by default atm (but it's working, uncomment it if needed). Once I start farming harder npc's, the good (and complex) part of the game starts. Character coordination, placing each character in a certain fashion for maximum efficiency, better kiting etc.
- The npc's I farm don't drop weapons or armor. So upgrading is not implemented yet
- The merchant should bring the really good loot to the bank on it's own. But these drops are so rare, I haven't implemented that yet
- A ton of other things I don't even know about yet is also not done yet. :)

## Recap

The code can run on it's own several days, if you tweak tha values correctly. The merchant's inventory requires attention from time to time, because I don't want to auto-sell good items, so they keep piling up (intentionally). You can tweak that of course, the code is there.

Enjoy!

## More Information

[I blogged about this project in more detail](https://breaksome.tech/adventure-land-tips/)
