import {Player} from "../../mechanics/player";
import {PiSystem} from "../../mechanics/picalc/pi-system";
import {HealthbarSprites} from "./HealthbarSprites";

export class Healthbar {
    private refScene: Phaser.Scene;
    private players: [Player, Player];
    private system : PiSystem;
    private spritesP1 : HealthbarSprites;
    private spritesP2 : HealthbarSprites;



    /*
        DISPLAY HEALTHBAR ON MAIN SCENE
     */
    constructor(refScene: Phaser.Scene, players : [Player, Player], piSystem : PiSystem){
        this.refScene = refScene;
        this.players = players;
        this.players[0].setHealthbar(this);
        this.players[1].setHealthbar(this);

        // SET UP FOR SPRITES
        let maxArmorP1 = this.players[0].getHealth().getCurrentArmor();
        let maxShieldP1 = this.players[0].getHealth().getCurrentShield();
        let maxArmorP2 = this.players[1].getHealth().getCurrentArmor();
        let maxShieldP2 = this.players[1].getHealth().getCurrentShield();
        this.spritesP1 = new HealthbarSprites(new Array(maxArmorP1), new Array(maxShieldP1));
        this.spritesP2 = new HealthbarSprites(new Array(maxArmorP2), new Array(maxShieldP2));


        // MAIN HEALTH-PiString (core-explosion process here)
        this.system = piSystem;
        let piTotalLifeP1 = this.players[0].getPiSystem().add.channelIn("shieldDestroyed" + players[0].getNameIdentifier(), "*").channelIn("armorDestroyed" + players[0].getNameIdentifier(), "*").process("CoreExplosion" + players[0].getNameIdentifier(), this.coreExplosion);
        let piTotalLifeP2 = this.players[1].getPiSystem().add.channelIn("shieldDestroyed" + players[1].getNameIdentifier(), "*").channelIn("armorDestroyed" + players[1].getNameIdentifier(), "*").process("CoreExplosion" + players[1].getNameIdentifier(), this.coreExplosion);
        this.system.pushSymbol(piTotalLifeP1);
        this.system.pushSymbol(piTotalLifeP2);

        // CREATE REPLICATION FOR SHOP ACTION 'buy shield / buy armor'
        let addShieldP1 = this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("rShield" + players[0].getNameIdentifier(), "*").process("regenerateShield", this.regenerateShield(players[0]))));
        let addArmorP1 = this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("rArmor" + players[0].getNameIdentifier(), "*").process("regenerateArmor", this.regenerateArmor(players[0]))));
        let addShieldP2 = this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("rShield" + players[1].getNameIdentifier(), "*").process("regenerateShield", this.regenerateShield(players[1]))));
        let addArmorP2 = this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("rArmor" + players[1].getNameIdentifier(), "*").process("regenerateArmor", this.regenerateArmor(players[1]))));

        // ADD HEALTH TO PLAYER AND PI-SYSTEM
        this.constructHealthbar(this.players[0]);
        this.constructPiTerms(this.players[0]);
        this.constructHealthbar(this.players[1]);
        this.constructPiTerms(this.players[1]);


    }

    private regenerateArmor(player: Player) : Function {
        let regArmor = function()
        {
            console.log("Regenerate Armor " + "P1")
            player.getHealth().regenerateArmor();
            player.getHealthbar().constructHealthbar(player);
        }
        return regArmor;
    }

    private regenerateShield(player: Player) : Function {
        let regShield = function() {
            player.getHealth().regenerateShield();
            player.getHealthbar().constructHealthbar(player);
        }
        return regShield;
    }

    /*
        END GAME ?
     */
    private coreExplosion() {
        // todo: implement core explosion (end of game)
        console.log("[coreExplosion()] Core Exploded !")
    }

    /*
        DISPLAY / REFRESH HEALTHBAR
     */
    private constructHealthbar(player : Player)
    {
        console.log("[constructHealthbar()] " + player.getNameIdentifier() +  " Healthbar refresh, Armor: " + player.getHealth().armor + ", Shield = " + player.getHealth().shield);
        // ERASE ALL SPRITES FROM SCREEN AND FROM MEMORY
        let sprites = player.isFirstPlayer() ? player.getHealthbar().spritesP1 : player.getHealthbar().spritesP2;
        this.clearSprites(sprites);
        sprites = new HealthbarSprites(new Array(player.getHealth().getCurrentArmor()), new Array(player.getHealth().getCurrentShield()));

        // CONSTRUCT HEALTHBAR WITH CURRENT HEALTH VALUES
        let hp = player.getHealth().getCurrentArmor();
        let shield = player.getHealth().getCurrentShield();

        // CALCULATE COORDINATES ON SCREEN
        let x = player.isFirstPlayer() ? 182 : this.refScene.cameras.main.width - 182;
        let y = 100;

        // ADDING SPRITES TO SCREEN AND MEMORY
        for (let i = 0; i < hp; i++)
        {
            const armor =  player.isFirstPlayer() ? this.refScene.add.image(x += 18, y, "healthbar") : this.refScene.add.image( x -= 18, y, "healthbar");
            sprites.armorSprites[i] = armor;
        }

        x = player.isFirstPlayer() ? x + 18 : x - 18;
        x = player.isFirstPlayer() ? x + (player.getHealth().getCurrentArmor() - hp) * 18 : x - (player.getHealth().getCurrentArmor() - hp) * 18;
        for (let i = 0; i < shield; i++)
        {
            const shield =  player.isFirstPlayer() ? this.refScene.add.image(x += 18, y, "shieldbar") : this.refScene.add.image( x -= 18, y, "shieldbar");
            sprites.shieldSprites[i] = shield;
        }
        player.getHealthbar().spritesP1 = player.isFirstPlayer() ? sprites : player.getHealthbar().spritesP1;
        player.getHealthbar().spritesP2 = player.isFirstPlayer() ? player.getHealthbar().spritesP2 : sprites;
    }

    /*
        CLEAR HEALTHBAR COMPLETELY FROM SCREEN
     */
    private clearSprites(sprites: HealthbarSprites) {

        for (let i = 0; i < sprites.armorSprites.length; i++)
            if (typeof sprites.armorSprites[i] != 'undefined')
                sprites.armorSprites[i].destroy(true);
        for (let i = 0; i < sprites.shieldSprites.length; i++)
            if (typeof sprites.shieldSprites[i] != 'undefined')
                sprites.shieldSprites[i].destroy(true);

    }

    /*
        CONSTRUCT Pi-Terms FOR ARMOR AND SHIELD
     */
    private constructPiTerms(player : Player) {
        this.addArmor(player.getHealth().getCurrentArmor(), player);
        this.addShield(player.getHealth().getCurrentShield(), player);
    }
    private addArmor(amount: number, player : Player) {
        for (var i = 0; i < amount; i++)
            player.getPiSystem().pushSymbol(player.getPiSystem().add.channelIn("armor" + player.getNameIdentifier(), "*").process("damageArmor", this.damageArmor(player)));
    }
    private addShield(amount: number, player : Player) {
        for (var i = 0; i < amount; i++)
            player.getPiSystem().pushSymbol(player.getPiSystem().add.channelIn("shield" + player.getNameIdentifier(), "*").process("damageShield", this.damageShield(player)));
    }


    /*
        (Callback) DO DAMAGE TO ARMOR
        - update player health
        - refresh healthbar
    */
    public damageArmor(player : Player) : Function {
        let playerP1 = this.players[0].isFirstPlayer() ? this.players[0]: this.players[1];
        let playerP2 = !this.players[0].isFirstPlayer() ? this.players[0]: this.players[1];
        let dmgArmor = function()
        {
            console.log("[ACTION] Armor Damaged!");
            player.getHealth().damageArmor();
            player.getHealthbar().constructHealthbar(player);
            if (player.getHealth().getCurrentArmor() <= 0)
            {
                console.log("[DEBUG] Armor is Empty, pushing: armorEmpty" + player.getNameIdentifier());
                this.system.pushSymbol(this.system.add.channelOut("armorEmpty" + player.getNameIdentifier(), "*").nullProcess());
            }


        };
        return dmgArmor;
    }

    /*
       (Callback) DO DAMAGE TO SHIELD
       - update player health
       - refresh healthbar
   */
    public damageShield(player: Player) : Function {
        let playerP1 = this.players[0].isFirstPlayer() ? this.players[0]: this.players[1];
        let playerP2 = !this.players[0].isFirstPlayer() ? this.players[0]: this.players[1];
        console.log("[DEBUG] P1 = " + playerP1.getNameIdentifier() + " , P2 = " + playerP2.getNameIdentifier() + " current = " + player.getNameIdentifier());
        let dmgShield = function()
        {
            player.getHealth().damageShield();
            console.log("[ACTION] " + player.getNameIdentifier() + "'s Shield Damaged!" + " Armor: " + player.getHealth().armor + ", Shield = " + player.getHealth().shield);
            player.getHealthbar().constructHealthbar(player);
            if (player.getHealth().getCurrentShield() == 0)
            {
                console.log("[DEBUG] " + player.getNameIdentifier() + "'s Shield is Empty. Destroying Shield.");
                this.system.pushSymbol(this.system.add.channelOut("shieldEmpty" + player.getNameIdentifier(), "*").nullProcess());
            }
        };
        return dmgShield;

    }



}