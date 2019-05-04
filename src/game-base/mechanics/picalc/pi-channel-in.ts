import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
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

    canResolve(other: PiAction): boolean {
        return other instanceof  PiChannelOut && other.getName() == this.getName()
    }

    public resolve(other: PiAction) {
        if(!this.canResolve(other)){
            throw new Error("Error: resolved channel with wrong action! This: "+this.getFullName()+" other: "+other.getFullName())
        }
        else {
            let argValue = (<PiChannelOut>other).getOutputName();
            this.next.rename(this.inOutPut, argValue);
        }
        return this.next;
    }

    getAllActions(): PiAction[] {
        return [this];
    }




}