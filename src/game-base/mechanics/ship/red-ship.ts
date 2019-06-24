import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";
import {Infobox} from "../Infobox";

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

    update(delta: number): void {
        this.backUp.update(delta);
        this.backDown.update(delta);
        this.pilot.update(delta);
        this.hull.update(delta);
        this.wingUp.update(delta);
        this.wingDown.update(delta);
    }
}