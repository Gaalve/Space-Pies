import {PiSystem} from "./pi-system";

export abstract class PiSymbol {
    protected system: PiSystem;
    protected name: string;
    protected constructor(system: PiSystem, name: string){
        this.system = system;
        this.name = name;
    }

    /**
     * Return a custom representation of this symbol that should make its use clear!
     * E.g.: x(a).getName() => x, but x(a).getFullName() => x(a)
     */
    public abstract getFullName(): string;


    /**
     * Returns the name of this symbol.
     * E.g.: x(a) => x
     */
    public getName(): string{
        return this.name;
    }


    /**
     * Returns the complete sequence of symbols that may follow after this symbol.
     * E.g.: x(a).z(b).P
     */
    public getSymbolSequence(): string{
        return this.name;
    }

    /**
     * Should only be called by Pi-System!
     *
     * Gets called from PiSystem.phaseTriggerSymbols
     * and triggers the action of the symbol (e.g. a PiProcess will call the specified callback)
     */
    public trigger(): void{
        // Default: Do nothing
    }

    /**
     * Should only be called by Pi-Channel-In!
     *
     * Binds the transferred name (argValue) to the free name (argName).
     * E.g. x<a> | x(q) => argName:= q, argValue:= a
     * @param argName
     * @param argValue
     */
    public rename(argName: string, argValue: string){
        // Default: Do nothing! TODO: should probably be overwritten by all symbols
    }

    /**
     * Creates a deep copy of this symbol (except for Pi-Term).
     */
    public abstract copy(): PiSymbol;
}