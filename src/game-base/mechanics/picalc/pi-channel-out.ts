import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
import {PiResolvable} from "./pi-resolvable";
import {PiChannelIn} from "./pi-channel-in";

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

    public resolve(other: PiResolvable) {
        if(!this.canResolve(other)){
            console.log("Error: resolved channel with wrong symbol")
        }
        return this.next;
    }

    canResolve(other: PiResolvable): boolean {
        return other instanceof PiChannelIn && other.getName() == this.getName();
    }
}