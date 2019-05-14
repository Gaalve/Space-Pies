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
        this.players[0].healthbar = this;
        this.players[1].healthbar = this;

        // SET UP FOR SPRITES
        let maxArmorP1 = this.players[0].health.getCurrentArmor();
        let maxShieldP1 = this.players[0].health.getCurrentShield();
        let maxArmorP2 = this.players[1].health.getCurrentArmor();
        let maxShieldP2 = this.players[1].health.getCurrentShield();
        this.spritesP1 = new HealthbarSprites(new Array(maxArmorP1), new Array(maxShieldP1));
        this.spritesP2 = new HealthbarSprites(new Array(maxArmorP2), new Array(maxShieldP2));

        // SETE UP FOR PISYSTEM (core-explosion string here)
        this.system = piSystem;
        let piTotalLifeP1 = this.players[0].system.add.channelIn("shieldDestroyed" + players[0].getNameIdentifier(), "*").channelIn("armorDestroyed" + players[0].getNameIdentifier(), "*").process("CoreExplosion" + players[0].getNameIdentifier(), this.coreExplosion);
        let piTotalLifeP2 = this.players[1].system.add.channelIn("shieldDestroyed" + players[1].getNameIdentifier(), "*").channelIn("armorDestroyed" + players[1].getNameIdentifier(), "*").process("CoreExplosion" + players[1].getNameIdentifier(), this.coreExplosion);
        this.system.pushSymbol(piTotalLifeP1);
        this.system.pushSymbol(piTotalLifeP2);

        // ADD HEALTH TO PLAYER AND PI-SYSTEM
        this.constructHealthbar(this.players[0]);
        this.constructPiTerms(this.players[0]);
        this.constructHealthbar(this.players[1]);
        this.constructPiTerms(this.players[1]);


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
        console.log("[constructHealthbar()] " + player.getNameIdentifier() +  " Healthbar refresh, Armor: " + player.health.currentArmor + ", Shield = " + player.health.currentShield);
        // ERASE ALL SPRITES FROM SCREEN AND FROM MEMORY
        let sprites = player.isFirstPlayer() ? player.healthbar.spritesP1 : player.healthbar.spritesP2;
        this.clearSprites(sprites);
        sprites = new HealthbarSprites(new Array(player.health.getCurrentArmor()), new Array(player.health.getCurrentShield()));

        // CONSTRUCT HEALTHBAR WITH CURRENT HEALTH VALUES
        let hp = player.health.getCurrentArmor();
        let shield = player.health.getCurrentShield();

        // CALCULATE COORDINATES ON SCREEN
        let x = player.isFirstPlayer() ? 182 : this.refScene.cameras.main.width - 182;
        let y = 100;

        // ADDING SPRITES TO SCREEN AND MEMORY
        for (let i = 0; i < hp; i++)
        {
            const armor = this.refScene.add.image( x -= 18, y, "healthbar");
            sprites.armorSprites[i] = armor;
        }
        for (let i = 0; i < shield; i++)
        {
            const shield = this.refScene.add.image(x -= 18, y, "shieldbar");
            sprites.shieldSprites[i] = shield;
        }
        player.healthbar.spritesP1 = player.isFirstPlayer() ? sprites : player.healthbar.spritesP1;
        player.healthbar.spritesP2 = player.isFirstPlayer() ? player.healthbar.spritesP2 : sprites;
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
        this.addArmor(player.health.getMaxArmor(), player);
        this.addShield(player.health.getMaxShield(), player);
    }
    private addArmor(amount: number, player : Player) {
        for (var i = 0; i < amount; i++)
            player.system.pushSymbol(player.system.add.channelIn("armor" + player.getNameIdentifier(), "*").process("damageArmor", this.damageArmor(player)));
    }
    private addShield(amount: number, player : Player) {
        for (var i = 0; i < amount; i++)
            player.system.pushSymbol(player.system.add.channelIn("shield" + player.getNameIdentifier(), "*").process("damageShield", this.damageShield(player)));
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
            player.health.damageArmor();
            player.healthbar.constructHealthbar(player);
            if (player.health.getCurrentArmor() <= 0)
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
            player.health.damageShield();
            console.log("[ACTION] " + player.getNameIdentifier() + "'s Shield Damaged!" + " Armor: " + player.health.currentArmor + ", Shield = " + player.health.currentShield);
            player.healthbar.constructHealthbar(player);
            if (player.health.getCurrentShield() == 0)
            {
                console.log("[DEBUG] " + player.getNameIdentifier() + "'s Shield is Empty. Destroying Shield.");
                this.system.pushSymbol(this.system.add.channelOut("shieldEmpty" + player.getNameIdentifier(), "*").nullProcess());
            }
        };
        return dmgShield;

    }



}