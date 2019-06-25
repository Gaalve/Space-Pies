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
    private weapons: Array<Weapon>;
    onScreenText : Phaser.GameObjects.Text;


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
        infobox.addTooltipInfo(this.pilot.normal, "[P1] The pilot.. he is there, I swear...")
        infobox.addTooltipInfo(this.hull.normal, "[P1] The hull of your ship. \nAt least this one's as ugly as the others. Not as rich as you though 'eh ?")


        this.x =  x;
        this.y = y;
        this.durationX = 900;
        this.durationY = 1000;
        this.sinX = 0;
        this.sinY = 0;
        this.weapons = new Array<Weapon>();
        this.setAllPartPosition();

        this.setAllPartPosition();
        // this.toDestroyedShip();
    }

    private moveSin(moveX, moveY, fromX: number, toX: number, fromY: number, toY: number, delta: number, sprite: Sprite) {
        if (moveX) sprite.x = fromX + Math.sin(delta * Math.PI / 2) * (toX - fromX);
        if (moveY) sprite.y = fromY + Math.cos(delta * Math.PI / 2) * (toY - fromY);
    }


    toDestroyedShip(): void {
        this.backDown.toDestroyedPart();
        this.backUp.toDestroyedPart();
        this.pilot.toDestroyedPart();
        this.wingDown.toDestroyedPart();
        this.wingUp.toDestroyedPart();
        this.hull.toDestroyedPart();
    }

    setAllPartPosition(moveX?: Boolean, moveY?: Boolean): void {
        let posX = moveX ? (this.posX + Math.sin(this.sinX) * 25) : this.posX;
        let posY = moveY ? this.posY + Math.cos(this.sinY) * 25 : this.posY;

        this.onScreenText ? this.onScreenText.setPosition(posX - 210, posY + this.onScreenText.width/2) : null;

        this.backUp.setPosition(posX, posY);
        this.backDown.setPosition(posX, posY);
        this.pilot.setPosition(posX, posY);
        this.wingUp.setPosition(posX, posY);
        this.wingDown.setPosition(posX, posY);
        this.hull.setPosition(posX, posY);

        if (this.weapons)
        {
            for (let i = 0; i < this.weapons.length; i++)
            {
                let weapon = this.weapons[i];
                if (weapon)
                {
                    // let posXweapon = moveX && weapon ? (weapon.x + Math.sin(this.sinX) * 25) : weapon ? weapon.x : null;
                    // let posYweapon = moveY && weapon ? (weapon.y + Math.cos(this.sinY) * 25) : weapon ? weapon.y : null;
                    i == 0 ?
                        weapon.setPosition(this.hull.normal.x + 100, this.hull.normal.y)
                        :
                        i == 1 ?
                            weapon.setPosition(this.wingDown.normal.x, this.wingDown.normal.y)
                            :
                            i == 2 ?
                                weapon.setPosition((this.wingUp.normal.x), this.wingUp.normal.y)
                                : null;
                }
            }
        }

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

        this.setAllPartPosition(false,true);
    }

    setOnScreenText(text)
    {
        this.onScreenText = text;
    }
}