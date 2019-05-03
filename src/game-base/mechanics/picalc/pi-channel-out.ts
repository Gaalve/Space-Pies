import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";

export class PiChannelOut extends PiAction{

    public constructor(system: PiSystem, name: string){
        super(system, name);
    }

}