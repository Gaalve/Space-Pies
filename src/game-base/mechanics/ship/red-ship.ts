import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";

export class RedShip extends BaseShip{
    get backUp(): ShipPart
    {
        return this._backUp;
    }

    set backUp(value: ShipPart)
    {
        this._backUp = value;
    }

    get backDown(): ShipPart
    {
        return this._backDown;
    }

    set backDown(value: ShipPart)
    {
        this._backDown = value;
    }

    get pilot(): ShipPart
    {
        return this._pilot;
    }

    set pilot(value: ShipPart)
    {
        this._pilot = value;
    }

    get wingUp(): ShipPart
    {
        return this._wingUp;
    }

    set wingUp(value: ShipPart)
    {
        this._wingUp = value;
    }

    get wingDown(): ShipPart
    {
        return this._wingDown;
    }

    set wingDown(value: ShipPart)
    {
        this._wingDown = value;
    }

    get hull(): ShipPart
    {
        return this._hull;
    }

    set hull(value: ShipPart)
    {
        this._hull = value;
    }
    private _backUp: ShipPart;
    private _backDown: ShipPart;
    private _pilot: ShipPart;
    private _wingUp: ShipPart;
    private _wingDown: ShipPart;
    private _hull: ShipPart;

    public constructor(scene: Phaser.Scene,x: number, y: number){
        super(scene, x, y);
        this._backUp = new ShipPart(scene, x, y, "ssbr/ssr_back_up", "ssbr/ssr_des_back_up",
            -60, -85, -61, -103,1);

        this._backDown = new ShipPart(scene, x, y, "ssbr/ssr_back_down", "ssbr/ssr_des_back_down",
            -60, 85, -68, 72,1);

        this._pilot = new ShipPart(scene, x, y, "ssbr/ssr_pilot", "ssbr/ssr_des_pilot",
            141, 0, 133, -2,1);

        this._wingUp = new ShipPart(scene, x, y, "ssbr/ssr_wing_up", "ssbr/ssr_des_wing_up_2",
            59, -151, 58, -76,1);

        this._wingDown = new ShipPart(scene, x, y, "ssbr/ssr_wing_down", "ssbr/ssr_des_wing_down",
            59, 151, 51, 98,1);

        this._hull = new ShipPart(scene, x, y, "ssbr/ssr_hull", "ssbr/ssr_des_hull",
            11, 0, 55, 15,2);
        this.setAllPartPosition();
        // this.toDestroyedShip();
    }


    toDestroyedShip(): void {
        this._backDown.toDestroyedPart();
        this._backUp.toDestroyedPart();
        this._pilot.toDestroyedPart();
        this._wingDown.toDestroyedPart();
        this._wingUp.toDestroyedPart();
        this._hull.toDestroyedPart();
    }

    setAllPartPosition(): void {
        this._backUp.setPosition(this.posX, this.posY);
        this._backDown.setPosition(this.posX, this.posY);
        this._pilot.setPosition(this.posX, this.posY);
        this._wingUp.setPosition(this.posX, this.posY);
        this._wingDown.setPosition(this.posX, this.posY);
        this._hull.setPosition(this.posX, this.posY);
    }

    toDestroyedBack(): void {
        this._backDown.toDestroyedPart();
        this._backUp.toDestroyedPart();
    }

    toDestroyedHull(): void {
        this._hull.toDestroyedPart();
    }

    toDestroyedPilot(): void {
        this._pilot.toDestroyedPart();
    }

    toDestroyedWingDown(): void {
        this._wingDown.toDestroyedPart();
    }

    toDestroyedWingUp(): void {
        this._wingUp.toDestroyedPart();
    }

    update(delta: number): void {
        this._backUp.update(delta);
        this._backDown.update(delta);
        this._pilot.update(delta);
        this._hull.update(delta);
        this._wingUp.update(delta);
        this._wingDown.update(delta);
    }
}