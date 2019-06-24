import {BotAction} from "./botaction";
import {Bot} from "./bot";
import {BotEngine} from "./botengine";

export class BotMotor extends BotAction{

    public motors: BotEngine[];
    public usable: BotEngine[];

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

        this.motors = [];
        this.usable = [];
        this.motors.splice(0,0,new BotEngine("laser", bot, this.bot.getEnergyCost("motor")));
        this.motors.splice(1,0,new BotEngine("projectile", bot, this.bot.getEnergyCost("motor")));
        this.motors.splice(2,0,new BotEngine("rocket", bot, this.bot.getEnergyCost("motor")));

        this.usable = [];
    }

    public checkExecutable(): void {
        this.executable = false;
        if(this.bot.getEnergyCost("motor") > this.bot.getEnergy()){
            this.executable = false;
            return;
        }
        for(let m of this.motors){
            if(m.checkExecutable()){
                this.executable = true;
                break;
            }
        }
    }

    public activate(delay: number): void {
        for(let m of this.motors){
            if(m.executable){
                this.usable.push(m);
            }
        }
        let type = this.chooseEngine();
        let nr = this.getMotorNr(type);

        let system = this.bot.getSystem();

        system.pushSymbol(system.add.channelOut("buymotor"+type+this.bot.id + nr, "").nullProcess());        //TODO Channelnamen anpassen, sobald Methode bekannt
        this.logAction(this.bot.steps, type);

        this.usable = [];
    }

    public chooseEngine(): string{
        let x = Phaser.Math.Between(0, this.usable.length-1);
        return this.usable[x].type;
    }

    public logAction(step: number, type: string): void {
        let s = step.toString();
        this.bot.botLog.insertLog(s + ". I built a " + type + " motor.");
    }

    public getMotorNr(type: string): string{
        let p1 = this.bot.id == "1";

        switch(type){
            case("laser"):{
                if(p1){
                    return this.bot.motor.getactiveMotorLaserP1().toString();
                }else{
                    return this.bot.motor.getactiveMotorLaserP2().toString();
                }
            }
            case("projectile"):{
                if(p1){
                    return this.bot.motor.getactiveMotorProjectileP1().toString();
                }else{
                    return this.bot.motor.getactiveMotorProjectileP2().toString();
                }
            }
            case("rocket"):{
                if(p1){
                    return this.bot.motor.getactiveMotorRocketP1().toString();
                }else{
                    return this.bot.motor.getactiveMotorRocketP1().toString();
                }
            }
        }

        return
    }
}