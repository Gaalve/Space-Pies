import {PiSymbol} from "./pi-symbol";
import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";


export class PiSum extends PiSymbol{

    actions: PiAction[];

    public constructor(system: PiSystem, actions: PiAction[]){
        super(system, "PiSum");
        this.actions = actions;
    }

    public getSymbolSequence(): string{
        let str = "(";
        let idx: number;
        for(idx = 0; idx < this.actions.length - 1; ++idx){
            str += this.actions[idx].getSymbolSequence();
            str += " + ";
        }
        str += this.actions[idx].getSymbolSequence();
        return str + ")";
    }

    public getFullName(): string {
        return this.getSymbolSequence();
    }
}