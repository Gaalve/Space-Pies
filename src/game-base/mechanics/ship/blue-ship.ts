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
    private weapons: Weapon[];
    private weaponSinX: number;
    private weaponSinY: number;

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
        this.weapons = [];
        this.setAllPartPosition();
    }


    toDestroyedShip(): void {
        this.back.toDestroyedPart();
        this.pilot.toDestroyedPart();
        this.wingDown.toDestroyedPart();
        this.wingUp.toDestroyedPart();
        this.hull.toDestroyedPart();
    }


    setAllPartPosition(): void {
        let posX = (this.posX + Math.sin(this.sinX) * 15);
        let posY = (this.posY + Math.cos(this.sinY) * 15);

        this.back.setPosition(posX, posY);
        this.pilot.setPosition(posX, posY);
        this.wingUp.setPosition(posX, posY);
        this.wingDown.setPosition(posX, posY);
        this.hull.setPosition(posX, posY);

        if(this.weapons[0]) this.weapons[0].setPosition(this.hull.normal.x - 75, this.hull.normal.y);
        if(this.weapons[1]) this.weapons[1].setPosition(this.hull.normal.x, this.hull.normal.y - 110);
        if(this.weapons[2]) this.weapons[2].setPosition((this.hull.normal.x), this.hull.normal.y + 110);
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

        this.setAllPartPosition();
    }


}