import {BotAction} from "./botaction";
import {Bot} from "./bot";
import {BotShield} from "./botshield";

export class BotRegenerate extends BotAction{

    public shieldTypes: [BotShield, BotShield, BotShield, BotShield, BotShield];
    public usableTypes: BotShield[];

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);

        this.shieldTypes.splice(0, 0, new BotShield("armor", bot, bot.getEnergyCost("armor")));
        this.shieldTypes.splice(1, 0, new BotShield("shield", bot, bot.getEnergyCost("shield")));
        this.shieldTypes.splice(2, 0, new BotShield("rocket", bot, bot.getEnergyCost("rocket")));
        this.shieldTypes.splice(3, 0, new BotShield("nano", bot, bot.getEnergyCost("nano")));
        this.shieldTypes.splice(4, 0, new BotShield("adap", bot, bot.getEnergyCost("adap")));

        this.usableTypes = [];
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

    public activate(step: number): void {
        for(let s of this.shieldTypes){
            if(s.executable){
                this.usableTypes.push(s);
            }
        }
        let shield = this.chooseShield();
        let hz = this.chooseHZ();

        this.usableTypes = [];
    }

    public chooseShield(): string{
        let x = Phaser.Math.Between(1,100);
        switch(this.usableTypes.length){
            case(1):{
                return this.usableTypes[0].type;
            }
            case(2):{
                if(x <= 50){
                    return this.usableTypes[0].type;
                }else{
                    return this.usableTypes[1].type;
                }
            }
            case(3):{
                if(x <= 33){
                    return this.usableTypes[0].type;
                }else if(x > 33 && x <= 66){
                    return this.usableTypes[1].type;
                }else{
                    return this.usableTypes[2].type;
                }
            }
            case(4):{
                if(x <= 25){
                    return this.usableTypes[0].type;
                }else if(x > 25 && x <= 50){
                    return this.usableTypes[1].type;
                }else if(x > 50 && x <= 75){
                    return this.usableTypes[2].type;
                }else{
                    return this.usableTypes[3].type;
                }
            }
            case(5):{
                if(x <= 20){
                    return this.usableTypes[0].type;
                }else if(x > 20 && x <= 40){
                    return this.usableTypes[1].type;
                }else if(x > 40 && x <= 60){
                    return this.usableTypes[2].type;
                }else if(x > 60 && x <= 80){
                    return this.usableTypes[3].type;
                }else{
                    return this.usableTypes[4].type;
                }
            }
            default: return "";
        }
    }

    public chooseHZ(): string{
        let s = "";

        return s;
    }

    public logAction(): void {
    }
}