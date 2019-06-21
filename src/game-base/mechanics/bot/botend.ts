import {BotAction} from "./botaction";
import {Bot} from "./bot";

export class BotEnd extends BotAction{

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

    }

    public checkExecutable(): void {}
    public activate(): void {
        this.bot.active = false;
    }
}