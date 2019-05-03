import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";

export abstract class PiConcurrent extends PiSymbol{

    symbols: PiSymbol[];

    public constructor(system: PiSystem, actions: PiSymbol[]){
        super(system, "PiSum");
        this.symbols = actions;
    }

    public getFullName(): string {
        return "TODO";
    }
}