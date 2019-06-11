import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiScope} from "./pi-scope";

export class PiProcess extends PiSymbol{
    private readonly callback: (passedValues: [string, string][])=>any;
    private renames: [string, string][];

    public constructor(system: PiSystem, name: string = '0', callback: (passedValues: [string, string][])=>any = ()=>{}){
        super(system, name.toUpperCase());
        this.callback = callback;
    }

    public trigger(): void {
        this.callback(this.renames);
    }

    public getFullName(): string {
        return this.getName();
    }

    public copy(): PiProcess{
        return new PiProcess(this.system, this.name, this.callback);
    }

    addScope(scope: PiScope): void {
        //TODO
    }

    alphaRename(argName: string, argValue: string, scope: PiScope): void {
        //TODO
    }

    rename(argName: string, argValue: string): void {
        this.renames.push([argName, argValue]);
    }

    isNameInSequence(name: string): boolean {
        return false;
    }
}