import {PiSystem} from "./pi-system";
import {PiAction} from "./pi-action";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiProcess} from "./pi-process";

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

    public process(name: string, callback: Function): void{
        this.action.setNextSymbol(new PiProcess(this.system, name, callback));
        this.nullProcess();
    }

    public nullProcess(): void{
        this.system.addSymbol(this.startAction);
    }
}