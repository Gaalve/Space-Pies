import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
import {PiResolvable} from "./pi-resolvable";
import {PiChannelOut} from "./pi-channel-out";
import {PiSum} from "./pi-sum";

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

    private canResolveChannelOut(other: PiChannelOut): boolean{
        return other.getName() == this.getName();
    }

    private canResolvePiSum(other: PiSum): boolean{
        let resolvables: PiResolvable[] = other.getResolvables();
        for (let idx in resolvables){
            if(this.canResolve(resolvables[idx])) return true;
        }
        return false;
    }

    canResolve(other: PiResolvable): boolean {
        if(other instanceof PiChannelOut) return this.canResolveChannelOut(other);
        else if(other instanceof PiSum) return this.canResolvePiSum(other);
        return false;
    }


}