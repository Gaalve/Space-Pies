import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
import {PiChannelOut} from "./pi-channel-out";

export class PiChannelIn extends PiAction{

    private resolvedName;

    public constructor(system: PiSystem, name: string, input: string){
        super(system, name, input, true);
        this.resolvedName = 'None';
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
        let argValue = (<PiChannelOut>other).getOutputName();
        this.next.rename(this.inOutPut, argValue);
        this.resolvedName = argValue;
        this.attachmentOfResolved = other.attachment;
        return this.next;
    }

    getAllActions(): PiAction[] {
        return [this];
    }

    public copy(): PiChannelIn{
        let nextCopy = this.next.copy();
        let thisCopy = new PiChannelIn(this.system, this.name, this.inOutPut);
        thisCopy.next = nextCopy;
        thisCopy.setCallback(this.callback);
        thisCopy.attachment = this.attachment;
        thisCopy.resolvingChance = this.resolvingChance;
        return thisCopy;
    }

    public trigger(): void {
        this.callback(this.resolvedName, this.attachmentOfResolved);
    }

}