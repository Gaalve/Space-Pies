import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";
import {Ship} from "./ship";
import {Health} from "../scenes/objects/Health";
//import has = Reflect.has;
import {Healthbar} from "../scenes/objects/Healthbar";

export class Player {
    private nameIdentifier: string;
    private health : Health;
    private firstPlayer: boolean;
    private drones : [Drone, Drone, Drone];
    private scene : Phaser.Scene;
    private system : PiSystem;
    private ship : Ship;
    private activatedDrones : number;
    private healthbar : Healthbar;

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, health : Health, isFirstPlayer: boolean, piSystem : PiSystem){
        this.nameIdentifier = nameIdentifier;
        this.health = health;
        this.firstPlayer = isFirstPlayer;
        this.system = piSystem;
        this.ship = new Ship(scene, x, y, this);
        this.drones = [new Drone(scene, x, y, this, 0), new Drone(scene, x, y, this, 1), new Drone(scene, x, y, this,2 )];
        this.scene = scene;
        this.activatedDrones = 1;
        this.drones[0].addWeapon("p");
        this.system = piSystem;
        this.addHealthbarPiTerms(this);



        if(this.nameIdentifier == "P1"){
            this.system.pushSymbol(this.system.add.channelIn("wmod1","*").process("cD11", () => {
                this.createDrone(1);
            }));
        }else {
            this.system.pushSymbol(this.system.add.channelIn("wmod2", "*").process("cD21", () => {
                this.createDrone(1);
            }));
        }

    }

    private addHealthbarPiTerms(player: Player) {
        this.system.pushSymbol(this.system.add.channelIn("armorEmpty" + player.getNameIdentifier(), "*").process("destroyArmor", this.destroyArmor(this.system)))
        this.system.pushSymbol(this.system.add.channelIn("shieldEmpty" + player.getNameIdentifier(), "*").process("destroyShield", this.destroyShield(this.system)))
    }


    private destroyShield(system : PiSystem) : Function {
        let player = this;
        let dstroyShield = function()
        {
            console.log("[ACTION] " + player.getNameIdentifier() + "'s SHIELD COMPLETELY DESTROYED !");
            system.pushSymbol(system.add.channelOut("shieldDestroyed" + player.getNameIdentifier(), "*").nullProcess());
        };
        return dstroyShield;


    }

    private destroyArmor(system : PiSystem) : Function {
        let player = this;
        let dstroyArmor = function()
        {
            console.log("[ACTION] " + player.getNameIdentifier() + "'s ARMOR COMPLETELY DESTROYED !");
            system.pushSymbol(system.add.channelOut("armorDestroyed" + player.getNameIdentifier(), "*").nullProcess());
        };
        return dstroyArmor;
    }

    public shootProjectile(player : Player)
    {
        console.log("[ACTION] Shooting Projectile at " + player.getNameIdentifier() + " !")
        this.system.pushSymbol(this.system.add.channelOut("armor" + player.getNameIdentifier(), "*").nullProcess());
    }

    public shootLaser(player : Player) {
        console.log("[ACTION] Shooting Laser at " + player.getNameIdentifier() + " !")
        this.system.pushSymbol(this.system.add.channelOut("shield" + player.getNameIdentifier(), "*").nullProcess());
    }

    getNameIdentifier(): string{
        return this.nameIdentifier;
    }

    isFirstPlayer(): boolean{
        return this.firstPlayer;
    }

    getNrDrones(): number{
        return this.activatedDrones;
    }
    getDrones(): Drone[]{
        return this.drones;
    }

    getSystem() : PiSystem{
        return this.system;
    }

    /**
    activate weapon drone that will be able to mount up to three weapons
     */
    createDrone(index : number) : void{
        this.activatedDrones = this.activatedDrones + 1;
        this.drones[index].piTermWExtensions();
        this.drones[index].setVisible(true);

        if(index == 1){
            if(this.nameIdentifier == "P1"){
                this.system.pushSymbol(this.system.add.channelIn('wmod1', '*').process("cD12", ()=>{this.createDrone(2)}));
            }else{
                this.system.pushSymbol(this.system.add.channelIn('wmod2', '*').process("cD22", ()=>{this.createDrone(2)}));
            }
        }
    }

    /**
	push pi terms for weapons to the pi system. Has to be done each round again
	 */
    pushWeapons() : void{
        for(let d of this.drones) {
            if(d.getNrWeapons() == 1) {
                this.system.pushSymbol(
                    this.system.add.channelIn("lock", "*").
                    channelOut(d.getWeapons()[0].getPiTerm(), "*").nullProcess()
                );
            } else if (d.getNrWeapons() == 2) {
                this.system.pushSymbol(
                    this.system.add.channelIn("lock", "*").
                    channelOut(d.getWeapons()[0].getPiTerm(), "*").
                    channelOut(d.getWeapons()[1].getPiTerm(), "*").nullProcess()
                );
            } else if (d.getNrWeapons() == 3) {
                this.system.pushSymbol(
                    this.system.add.channelIn("lock", "*").
                    channelOut(d.getWeapons()[0].getPiTerm(), "*").
                    channelOut(d.getWeapons()[1].getPiTerm(), "*").
                    channelOut(d.getWeapons()[2].getPiTerm(), "*").nullProcess()
                );
            }
        }
    }

    /**
    unlock the existing weapons in attack phase to deal damage to the opponents hit-points
     */
    unlockWeapons() : void{
        for(let i = 0; i < this.activatedDrones; i++){
            this.system.pushSymbol(this.system.add.channelOut("lock", "*").nullProcess());
        }
    }

    getHealth() : Health
    {
        return this.health;
    }
    getHealthbar() : Healthbar
    {
        return this.healthbar;
    }
    getPiSystem() : PiSystem
    {
        return this.system;
    }

    setHealth(health: Health) : void
    {
        this.health = health;
    }
    setHealthbar(healthbar: Healthbar) : void
    {
        this.healthbar = healthbar;
    }

}