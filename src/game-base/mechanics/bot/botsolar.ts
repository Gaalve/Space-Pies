import {BotAction} from "./botaction";
import {Bot} from "./bot";

export class BotSolar extends BotAction{

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

    }

    public checkExecutable(): void {

        this.updateCost();
        if(this.bot.getNrSolarDrones() >= 5 || this.bot.getEnergy() < this.actCost ){
            this.executable = false;
        }else{
            this.executable = true;
        }
    }

    public updateCost(){
        this.actCost = this.bot.getEnergyCost("solar");
    }

    public activate(delay: number): void {
        let sd = this.bot.getNrSolarDrones();
        let system = this.bot.getSystem();
        //create solar drone
        system.pushSymbol(system.add.channelOut("newsolar" + this.bot.id + sd,"").nullProcess());
        this.logAction(this.bot.steps);
    }

    public logAction(step: number): void {
        let s = step.toString();
        this.bot.botLog.insertLog(s + ". I built a solar drone.");
    }
}