import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiScope} from "./pi-scope";

export class PiConcurrent extends PiSymbol{

    symbols: PiSymbol[];

    public constructor(system: PiSystem, actions: PiSymbol[]){
        super(system, "PiConcurrent");
        this.symbols = actions;
    }

    public getSymbolSequenceNonCached(): string{
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
            this.system.pushSymbol(this.symbols[idx]);
    }

    public copy(): PiConcurrent{
        let symbolsCopy = [];
        for (let idx in this.symbols){
            symbolsCopy.push(this.symbols[idx].copy());
        }
        return new PiConcurrent(this.system, symbolsCopy);
    }

    rename(argName: string, argValue: string): void {
        for(let idx in this.symbols){
            this.symbols[idx].rename(argName, argValue);
        }
        this.renewSequence();
    }

    addScope(scope: PiScope): void {
        for(let idx in this.symbols){
            this.symbols[idx].addScope(scope);
        }
    }

    alphaRename(argName: string, argValue: string, scope: PiScope): void {
        for(let idx in this.symbols){
            this.symbols[idx].alphaRename(argName, argValue, scope);
        }
        this.renewSequence();
    }

    isNameInSequence(name: string): boolean {
        for(let idx in this.symbols){
            if (this.symbols[idx].isNameInSequence(name)) return true;
        }
        return false;
    }

    public renewSequence(): void{
        this.symbols.forEach( value => value.renewSequence());
        this.cachedSequence = this.getSymbolSequenceNonCached();
    }
}