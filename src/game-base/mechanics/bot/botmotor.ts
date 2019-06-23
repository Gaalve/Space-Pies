import {BotAction} from "./botaction";
import {Bot} from "./bot";

export class BotMotor extends BotAction{

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);
    }

    public checkExecutable(): void {

    }

    public activate(step: number): void {
    }

    public logAction(): void {
    }
}