import {BotAction} from "./botaction";
import {Bot} from "./bot";
import {BotWeapon} from "./botweapon";

export class BotWext extends BotAction{

    public usableWeapons: BotWeapon[];
    public weapons: BotWeapon[];

    public constructor(type: string, bot: Bot, cost: number){
        super(type, bot, cost);
        this.usableWeapons = [];
        this.weapons = [];

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

    public activate(delay: number): void {
        //find buildable weapons
        for(let w of this.weapons){
            if(w.executable){
                this.usableWeapons.push(w);
            }
        }

        let weapon = this.chooseWeapon();
        let drone = this.chooseDrone();
        let opId = this.bot.id == "1" ? "2":"1";

        let system = this.bot.getSystem();

        system.pushSymbol(system.add.channelOut("wext" + this.bot.id + drone, weapon + "p" + opId).nullProcess());
        this.logAction(this.bot.steps, weapon, drone);


        this.usableWeapons = [];
    }

    public chooseWeapon(): string{
        let x = Phaser.Math.Between(0, this.usableWeapons.length-1)
        return this.usableWeapons[x].type;
    }

    public chooseDrone(): string{
        let drones = [];
        drones.push("0");
        if(this.bot.getNrDrones() == 2){
            drones.push("1");
        }else if(this.bot.getNrDrones() == 3){
            drones.push("2");
        }

        let x = Phaser.Math.Between(0, drones.length-1);
        return drones[x];
    }

    public logAction(step: number, weapon: string, drone: string): void {
        let s = step.toString();
        let w = "rocket launcher";
        if(weapon != "rocket"){
            w = weapon == "armor" ? "laser weapon" : "projectile weapon";
        }

        this.bot.botLog.insertLog(s + ". I built a " + w + " on weapon mod " + drone + ".");
    }
}