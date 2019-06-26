import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";
import {Infobox} from "../Infobox";
import Sprite = Phaser.GameObjects.Sprite;
import {Weapon} from "../weapon";

export class RedShip extends BaseShip{
    backUp: ShipPart;
    backDown: ShipPart;
    pilot: ShipPart;
    wingUp: ShipPart;
    wingDown: ShipPart;
    hull: ShipPart;
    x : number;
    y : number;
    durationX : number;
    durationY : number;
    sinX : number;
    sinY : number;
    onScreenText : Phaser.GameObjects.Text;
    private weapons: Weapon[];


    public constructor(scene: Phaser.Scene,x: number, y: number){
        super(scene, x, y);
        this.backUp = new ShipPart(scene, x, y, "ssbr/ssr_back_up", "ssbr/ssr_des_back_up",
            -60, -85, -61, -103,1);

        this.backDown = new ShipPart(scene, x, y, "ssbr/ssr_back_down", "ssbr/ssr_des_back_down",
            -60, 85, -68, 72,1);

        this.pilot = new ShipPart(scene, x, y, "ssbr/ssr_pilot", "ssbr/ssr_des_pilot",
            141, 0, 133, -2,1);

        this.wingUp = new ShipPart(scene, x, y, "ssbr/ssr_wing_up", "ssbr/ssr_des_wing_up_2",
            59, -151, 58, -76,1);

        this.wingDown = new ShipPart(scene, x, y, "ssbr/ssr_wing_down", "ssbr/ssr_des_wing_down",
            59, 151, 51, 98,1);

        this.hull = new ShipPart(scene, x, y, "ssbr/ssr_hull", "ssbr/ssr_des_hull",
            11, 0, 55, 15,2);

        let infobox = <Infobox> scene.data.get("infoboxx");
        infobox.addTooltipInfo(this.backDown.normal, "[P1] The right half of your Ship. God, how can P2 even look in the mirror ?")
        infobox.addTooltipInfo(this.wingDown.normal, "[P1] The right half of your Ship. God, how can P2 even look in the mirror ?")
        infobox.addTooltipInfo(this.backUp.normal, "[P1] Your left two wings. You got the latest model eh? You filthy ritch slut.");
        infobox.addTooltipInfo(this.wingUp.normal, "[P1] Your left two wings. You got the latest model eh? You filthy ritch slut.")
        infobox.addTooltipInfo(this.pilot.normal, "[P1] This is Olaf\n" +
            "Bio:\n" +
            "     + renowned space ship engineer\n" +
            "     + inventor of the rocket shield\n" +
            "     + cake thief\n" +
            "     + does not like tangerines");
        infobox.addTooltipInfo(this.hull.normal, "[P1] The hull of your ship. \nAt least this one's as ugly as the others. Not as rich as you though 'eh ?")


        this.x =  x;
        this.y = y;
        this.durationX = 750;
        this.durationY = 1000;
        this.sinX = 0;
        this.sinY = 0;
        this.weapons = [];
        this.setAllPartPosition();

        this.setAllPartPosition();
    }



    toDestroyedShip(): void {
        this.backDown.toDestroyedPart();
        this.backUp.toDestroyedPart();
        this.pilot.toDestroyedPart();
        this.wingDown.toDestroyedPart();
        this.wingUp.toDestroyedPart();
        this.hull.toDestroyedPart();
    }

    setAllPartPosition(): void {
        let posX = (this.posX + Math.sin(this.sinX) * 15);
        let posY = (this.posY + Math.cos(this.sinY) * 15);

        this.backUp.setPosition(posX, posY);
        this.backDown.setPosition(posX, posY);
        this.pilot.setPosition(posX, posY);
        this.wingUp.setPosition(posX, posY);
        this.wingDown.setPosition(posX, posY);
        this.hull.setPosition(posX, posY);

        if(this.weapons[0]) this.weapons[0].setPosition(this.hull.normal.x + 124, this.hull.normal.y);
        if(this.weapons[1]) this.weapons[1].setPosition(this.hull.normal.x + 44, this.hull.normal.y - 150);
        if(this.weapons[2]) this.weapons[2].setPosition(this.hull.normal.x + 44, this.hull.normal.y + 150);

        this.onScreenText ? this.onScreenText.setPosition(posX - 210, posY + this.onScreenText.width/2) : null;

    }

    toDestroyedBack(): void {
        this.backDown.toDestroyedPart();
        this.backUp.toDestroyedPart();
    }

    toDestroyedHull(): void {
        this.hull.toDestroyedPart();
    }

    toDestroyedPilot(): void {
        this.pilot.toDestroyedPart();
    }

    toDestroyedWingDown(): void {
        this.wingDown.toDestroyedPart();
    }

    toDestroyedWingUp(): void {
        this.wingUp.toDestroyedPart();
    }

    addWeapon(weapon: Weapon): void
    {
        this.weapons.push(weapon);
    }

    update(delta: number): void {
        this.backUp.update(delta);
        this.backDown.update(delta);
        this.pilot.update(delta);
        this.hull.update(delta);

        this.wingUp.update(delta);
        this.wingDown.update(delta);
        this.backUp.update(delta);
        this.backDown.update(delta);
        this.pilot.update(delta);
        this.hull.update(delta);
        this.wingUp.update(delta);
        this.wingDown.update(delta);


        this.sinX += delta/ this.durationX;
        this.sinY += delta/ this.durationY;

        this.sinX %= 2*Math.PI;
        this.sinY %= 2*Math.PI;

        this.setAllPartPosition();
    }

    setOnScreenText(text){
        this.onScreenText = text;
    }

}