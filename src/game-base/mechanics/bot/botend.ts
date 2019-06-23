import {BotAction} from "./botaction";
import {Bot} from "./bot";

export class BotEnd extends BotAction{

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

    }

    public checkExecutable(): void {
        this.executable = true;
    }

    public activate(delay: number): void {
        let system = this.bot.getSystem();
        this.bot.active = false;

        //endTurn
        this.bot.scene.time.delayedCall(delay, ()=>{
            system.pushSymbol(system.add.channelOut("botend","").nullProcess());
            this.logAction(this.bot.steps);
            this.bot.steps = 0;
        }, [], this);

    }

    public logAction(step: number): void {
        let s = step.toString();
        console.log(s + ". step: I´m finished. Now it´s your turn!");
    }
}