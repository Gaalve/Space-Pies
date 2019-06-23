import {BotAction} from "./botaction";
import {Bot} from "./bot";
import {BotEngine} from "./botengine";

export class BotMotor extends BotAction{

    public motors: BotEngine[];
    public usable: BotEngine[];

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

        this.motors.splice(0,0,new BotEngine("laser", bot, this.bot.getEnergyCost("XXX")));
        this.motors.splice(1,0,new BotEngine("projectile", bot, this.bot.getEnergyCost("XXX")));
        this.motors.splice(2,0,new BotEngine("rocket", bot, this.bot.getEnergyCost("XXX")));

        this.usable = [];
    }

    public checkExecutable(): void {

    }

    public activate(delay: number): void {
        let type = this.chooseEngine();
        //let nr = this.bot.getNrEngines()      TODO

        let system = this.bot.getSystem();

        this.bot.scene.time.delayedCall(delay, ()=>{
            system.pushSymbol(system.add.channelOut("buymotor"+type+this.bot.id, "").nullProcess());        //TODO Channelnamen anpassen, sobald Methode bekannt
            this.logAction(this.bot.steps, type);
        }, [], this);

    }

    public chooseEngine(): string{
        let x = Phaser.Math.Between(0, this.usable.length-1);
        return this.usable[x].type;
    }

    public logAction(step: number, type: string): void {
        let s = step.toString();
        console.log(s + ". step: I built a " + type + " motor.");
    }
}