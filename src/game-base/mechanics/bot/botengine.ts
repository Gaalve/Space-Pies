import {Bot} from "./bot";

export class BotEngine{

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
        this.executable = false;
        let p1 = this.bot.id == "1";

        switch(this.type){
            case("laser"):{
                if(p1){
                    if(this.bot.motor.getactiveMotorLaserP1() < 3){
                        this.executable = true;
                    }
                }else{
                    if(this.bot.motor.getactiveMotorLaserP2() < 3){
                        this.executable = true;
                    }
                }
                break;
            }
            case("projectile"):{
                if(p1){
                    if(this.bot.motor.getactiveMotorProjectileP1() < 3){
                        this.executable = true;
                    }
                }else{
                    if(this.bot.motor.getactiveMotorProjectileP2() < 3){
                        this.executable = true;
                    }
                }
                break;
            }
            case("rocket"):{
                if(p1){
                    if(this.bot.motor.getactiveMotorRocketP1() < 3){
                        this.executable = true;
                    }
                }else{
                    if(this.bot.motor.getactiveMotorRocketP2() < 3){
                        this.executable = true;
                    }
                }
                break;
            }
        }

        return this.executable;
    }
}