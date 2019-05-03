import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";

export class PiProcess extends PiSymbol{
    private callback: Function;

    public constructor(system: PiSystem, name: string = '0', callback: Function = ()=>{}){
        super(system, name.toUpperCase());
        this.callback = callback;
    }

    public trigger(): void {
        this.callback();
    }
}