import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
import {PiResolvable} from "./pi-resolvable";
import {PiChannelIn} from "./pi-channel-in";
import {PiSum} from "./pi-sum";

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

    private canResolveChannelIn(other: PiChannelIn): boolean{
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
        if(other instanceof PiChannelIn) return this.canResolveChannelIn(other);
        else if(other instanceof PiSum) return this.canResolvePiSum(other);
        return false;
    }
}