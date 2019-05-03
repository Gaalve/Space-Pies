import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
import {PiResolvable} from "./pi-resolvable";
import {PiChannelOut} from "./pi-channel-out";

export class PiChannelIn extends PiAction{

    public constructor(system: PiSystem, name: string, input: string){
        super(system, name, input, true);
    }



    public getFullName(): string {
        return this.name+"("+this.inOutPut+")";
    }

    public getSymbolSequence(): string{
        return this.getFullName() + '.' + this.next.getSymbolSequence();
    }

    public resolve(other: PiResolvable) {
        if(!this.canResolve(other)){
            console.log("Error: resolved channel with wrong symbol")
        }
        else {
            let argValue = (<PiChannelOut>other).getOutputName();
            this.next.rename(this.inOutPut, argValue);
        }
        return this.next;
    }

    canResolve(other: PiResolvable): boolean {
        return other instanceof PiChannelOut && other.getName() == this.getName();
    }
}