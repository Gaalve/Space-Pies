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

    constructor(system: PiSystem, scopedName: string, symbol: PiSymbol){
        super(system, "(v "+scopedName+")");
        this.system = system;
        let curSymbol = symbol;
        this.symbols = [curSymbol];
        this.symbolStart = symbol;
        while (curSymbol instanceof  PiAction){
            curSymbol = curSymbol._getNext();
            this.symbols.push(curSymbol);
        }
        this.symbolEnd = curSymbol;
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
        return undefined;
    }

    getSymbolSequence(): string {
        if(this.extendedScope) return this.reservedName;
        let seq = this.getName()+".("+this.symbols[0].getFullName();
        for (let idx = 1; idx < this.symbols.length; ++idx){
            seq += '.';
            seq += this.symbols[idx].getFullName();
        }
        if(this.symbolEnd instanceof PiAction){
            seq += this.symbolEnd._getNext().getSymbolSequence();
        }
        return seq;
    }

    getFullName(): string {
        return this.getName();
    }

    public contains(symbol: PiSymbol): boolean{
        return this.symbols.indexOf(symbol) > -1;
    }

    public scopedRename(argName: string, argValue: string, scope: PiScope): void{
        //TODO
    }
    public alphaRename(argName: string, argValue: string, scope: PiScope): void{
        //TODO
    }
    public addScope(scope: PiScope): void{
        //TODO
    }
}