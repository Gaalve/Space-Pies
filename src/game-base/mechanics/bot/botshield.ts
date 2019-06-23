import {Bot} from "./bot";

export class BotShield{

        public cost: number;
        public bot: Bot;
        public type: string;
        public executable: boolean;

        public constructor(type: string, bot: Bot, cost: number){

            this.cost = cost;
            this.bot = bot;
            this.type = type;
    }

    public checkExecutable(): boolean{
            if(this.cost <= this.bot.getEnergy()){
                this.executable = true;
            }else{
                this.executable = false;
            }
        return this.executable;
    }
}