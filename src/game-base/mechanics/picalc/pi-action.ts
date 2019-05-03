import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";

export class PiAction extends PiSymbol{
    protected next: PiSymbol;
    protected constructor(system: PiSystem, name: string){
        super(system, name.toLowerCase());
    }

    public getSymbolSequence(): string{
        return this.name + '.' + this.next.getSymbolSequence();
    }

    public setName(name: string): void{
        //TODO change Scope
        this.name = name;
    }

    public nextSymbol(symbol: PiSymbol): void{
        this.next = symbol;
    }
}