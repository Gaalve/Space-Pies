import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiProcess} from "./pi-process";
import {PiResolvable} from "./pi-resolvable";

export abstract class PiAction extends PiResolvable{
    protected next: PiSymbol;
    protected inOutPut: string;
    protected isInput: boolean;

    protected constructor(system: PiSystem, name: string, inOutPut: string, isInput: boolean){
        super(system, name.toLowerCase());
        this.inOutPut = inOutPut;
        this.next = new PiProcess(system);
        this.isInput = isInput;
    }


    public abstract getSymbolSequence(): string;


    public setNextSymbol(symbol: PiSymbol): void{
        this.next = symbol;
    }

    /**
     * Renames the channel name and/or output name to argValue, if they equal argName.
     * Forwards parameters to next symbol.
     * @param argName the name that received the name (argValue)
     * @param argValue the bound name
     *
     * Recap: only free names can be bound, see ./src/game-base/docs/Pi-Kalkül-Doc.pdf, Section: Freie und Gebundene Namen.
     */
    public rename(argName: string, argValue: string){
        //Todo Scope is missing
        if(this.name == argName){
            this.name = argValue;
        }
        if(!this.isInput && this.inOutPut == argName){
            this.inOutPut = argValue;
        }
        this.next.rename(argName, argValue);
    }

    public abstract canResolve(other: PiAction): boolean;

    public abstract resolve(other: PiAction): PiSymbol;

    public getOutputName(): string{
        return this.inOutPut;
    }

    public abstract copy(): PiAction;
}