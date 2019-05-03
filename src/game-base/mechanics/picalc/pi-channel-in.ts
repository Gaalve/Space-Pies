import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";

export class PiChannelIn extends PiAction{

    public constructor(system: PiSystem, name: string, input: string){
        super(system, name, input, true);
    }

    public resolve(argValue: string) {
        this.next.rename(this.inOutPut, argValue);
        return super.resolve(argValue);
    }

    public getFullName(): string {
        return this.name+"("+this.inOutPut+")";
    }

    public getSymbolSequence(): string{
        return this.getFullName() + '.' + this.next.getSymbolSequence();
    }
}