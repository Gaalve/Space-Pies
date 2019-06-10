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
import {PiScope} from "./pi-scope";

export  class PiSystemAdd{
    private readonly system: PiSystem;

    constructor(system: PiSystem){
        this.system = system;
    }

    public channelIn(name: string, input: string, attachment?: any, resolvingChance: number = 1): PiSystemAddAction{
        let chan = new PiChannelIn(this.system, name, input);
        chan.attachment = attachment;
        chan.resolvingChance = resolvingChance;
        return new PiSystemAddAction(this.system, chan)
    }

    public channelOut(name: string, output: string, attachment?: any, resolvingChance: number = 1): PiSystemAddAction{
        let chan = new PiChannelOut(this.system, name, output);
        chan.attachment = attachment;
        chan.resolvingChance = resolvingChance;
        return new PiSystemAddAction(this.system, chan);
    }

    public channelInCB(name: string, input: string,
                       callback: (resolvedName?: string, attachmentOfResolved?: any) => any, attachment?: any,
                       resolvingChance: number = 1): PiSystemAddAction{
        let pi = new PiChannelIn(this.system, name, input);
        pi.setCallback(callback);
        pi.attachment = attachment;
        pi.resolvingChance = resolvingChance;
        return new PiSystemAddAction(this.system, pi)
    }

    public channelOutCB(name: string, output: string,
                        callback: (resolvedName?: string, attachmentOfResolved?: any) => any, attachment?: any,
                        resolvingChance: number = 1): PiSystemAddAction{
        let pi = new PiChannelOut(this.system, name, output);
        pi.setCallback(callback);
        pi.attachment = attachment;
        pi.resolvingChance = resolvingChance;
        return new PiSystemAddAction(this.system, pi)
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

    public scope(scopedName: string, symbol: PiSymbol): PiSymbol{
        return new PiScope(this.system, scopedName, symbol, false);
    }

}