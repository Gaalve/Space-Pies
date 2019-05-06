import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";
import {PiResolvable} from "./pi-resolvable";
import {PiScope} from "./pi-scope";

export class PiReplication extends PiResolvable{
    public action: PiAction;
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
        this.action = this.action.copy();
    }

    public copy(): PiReplication{
        return new PiReplication(this.system, this.action.copy());
    }

    addScope(scope: PiScope): void {
        this.action.addScope(scope);
    }

    rename(argName: string, argValue: string): void {
        this.action.rename(argName, argValue);
    }

    alphaRename(argName: string, argValue: string, scope: PiScope): void {
        this.action.alphaRename(argName, argValue, scope);
    }

    public getAction(fullName: string): PiAction {
        if(this.action.getFullName() == fullName) return this.action;
        throw new Error("Can't find action.");
        // return this.action.getAction(fullName);
    }

}