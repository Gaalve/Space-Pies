import {BotAction} from "./botaction";
import {Bot} from "./bot";

export class BotWMod extends BotAction{

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

    }

    public checkExecutable(): void {

        this.updateCost();
        if(this.bot.getNrDrones() >= 3 || this.bot.getEnergy() < this.actCost){
            this.executable = false;
        }else{
            this.executable = true;
        }
    }

    public updateCost(): void{
        this.actCost = this.bot.getEnergyCost("wmod");
    }

    public activate(delay: number): void {
        let system = this.bot.getSystem();
        this.bot.scene.time.delayedCall(delay, ()=>{
            system.pushSymbol(system.add.channelOut("","").nullProcess()) //TODO: channelname
        }, [], this);

        this.logAction(this.bot.steps);
    }

    public logAction(step: number): void {
        let s = step.toString();
        console.log(s + ". step: I built a weapon mod.");
    }
}