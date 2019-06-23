import {BotAction} from "./botaction";
import {Bot} from "./bot";
import {BotShield} from "./botshield";

export class BotRegenerate extends BotAction{

    public shieldTypes: [BotShield, BotShield, BotShield, BotShield, BotShield];
    public usableTypes: BotShield[];
    public hitZones: string[];

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

        this.shieldTypes.splice(0, 0, new BotShield("armor", bot, bot.getEnergyCost("armor")));
        this.shieldTypes.splice(1, 0, new BotShield("shield", bot, bot.getEnergyCost("shield")));
        this.shieldTypes.splice(2, 0, new BotShield("rocket", bot, bot.getEnergyCost("rocket")));
        this.shieldTypes.splice(3, 0, new BotShield("nano", bot, bot.getEnergyCost("nano")));
        this.shieldTypes.splice(4, 0, new BotShield("adap", bot, bot.getEnergyCost("adap")));

        this.usableTypes = [];
        this.hitZones = [];
    }

    public checkExecutable(): void{
        this.executable = false;
        for(let s of this.shieldTypes){
            if(s.checkExecutable()){
                this.executable = true;
                break;
            }
        }
    }

    public activate(delay: number): void {
        for(let s of this.shieldTypes){
            if(s.executable){
                this.usableTypes.push(s);
            }
        }
        //find type of shield and hitzone
        let shield = this.chooseShield();
        let hz = this.chooseHZ();

        //push channel to system
        let system = this.bot.getSystem();
        this.bot.scene.time.delayedCall(delay, ()=>{
            system.pushSymbol(system.add.channelOut("r"+shield+"p"+this.bot.id+"z"+hz,"").nullProcess());
            this.logAction(this.bot.steps, shield, hz);
        }, [], this);

        //clear arrays
        this.usableTypes = [];
        this.hitZones = [];
    }

    public chooseShield(): string{
        let x = Phaser.Math.Between(0, this.usableTypes.length-1);
        return this.usableTypes[x].type;
    }

    public chooseHZ(): string{
        if(!this.bot.z1Destroyed) this.hitZones.push("1");
        if(!this.bot.z2Destroyed) this.hitZones.push("2");
        if(!this.bot.z3Destroyed) this.hitZones.push("3");
        if(!this.bot.z4Destroyed) this.hitZones.push("4");

        let x = Phaser.Math.Between(0, this.hitZones.length-1);

        return this.hitZones[x];
    }

    public logAction(step: number, shield: string, hz: string): void {
        let s = step.toString();
        if(shield == "shield") {
            console.log(s + ". step: I built a laser shield on hitzone " + hz + ".");
        }else if(shield == "adap"){
            console.log(s + ". step: I built an adaptive shield on hitzone " + hz + ".");
        }else if(shield == "armor"){
            console.log(s + ". step: I built an armor shield on hitzone " + hz + ".");
        }else{
            console.log(s + ". step: I built a " + shield + " shield on hitzone " + hz + ".");
        }
    }
}