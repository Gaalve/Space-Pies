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
import {PiTerm} from "./pi-term";

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

    public process(name: string, callback: Function): PiProcess{
        return new PiProcess(this.system, name, callback);
    }

    public sum(actions: PiAction[]): PiSum{
        return new PiSum(this.system, actions);
    }

    public concurrent(symbols: PiSymbol[]): PiConcurrent{
        return new PiConcurrent(this.system, symbols);
    }

    public replication(action: PiAction): PiReplication{
        return new PiReplication(this.system, action);
    }

    public term(name: string, symbol: PiSymbol): PiTerm{
        return new PiTerm(this.system, name, symbol);
    }
}