import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";

export class RedShip extends BaseShip{
    backUp: ShipPart;
    backDown: ShipPart;
    pilot: ShipPart;
    wingUp: ShipPart;
    wingDown: ShipPart;
    hull: ShipPart;

    public constructor(scene: Phaser.Scene,x: number, y: number){
        super(scene, x, y);
        this.backUp = new ShipPart(scene, x, y, "ssbr/ssr_back_up", "ssbr/ssr_des_back_up",
            -60, -85, -61, -103);

        this.backDown = new ShipPart(scene, x, y, "ssbr/ssr_back_down", "ssbr/ssr_des_back_down",
            -60, 85, -68, 72);

        this.pilot = new ShipPart(scene, x, y, "ssbr/ssr_pilot", "ssbr/ssr_des_pilot",
            141, 0, 133, -2);

        this.wingUp = new ShipPart(scene, x, y, "ssbr/ssr_wing_up", "ssbr/ssr_des_wing_up_2",
            59, -151, 58, -76);

        this.wingDown = new ShipPart(scene, x, y, "ssbr/ssr_wing_down", "ssbr/ssr_des_wing_down",
            59, 151, 51, 98);

        this.hull = new ShipPart(scene, x, y, "ssbr/ssr_hull", "ssbr/ssr_des_hull",
            11, 0, 55, 15);
        this.setAllPartPosition();
        // this.toDestroyedShip();
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
        this.backUp.setPosition(this.posX, this.posY);
        this.backDown.setPosition(this.posX, this.posY);
        this.pilot.setPosition(this.posX, this.posY);
        this.wingUp.setPosition(this.posX, this.posY);
        this.wingDown.setPosition(this.posX, this.posY);
        this.hull.setPosition(this.posX, this.posY);
    }

}