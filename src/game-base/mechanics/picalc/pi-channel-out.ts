import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";

export class PiChannelOut extends PiAction{

    public constructor(system: PiSystem, name: string, output: string){
        super(system, name, output, false);
    }

    public getOutputName(): string{
        return this.inOutPut;
    }

    public getFullName(): string {
        return this.name+"<"+this.inOutPut+">";
    }

    public getSymbolSequence(): string{
        return this.getFullName() + '.' + this.next.getSymbolSequence();
    }
}