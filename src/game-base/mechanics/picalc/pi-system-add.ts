import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiProcess} from "./pi-process";
import {PiSystem} from "./pi-system";
import {PiSystemAddAction} from "./pi-system-add-action";

export  class PiSystemAdd{
    private readonly system: PiSystem;

    constructor(system: PiSystem){
        this.system = system;
    }

    public channelIn(name: string, input: string): PiSystemAddAction{
        return new PiSystemAddAction(this.system, new PiChannelIn(this.system, name, input))
    }

    public channelOut(name: string, output: string): PiSystemAddAction{
        return new PiSystemAddAction(this.system, new PiChannelOut(this.system, name, output))
    }

    public process(name: string, callback: Function): void{
        this.system.addSymbol(new PiProcess(this.system, name, callback));
    }

}