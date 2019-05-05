import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiScope} from "./pi-scope";

export class PiTerm extends PiSymbol{

    public symbol: PiSymbol;

    public constructor(system: PiSystem, name: string, symbol: PiSymbol){
        super(system, name.toUpperCase());
        this.symbol = symbol;
    }

    copy(): PiTerm { // no deep copy in case of recursions!
        return this;
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
        this.system.pushSymbol(this.symbol.copy());
    }

    addScope(scope: PiScope): void {
        //TODO
    }

    alphaRename(argName: string, argValue: string, scope: PiScope): void {
        //TODO
    }

    scopedRename(argName: string, argValue: string, scope: PiScope): void {
        //TODO
    }

}