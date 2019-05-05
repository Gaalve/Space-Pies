import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";
import {PiResolvable} from "./pi-resolvable";

export class PiReplication extends PiResolvable{
    public readonly action: PiAction;
    public constructor(system: PiSystem, action: PiAction){
        super(system, "PiReplication");
        this.action = action;
    }

    public getSymbolSequence(): string{
        return '!('+ this.action.getSymbolSequence() + ")";
    }

    getFullName(): string {
        return this.getSymbolSequence();
    }

    getAllActions(): PiAction[] {
        return [this.action];
    }

    trigger(): void {
        this.system.addSymbol(this.copy());
    }

    public copy(): PiReplication{
        return new PiReplication(this.system, this.action.copy());
    }

}