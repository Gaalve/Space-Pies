import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";

export class BlueShip extends BaseShip{

    back: ShipPart;
    pilot: ShipPart;
    wingUp: ShipPart;
    wingDown: ShipPart;
    hull: ShipPart;

    public constructor(scene: Phaser.Scene,x: number, y: number){
        super(scene, x, y);

        this.back = new ShipPart(scene, x, y, "ssbr/ssb_back", "ssbr/ssb_des_back",
            -200, 200, -200, 200);

        this.pilot = new ShipPart(scene, x, y, "ssbr/ssb_pilot", "ssbr/ssb_des_pilot",
            200, 0, 200, 0);

        this.wingUp = new ShipPart(scene, x, y, "ssbr/ssb_wing_up", "ssbr/ssb_des_wing_up",
            200, 0, 200, 0);

        this.wingDown = new ShipPart(scene, x, y, "ssbr/ssb_wing_down", "ssbr/ssb_des_wing_down",
            200, 0, 200, 0);

        this.hull = new ShipPart(scene, x, y, "ssbr/ssb_hull", "ssbr/ssb_des_hull",
            0, 0, 200, 0);
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
        this.back.setPosition(this.posX, this.posY);
        this.pilot.setPosition(this.posX, this.posY);
        this.wingUp.setPosition(this.posX, this.posY);
        this.wingDown.setPosition(this.posX, this.posY);
        this.hull.setPosition(this.posX, this.posY);
    }

}