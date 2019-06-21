import {BotAction} from "./botaction";
import {WeaponType} from "../weapon/weapon-type";
import {Bot} from "./bot";

export class BotWext extends BotAction{

    public weaponType: WeaponType;
    public wMod: number;

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);
    }

    public checkExecutable(): void {
        if(this.bot.weaponSlots <= 0 || this.bot.getEnergy() < this.actCost){
            this.executable = false;
        }
    }

    public activate(): void {
    }
}