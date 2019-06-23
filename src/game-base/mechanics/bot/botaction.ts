import {Bot} from "./bot";

export abstract class BotAction{

    public type: string;
    public bot: Bot;
    public actCost: number;
    public executable: boolean;

    protected constructor(type: string, bot: Bot, cost: number){
        this.type = type;
        this.bot = bot;
        this.actCost = cost;

        if(bot.getEnergy() <= cost){
            this.executable = false;
        }else{
            this.executable = true;
        }
    }

    public abstract checkExecutable(): void;
    public abstract activate(delay: number): void;
    public abstract logAction(step: number, shield?: string, hz?: string): void;
}