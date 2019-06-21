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

    public activate(): void {
    }
}