import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";

export class PiTerm extends PiSymbol{

    public symbol: PiSymbol;

    public constructor(system: PiSystem, name: string, symbol: PiSymbol){
        super(system, name.toUpperCase());
        this.symbol = symbol;
    }

    copy(): PiTerm { // no deep copy in case of recursions!
        return this;
    }

    getSymbolSequence(): string {
        return this.getName() + ":= " + this.symbol.getSymbolSequence();
    }

    getFullName(): string {
        return this.getName();
    }

    trigger(): void {
        this.system.addSymbol(this.symbol);
    }

}