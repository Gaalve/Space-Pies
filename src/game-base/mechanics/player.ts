import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";

export class Player {
    private nameIdentifier: string;
    private maxHealth : number;
    private firstPlayer: boolean;
    private drones : Drone[] = new Array();
    private scene : Phaser.Scene;

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, maxHealth: number, isFirstPlayer: boolean){
        this.nameIdentifier = nameIdentifier;
        this.maxHealth = maxHealth;
        this.firstPlayer = isFirstPlayer;
        this.drones.push(new Drone(scene, x, y, this, 0));
        this.drones[0].addWeapon(scene,"p");
        this.drones[0].setVisible(false);
        this.scene = scene;
    }

    getNameIdentifier(): string{
        return this.nameIdentifier;
    }

    getMaxHealth(): number{
        return this.maxHealth;
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

}