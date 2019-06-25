import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";
import {Infobox} from "../Infobox";
import Sprite = Phaser.GameObjects.Sprite;
import {Weapon} from "../weapon";

export class BlueShip extends BaseShip{

    back: ShipPart;
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
    private weaponSinX: number;
    private weaponSinY: number;
    private onScreenText: Phaser.GameObjects.Text;

    public constructor(scene: Phaser.Scene,x: number, y: number){
        super(scene, x, y);

        this.back = new ShipPart(scene, x, y, "ssbr/ssb_back", "ssbr/ssb_des_back",
            79, 0, 36, 6,1);

        this.pilot = new ShipPart(scene, x, y, "ssbr/ssb_pilot", "ssbr/ssb_des_pilot",
            -149, 0, -121, 8,1);

        this.wingUp = new ShipPart(scene, x, y, "ssbr/ssb_wing_up", "ssbr/ssb_des_wing_up",
            -19, -112, -20, -92,1);

        this.wingDown = new ShipPart(scene, x, y, "ssbr/ssb_wing_down", "ssbr/ssb_des_wing_down",
            -19, 112, -40, 104,1);

        this.hull = new ShipPart(scene, x, y, "ssbr/ssb_hull", "ssbr/ssb_des_hull",
            -46, 0, -37, 13,2);

        let infobox = <Infobox> scene.data.get("infoboxx");
        infobox.addTooltipInfo(this.back.normal, "[P2] The back of your Ship.")
        infobox.addTooltipInfo(this.pilot.normal, "[P2] The pilot.. even though you can't see him")
        infobox.addTooltipInfo(this.wingUp.normal, "[P2] Your right wing.")
        infobox.addTooltipInfo(this.wingDown.normal, "[P2] The left wing of your Ship.")
        infobox.addTooltipInfo(this.hull.normal, "[P2] The hull of your ship.")

        this.x =  x;
        this.y = y;
        this.durationX = 1250;
        this.durationY = 750;
        this.sinX = 0;
        this.sinY = 0;
        this.weaponSinX = 0;
        this.weaponSinY = 0;
        this.weapons = new Array<Weapon>();
        this.setAllPartPosition();
        // this.toDestroyedShip();
    }


    private moveSin(fromX: number, toX: number, fromY: number, toY: number, delta: number, sprite: Sprite) {
        sprite.x = fromX + Math.sin(delta * Math.PI / 2) * (toX - fromX);
        sprite.y = fromY + Math.cos(delta * Math.PI / 2) * (toY - fromY);
    }

    toDestroyedShip(): void {
        this.back.toDestroyedPart();
        this.pilot.toDestroyedPart();
        this.wingDown.toDestroyedPart();
        this.wingUp.toDestroyedPart();
        this.hull.toDestroyedPart();
    }


    setAllPartPosition(moveX?: Boolean, moveY?: Boolean): void {
        let posX = moveX ? (this.posX + Math.sin(this.sinX) * 25) : this.posX;
        let posY = moveY ? this.posY + Math.cos(this.sinY) * 25 : this.posY;

        this.onScreenText ? this.onScreenText.setPosition(posX + 165, posY + this.onScreenText.width/2) : null;

        this.back.setPosition(posX, posY);
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
                        weapon.setPosition(this.hull.normal.x - 100, this.hull.normal.y)
                        :
                        i == 1 ?
                            weapon.setPosition(this.wingDown.normal.x - 25, this.wingDown.normal.y)
                            :
                            i == 2 ?
                                weapon.setPosition((this.wingUp.normal.x - 25), this.wingUp.normal.y)
                                : null;
                }
            }
        }
    }

    toDestroyedBack(): void {
        this.back.toDestroyedPart();
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

    public addWeapon(weapon: Weapon)
    {
        this.weapons.push(weapon);
    }

    update(delta: number, weapon?: Weapon): void {
        this.back.update(delta);
        this.pilot.update(delta);
        this.hull.update(delta);
        this.wingUp.update(delta);
        this.wingDown.update(delta);



        this.sinX += delta/ this.durationX;
        this.sinY += delta/ this.durationY;

        this.sinX %= 2*Math.PI;
        this.sinY %= 2*Math.PI;

        this.setAllPartPosition(true,true);


        // this.swingTimer = this.swingTimer > this.swingSpeed * 2 ? 0 : this.swingTimer;
        // this.swingTimer += delta;
        // let fromX = this.x;
        // if (typeof(this.wingUp.x) == 'undefined' && this.wingDown.x == null)
        //     return;
        // this.moveSin(this.wingDown.x, this.wingDown.x + 10 , this.wingDown.y, this.wingDown.y + 15, this.swingTimer / this.swingSpeed, this.wingDown.normal);
        // this.moveSin(this.wingUp.x, this.wingUp.x + 10, this.wingUp.y, this.wingUp.y + 15, this.swingTimer / this.swingSpeed, this.wingUp.normal);
        // this.moveSin(this.hull.x, this.hull.x + 10, this.hull.y, this.hull.y + 15, this.swingTimer / this.swingSpeed, this.hull.normal);
        // this.moveSin(this.pilot.x, this.pilot.x + 10, this.pilot.y, this.pilot.y + 15, this.swingTimer / this.swingSpeed, this.pilot.normal);
        // this.moveSin(this.back.x, this.back.x + 10, this.back.y, this.back.y + 15, this.swingTimer / this.swingSpeed, this.back.normal);
    }

    setOnScreenText(text)
    {
        this.onScreenText = text;
    }

}