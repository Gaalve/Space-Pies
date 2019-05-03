import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";

export abstract class PiResolvable extends PiSymbol{

    protected constructor(system: PiSystem, name: string){
        super(system, name);
    }

    public abstract canResolve(other: PiResolvable): boolean;
    public abstract resolve(other: PiResolvable): PiSymbol;

}