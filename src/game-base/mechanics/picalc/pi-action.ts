import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiProcess} from "./pi-process";

export class PiAction extends PiSymbol{
    protected next: PiSymbol;
    protected inOutPut: string;
    protected isInput: boolean;

    protected constructor(system: PiSystem, name: string, inOutPut: string, isInput: boolean){
        super(system, name.toLowerCase());
        this.inOutPut = inOutPut;
        this.next = new PiProcess(system);
    }

    public getSymbolSequence(): string{
        return this.name + '.' + this.next.getSymbolSequence();
    }


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

    public resolve(argValue: string=""): PiSymbol{
        return this.next;
    }

    public getOutputName(): string{
        return this.inOutPut;
    }
}