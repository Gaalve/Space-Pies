import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";
import {PiResolvable} from "./pi-resolvable";
import {PiSymbol} from "./pi-symbol";

export class PiReplication extends PiResolvable{
    public action: PiAction;
    private constructor(system: PiSystem, name: string, inOutPut: string){
        super(system, "PiReplication");
    }

    public static replicationOnIn(system: PiSystem, name: string, input: string): PiReplication{
        return new this(system, name, input);
    }

    public static replicationOnOut(system: PiSystem, name: string, output: string): PiReplication{
        return new this(system, name, output);
    }

    public getSymbolSequence(): string{
        return '!('+ this.action.getSymbolSequence() + ")";
    }

    canResolve(other: PiResolvable): boolean { //TODO
        return false;
    }

    getFullName(): string {
        return this.getSymbolSequence();
    }

    resolve(other: PiResolvable): PiSymbol { //TODO
        return undefined;
    }

    getAllActions(): PiAction[] {
        return [this.action];
    }


}