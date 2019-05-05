import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";

export abstract class PiResolvable extends PiSymbol{

    protected constructor(system: PiSystem, name: string){
        super(system, name);
    }

    public abstract getAllActions(): PiAction[];

    public abstract copy(): PiResolvable;
}