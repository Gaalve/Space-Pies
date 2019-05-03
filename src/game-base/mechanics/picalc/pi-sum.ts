import {PiSymbol} from "./pi-symbol";
import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";


export class PiSum extends PiSymbol{

    actions: PiAction[];

    public constructor(system: PiSystem, actions: PiAction[]){
        super(system, "PiSum");
        this.actions = actions;
    }

    public getFullName(): string {
        return "TODO";
    }
}