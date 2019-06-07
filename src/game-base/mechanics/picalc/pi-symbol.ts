import {PiSystem} from "./pi-system";
import {PiScope} from "./pi-scope";

export abstract class PiSymbol {
    protected system: PiSystem;
    protected name: string;
    protected scopes: PiScope[];
    protected cachedSequence: string;

    protected constructor(system: PiSystem, name: string){
        this.system = system;
        this.name = name;
        this.scopes = [];
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
     *
     * Must not be overwritten
     * E.g.: x(a).z(b).P
     */
    public getSymbolSequence(): string{
        return this.cachedSequence;
    }

    /**
     * Returns the complete sequence of symbols that may follow after this symbol.
     * E.g.: x(a).z(b).P
     */
    public getSymbolSequenceNonCached(): string{
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
     * Should only be called by Pi-Symbols!
     *
     * Binds the transferred name (argValue) to the free name (argName).
     * E.g. x<a> | x(q) => argName:= q, argValue:= a
     * @param argName
     * @param argValue
     */
    public abstract rename(argName: string, argValue: string): void;

    public abstract alphaRename(argName: string, argValue: string, scope: PiScope): void;
    /**
     * Creates a deep copy of this symbol (except for Pi-Term).
     */
    public abstract copy(): PiSymbol;

    public abstract addScope(scope: PiScope): void;


    /**
     * Renews the cached symbol sequence. Should be called on copy, rename, alphaRename
     * and must not be overwritten. Is used to reduce recursions in case renewSequence is overloaded,
     */
    public renewSymbol(): void{
        this.cachedSequence = this.getSymbolSequenceNonCached();
    }

    /**
     * Renews the cached symbol sequence. Should be called on push (sys)
     */
    public renewSequence(): void{
        this.cachedSequence = this.getSymbolSequenceNonCached();
    }



    /**
     * Searches the name in the symbol sequence and returns true if the name was found.
     * Will be used by Pi-Term to determine if renaming of term itself is necessary
     * (e.g. T instead of T[x/y], if y is not contained within the sequence)
     * @param name - the name to search for
     * @return returns true if the given name is in the sequence.
     */
    public abstract isNameInSequence(name: string): boolean;
}