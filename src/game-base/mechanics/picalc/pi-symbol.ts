import {PiSystem} from "./pi-system";

export abstract class PiSymbol {
    protected system: PiSystem;
    protected name: string;
    protected constructor(system: PiSystem, name: string){
        this.system = system;
        this.name = name;
    }

    public abstract getFullName(): string;

    public getName(): string{
        return this.name;
    }

    public getSymbolSequence(): string{
        return this.name;
    }

    public trigger(): void{
        // Should only be used by pi-process
    }

    public rename(argName: string, argValue: string){
        // should only be used by pi-action
    }

    public abstract copy(): PiSymbol;
}