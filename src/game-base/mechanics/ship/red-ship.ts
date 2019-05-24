import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";

export class RedShip extends BaseShip{
    toDestroyedShip(): void {
    }

    backUp: ShipPart;
    backDown: ShipPart;
    pilot: ShipPart;
    wingUp: ShipPart;
    wingDown: ShipPart;
    hull: ShipPart;

    public constructor(x: number, y: number){
        super(x, y);

    }
}