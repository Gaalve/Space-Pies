import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";

export class PiConcurrent extends PiSymbol{

    symbols: PiSymbol[];

    public constructor(system: PiSystem, actions: PiSymbol[]){
        super(system, "PiConcurrent");
        this.symbols = actions;
    }

    public getSymbolSequence(): string{
        let str = "(";
        let idx: number;
        for(idx = 0; idx < this.symbols.length - 1; ++idx){
            str += this.symbols[idx].getSymbolSequence();
            str += " | ";
        }
        str += this.symbols[idx].getSymbolSequence();
        return str + ")";
    }

    public getFullName(): string {
        return this.getSymbolSequence();
    }

    public trigger(): void {
        for(let idx in this.symbols)
            this.system.addSymbol(this.symbols[idx]);
    }

    public copy(): PiConcurrent{
        let symbolsCopy = [];
        for (let idx in this.symbols){
            symbolsCopy.push(this.symbols[idx].copy());
        }
        return new PiConcurrent(this.system, symbolsCopy);
    }
}