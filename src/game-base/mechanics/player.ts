import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";
import {Ship} from "./ship";

export class Player {
    private nameIdentifier: string;
    private maxHealth : number;
    private firstPlayer: boolean;
    private drones : Drone[] = new Array();
    private scene : Phaser.Scene;
    private system : PiSystem;
    private ship : Ship;

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, maxHealth: number, isFirstPlayer: boolean){
        this.nameIdentifier = nameIdentifier;
        this.maxHealth = maxHealth;
        this.firstPlayer = isFirstPlayer;
        this.ship = new Ship(scene, x, y, this);
        this.drones.push(new Drone(scene, x, y, this, 0));
        this.drones[0].addWeapon("p");
        this.drones[0].setVisible(false);
        this.scene = scene;


        //this.system = system;
        /*if(this.nameIdentifier == "P1") {
            system.add.channelInCB("wmod1", "", this.createDrone);
            system.add.channelInCB("wmod1", "", this.createDrone);
        }else{
            system.add.channelInCB("wmod2", "", this.createDrone);
            system.add.channelInCB("wmod2", "", this.createDrone);
        }*/
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
                this.drones.push(new Drone(this.scene, this.drones[0].x + 300, this.drones[0].y + 300,this,this.drones.length));
            }else {
                this.drones.push(new Drone(this.scene, this.drones[0].x - 300, this.drones[0].y + 300,this,this.drones.length));
            }
        } else if (this.drones.length == 2) {
            if(this.nameIdentifier == "P1"){
                this.drones.push(new Drone(this.scene, this.drones[0].x + 300, this.drones[0].y - 300,this,this.drones.length));
            }else{
                this.drones.push(new Drone(this.scene, this.drones[0].x - 300, this.drones[0].y - 300,this,this.drones.length));
            }
        }
    }

}