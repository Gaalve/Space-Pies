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

    public activate(): void {
    }
}