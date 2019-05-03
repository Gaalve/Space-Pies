import {PiSystem} from "./pi-system";
import {PiProcess} from "./pi-process";
import {PiAction} from "./pi-action";

export class PiChannelIn extends PiAction{

    public constructor(system: PiSystem, name: string){
        super(system, name);
        this.name = name;
        this.next = new PiProcess(system);
    }






}