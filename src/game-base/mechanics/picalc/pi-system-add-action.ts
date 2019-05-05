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
    private startAction: PiAction;
    private action: PiAction;

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

    public channelIn(name: string, input: string): this{
        return this.nextAction(new PiChannelIn(this.system, name, input))
    }

    public channelOut(name: string, output: string): this{
        return this.nextAction(new PiChannelOut(this.system, name, output))
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

    public process(name: string, callback: Function): PiAction{
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
        let scope = new PiScope(this.system, name, symbol);
        let last = scope.getLastSymbol();
        this.action.setNextSymbol(scope);
        return this.startAction;
    }


    public scopeAction(scopedName: string, symbol: PiSymbol): this{
        let scope = new PiScope(this.system, name, symbol);
        let last = scope.getLastSymbol();
        this.action.setNextSymbol(scope);
        if(last instanceof PiAction){
            this.action = last;
            return this;
        }
        else throw new Error("Scope: Last symbol is not an action!");
    }

    public next(symbol: PiSymbol): PiAction{
        this.action.setNextSymbol(symbol);
        return this.startAction;
    }

}