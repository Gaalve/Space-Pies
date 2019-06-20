import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiProcess} from "./pi-process";
import {PiSymbol} from "./pi-symbol";
import {PiConcurrent} from "./pi-concurrent";
import {PiSum} from "./pi-sum";
import {PiReplication} from "./pi-replication";
import {PiTerm} from "./pi-term";
import {PiScope} from "./pi-scope";

export  class PiSystemAddAction{
    private readonly system: PiSystem;
    private readonly startAction: PiAction;
    public action: PiAction;

    constructor(system: PiSystem, action: PiAction){
        this.system = system;
        this.startAction = action;
        this.action = this.startAction;
    }

    private nextAction(action: PiAction): this{
        this.action.setNextSymbol(action);
        this.action = action;
        return this;
    }

    public channelIn(name: string, input: string, attachment?: any, resolvingChance: number = 1): this{
        let chan = new PiChannelIn(this.system, name, input);
        chan.attachment = attachment;
        chan.resolvingChance = resolvingChance;
        return this.nextAction(chan);
    }

    public channelOut(name: string, output: string, attachment?: any, resolvingChance: number = 1): this{
        let chan = new PiChannelOut(this.system, name, output);
        chan.attachment = attachment;
        chan.resolvingChance = resolvingChance;
        return this.nextAction(chan);
    }

    public channelInCB(name: string, input: string,
                       callback: (resolvedName?: string, attachmentOfResolved?: any) => any, attachment?: any,
                       resolvingChance: number = 1): this{
        let pi = new PiChannelIn(this.system, name, input);
        pi.setCallback(callback);
        pi.attachment = attachment;
        pi.resolvingChance = resolvingChance;
        return this.nextAction(pi);
    }

    public channelOutCB(name: string, output: string,
                        callback: (resolvedName?: string, attachmentOfResolved?: any) => any,
                        attachment?: any, resolvingChance: number = 1): this{
        let pi = new PiChannelOut(this.system, name, output);
        pi.setCallback(callback);
        pi.attachment = attachment;
        pi.resolvingChance = resolvingChance;
        return this.nextAction(pi);
    }

    public concurrent(symbols: PiSymbol[]): PiAction{
        this.action.setNextSymbol(new PiConcurrent(this.system, symbols));
        return this.startAction;
    }

    public sum(actions: PiAction[]): PiAction{
        this.action.setNextSymbol(new PiSum(this.system, actions));
        return this.startAction;
    }

    public replication(action: PiAction): PiAction{
        this.action.setNextSymbol(new PiReplication(this.system, action));
        return this.startAction;
    }

    public process(name: string, callback: (passedValues: [string, string][])=>any): PiAction{
        this.action.setNextSymbol(new PiProcess(this.system, name, callback));
        return this.startAction;
    }

    public nullProcess(): PiAction{
        this.action.setNextSymbol(new PiProcess(this.system));
        return this.startAction;
    }

    public term(name: string, symbol: PiSymbol): PiAction{
        this.action.setNextSymbol(new PiTerm(this.system, name, symbol));
        return this.startAction;
    }

    public scope(scopedName: string, symbol: PiSymbol): PiAction{
        let scope = new PiScope(this.system, scopedName, symbol, false);
        this.action.setNextSymbol(scope);
        return this.startAction;
    }

    public next(symbol: PiSymbol): PiAction{
        this.action.setNextSymbol(symbol);
        return this.startAction;
    }

}