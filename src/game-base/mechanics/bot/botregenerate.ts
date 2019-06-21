import {BotAction} from "./botaction";
import {HealthType} from "../health/health-type";
import {Bot} from "./bot";

export class BotRegenerate extends BotAction{

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);
    }

    public checkExecutable(): void{

    }

    public activate(): void {
    }
}