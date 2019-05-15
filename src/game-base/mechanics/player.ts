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

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, maxHealth: number, isFirstPlayer: boolean, system : PiSystem){
        this.nameIdentifier = nameIdentifier;
        this.maxHealth = maxHealth;
        this.firstPlayer = isFirstPlayer;
        this.ship = new Ship(scene, x, y, this);
        this.drones.push(new Drone(scene, x, y, this, 0));
        this.drones[0].addWeapon("p");
        this.drones[0].setVisible(false);
        this.scene = scene;


        this.system = system;
        /*
        for each Player add 2 input channels to create new drones (max 2)
         */
        if(this.nameIdentifier == "P1") {
            this.system.pushSymbol(this.system.add.channelIn('wmod1', '*').process("cD11", ()=>{this.createDrone()}));
            this.system.pushSymbol(this.system.add.channelIn('wmod1', '*').process("cD12", ()=>{this.createDrone()}));
        }else{
            this.system.pushSymbol(this.system.add.channelIn('wmod2', '*').process("cD21", ()=>{this.createDrone()}));
            this.system.pushSymbol(this.system.add.channelIn('wmod2', '*').process("cD22", ()=>{this.createDrone()}));
        }

        //after drone creation push pi terms to system to wait for newweapon inputs
        this.drones[0].pushPiTerms();
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

    getSystem() : PiSystem{
        return this.system;
    }

    createDrone() : void{
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