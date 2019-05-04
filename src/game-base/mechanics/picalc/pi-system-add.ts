import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiProcess} from "./pi-process";
import {PiSystem} from "./pi-system";
import {PiSystemAddAction} from "./pi-system-add-action";
import {PiAction} from "./pi-action";
import {PiSum} from "./pi-sum";
import {PiSymbol} from "./pi-symbol";
import {PiConcurrent} from "./pi-concurrent";
import {PiReplication} from "./pi-replication";

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

    public process(name: string, callback: Function): PiSymbol{
        return new PiProcess(this.system, name, callback);
    }

    public sum(actions: PiAction[]): PiSymbol{
        return new PiSum(this.system, actions);
    }

    public concurrent(symbols: PiSymbol[]): PiSymbol{
        return new PiConcurrent(this.system, symbols);
    }

    public replication(action: PiAction): PiSymbol{
        return new PiReplication(this.system, action);
    }
}