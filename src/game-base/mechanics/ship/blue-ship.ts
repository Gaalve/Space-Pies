import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";

export class BlueShip extends BaseShip{

    back: ShipPart;
    pilot: ShipPart;
    wingUp: ShipPart;
    wingDown: ShipPart;
    hull: ShipPart;

    public constructor(x: number, y: number){
        super(x, y);

    }

    toDestroyedShip(): void {
    }

}