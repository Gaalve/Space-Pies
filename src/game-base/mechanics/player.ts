import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";
import {Ship} from "./ship";
import {Health} from "../scenes/objects/Health";
import has = Reflect.has;
import {Healthbar} from "../scenes/objects/Healthbar";

export class Player {
    private nameIdentifier: string;
    private health : Health;
    private firstPlayer: boolean;
    private drones : Drone[] = new Array();
    private scene : Phaser.Scene;
    private system : PiSystem;
    private ship : Ship;
    private healthbar : Healthbar;

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, health : Health, isFirstPlayer: boolean, piSystem : PiSystem){
        this.nameIdentifier = nameIdentifier;
        this.health = health;
        this.firstPlayer = isFirstPlayer;
        this.ship = new Ship(scene, x, y, this);
        this.drones.push(new Drone(scene, x, y, this, 0));
        this.drones[0].addWeapon(scene,"p");
        this.drones[0].setVisible(false);
        this.scene = scene;
        this.system = piSystem;
        this.addHealthbarPiTerms(this);

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
        return this.drones.length;
    }
    getDrones(): Drone[]{
        return this.drones;
    }

    createDrone(): void {
        if (this.drones.length == 1) {
            if(this.nameIdentifier == "P1"){
                this.drones.push(new Drone(this.scene, this.drones[0].getPositionX() + 300, this.drones[0].getPositionY() + 300,this,this.drones.length));
            }else {
                this.drones.push(new Drone(this.scene, this.drones[0].getPositionX() - 300, this.drones[0].getPositionY() + 300,this,this.drones.length));
            }
        } else if (this.drones.length == 2) {
            if(this.nameIdentifier == "P1"){
                this.drones.push(new Drone(this.scene, this.drones[0].getPositionX() + 300, this.drones[0].getPositionY() - 300,this,this.drones.length));
            }else{
                this.drones.push(new Drone(this.scene, this.drones[0].getPositionX() - 300, this.drones[0].getPositionY() - 300,this,this.drones.length));
            }
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

    setPiSystem(system: PiSystem) : void
    {
        this.system = system;
    }



}