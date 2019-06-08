import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiScope} from "./pi-scope";

export class PiTerm extends PiSymbol{
    public symbol: PiSymbol;
    private renames: [string, string][];
    private alphaRenames: [string, string, PiScope][];

    public constructor(system: PiSystem, name: string, symbol: PiSymbol){
        super(system, name.toUpperCase());
        this.symbol = symbol;
        this.renames = [];
        this.alphaRenames = [];
    }

    copy(): PiTerm { // no deep copy in case of recursions!
        return new PiTerm(this.system, this.name, this.symbol);
    }

    public getTermContentSymbolSequence(): string {
        return this.getName() + ":= " + this.symbol.getSymbolSequence();
    }

    getSymbolSequence(): string {
        return this.getName();
    }

    getFullName(): string {
        return this.getName();
    }

    trigger(): void {
        let copy = this.symbol.copy();
        for(let idx in this.renames){
            copy.rename(this.renames[idx][0],this.renames[idx][1]);
        }
        this.system.pushSymbol(copy);
    }

    addScope(scope: PiScope): void {
        this.symbol.addScope(scope);
    }

    rename(argName: string, argValue: string): void {
        this.renames.push([argName, argValue]);
        if(this.symbol.isNameInSequence(argName))
            this.name += '['+argValue+'/'+argName+']';
    }

    alphaRename(argName: string, argValue: string, scope: PiScope): void {
        this.alphaRenames.push([argName, argValue, scope]);
        if(this.symbol.isNameInSequence(argName))
            this.name += '['+argValue+'/'+argName+']';
    }

    isNameInSequence(name: string): boolean {
        return false;
    }
}