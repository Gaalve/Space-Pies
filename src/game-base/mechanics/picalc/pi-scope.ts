import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";

export class PiScope extends PiSymbol{
    public readonly scopedName: string; // original scoped name
    public readonly reservedName: string;  // reserved new name
    extendedScope: boolean;

    symbolStart : PiSymbol;
    symbols: PiSymbol[];
    symbolEnd: PiSymbol;

    constructor(system: PiSystem, scopedName: string, symbol: PiSymbol, ignoreLast: boolean){
        super(system, "(v "+scopedName+")");
        this.system = system;
        let curSymbol = symbol;
        this.symbolStart = symbol;
        let previous;
        if(!ignoreLast) {
            this.symbols = [curSymbol];
            while (curSymbol instanceof PiAction) {
                curSymbol = curSymbol._getNext();
                this.symbols.push(curSymbol);
            }
            previous = curSymbol;
        }
        else {
            this.symbols = [];
            while (curSymbol instanceof PiAction) {
                this.symbols.push(curSymbol);
                previous = curSymbol;
                curSymbol = curSymbol._getNext();
            }
        }
        this.symbolEnd = previous;
        this.scopedName = scopedName;
        this.reservedName = this.system.newReservedName(this.scopedName);
        this.extendedScope = false;
        this.setScopes()
    }

    private setScopes(): void{
        for(let idx in this.symbols){
            this.symbols[idx].addScope(this);
        }
    }

    public getLastSymbol(): PiSymbol{
        if(this.extendedScope) return undefined;
        return this.symbols[this.symbols.length - 1];
    }

    copy(): PiSymbol { //TODO
        // return undefined;
        return new PiScope(this.system, this.scopedName, this.symbolStart.copy(), false);
    }

    getSymbolSequence(): string {
        if(this.extendedScope) return this.reservedName;
        if(this.symbolStart instanceof PiScope){
            return this.getName()+".("+this.symbols[0].getSymbolSequence()+')';
        }
        let seq = this.getName()+".("+this.symbols[0].getFullName();
        for (let idx = 1; idx < this.symbols.length; ++idx){
            seq += '.';
            seq += this.symbols[idx].getFullName();
        }
        if(this.symbolEnd instanceof PiAction){
            seq += this.symbolEnd._getNext().getSymbolSequence();
        }
        // else if(this.symbolEnd instanceof PiScope){
        //     seq += this.symbolEnd.getSymbolSequence();
        // }
        return seq;
    }

    getFullName(): string {
        return this.getName();
    }

    public contains(symbol: PiSymbol): boolean{
        return this.symbols.indexOf(symbol) > -1;
    }

    public alphaRename(argName: string, argValue: string, scope: PiScope): void{
        this.symbolStart.alphaRename(argName, argValue, scope);
    }
    public addScope(scope: PiScope): void{
        for(let idx in this.symbols){
            this.symbols[idx].addScope(scope);
        }
    }

    public rename(argName: string, argValue: string): void {
        this.symbolStart.rename(argName, argValue);
    }


    public trigger(): void {
        this.extendedScope = true;
        for(let idx in this.symbols){
            this.symbols[idx].alphaRename(this.scopedName, this.reservedName, this);
        }
        this.system.pushSymbol(this.symbolStart);
    }
}