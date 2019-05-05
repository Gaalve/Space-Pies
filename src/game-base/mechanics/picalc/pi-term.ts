import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiScope} from "./pi-scope";

export class PiTerm extends PiSymbol{

    public symbol: PiSymbol;

    private renames: [string, string][];

    public constructor(system: PiSystem, name: string, symbol: PiSymbol){
        super(system, name.toUpperCase());
        this.symbol = symbol;
        this.renames = [];
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
        //TODO
        this.symbol.addScope(scope);
    }

    rename(argName: string, argValue: string): void {
        super.rename(argName, argValue);
        this.renames.push([argName, argValue]);
        this.name += '['+argValue+'/'+argName+']';
    }

    alphaRename(argName: string, argValue: string, scope: PiScope): void {
        //TODO
        // this.alphaRenames.push([argName, argValue, scope]);
        // this.name += '['+argValue+'/'+argName+']';
    }

    scopedRename(argName: string, argValue: string, scope: PiScope): void {
        //TODO
    }

}