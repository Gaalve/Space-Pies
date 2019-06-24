import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";
import Sprite = Phaser.GameObjects.Sprite;
import {Infobox} from "../Infobox";

export class BlueShip extends BaseShip{

    back: ShipPart;
    pilot: ShipPart;
    wingUp: ShipPart;
    wingDown: ShipPart;
    hull: ShipPart;
    private x: number;
    private y: number;
    private durationX: number;
    private durationY: number;
    private currentTimeX: number;
    private currentTimeY: number;
    private sinX: number;
    private sinY: number;

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
        this.durationX = 500;
        this.durationY = 1000;
        this.sinX = 0;
        this.sinY = 0;
        this.setAllPartPosition();
        // this.toDestroyedShip();
    }


    toDestroyedShip(): void {
        this.back.toDestroyedPart();
        this.pilot.toDestroyedPart();
        this.wingDown.toDestroyedPart();
        this.wingUp.toDestroyedPart();
        this.hull.toDestroyedPart();
    }

    setAllPartPosition(): void {
        let posX = this.posX + Math.sin(this.sinX) * 25;
        let posY = this.posY + Math.cos(this.sinY) * 25;

        this.back.setPosition(posX, posY);
        this.pilot.setPosition(posX, posY);
        this.wingUp.setPosition(posX, posY);
        this.wingDown.setPosition(posX, posY);
        this.hull.setPosition(posX, posY);
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

    update(delta: number): void {
        this.back.update(delta);
        this.pilot.update(delta);
        this.hull.update(delta);
        this.wingUp.update(delta);
        this.wingDown.update(delta);
    }

}