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
        let system = this.bot.getSystem();
        //create solar drone
        this.bot.scene.time.delayedCall(delay, ()=>{
            system.pushSymbol(system.add.channelOut("","").nullProcess()) //TODO: channelname
            this.logAction(this.bot.steps);
        }, [], this);
    }

    public logAction(step: number): void {
        let s = step.toString();
        console.log(s + ". step: I built a solar drone.");
    }
}