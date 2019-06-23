import {BotAction} from "./botaction";
import {Bot} from "./bot";
import {BotWeapon} from "./botweapon";

export class BotWext extends BotAction{

    public usableDrones: string[];
    public usableWeapons: BotWeapon[];
    public weapons: BotWeapon[];

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);
        this.usableWeapons = [];
        this.usableDrones = [];

        this.weapons.splice(0, 0, new BotWeapon("shield", bot, bot.getEnergyCost("weapon")));
        this.weapons.splice(1, 0, new BotWeapon("armor", bot, bot.getEnergyCost("weapon")));
        this.weapons.splice(2, 0, new BotWeapon("rocket", bot, bot.getEnergyCost("rocketl")));
    }

    public checkExecutable(): void {
        this.executable = false;
        if(this.bot.weaponSlots > 0){           //weapon slots available
            for(let w of this.weapons){
                if(w.checkExecutable()){
                    this.executable = true;     //weapons buildable
                }
            }
        }
    }

    public activate(step: number): void {
    }

    public logAction(): void {
    }
}