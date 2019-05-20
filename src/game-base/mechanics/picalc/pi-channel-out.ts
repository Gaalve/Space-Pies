import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
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


    canResolve(other: PiAction): boolean {
        return other instanceof  PiChannelIn && other.getName() == this.getName()
    }


    public resolve(other: PiAction) {
        if(!this.canResolve(other)){
            throw new Error("Error: resolved channel with wrong action! This: "+this.getFullName()+" other: "+other.getFullName())
        }
        return this.next;
    }

    getAllActions(): PiAction[] {
        return [this];
    }

    public copy(): PiChannelOut{
        let nextCopy = this.next.copy();
        let thisCopy = new PiChannelOut(this.system, this.name, this.inOutPut);
        thisCopy.next = nextCopy;
        thisCopy.setCallback(this.callback);
        return thisCopy;
    }
}