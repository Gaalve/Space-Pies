import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";

export class PiChannelOut extends PiAction{

    public constructor(system: PiSystem, name: string, output: string){
        super(system, name, output, false);
    }

    public getSymbolSequence(): string{
        return this.name + '<' + this.inOutPut + ">" + '.' + this.next.getSymbolSequence();
    }

}