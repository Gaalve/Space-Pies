import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";
import {Ship} from "./ship";
import {Health} from "./health/health";
import {EnergyDrone} from "./energyDrone";
export class Player {
    private nameIdentifier: string;
    private firstPlayer: boolean;
    private drones : [Drone, Drone, Drone];
    private solarDrones: [EnergyDrone, EnergyDrone, EnergyDrone, EnergyDrone, EnergyDrone];
    private scene : Phaser.Scene;
    private system : PiSystem;
    private ship : Ship;
    private activatedDrones : number;
    private activatedSolarDrones : number;

    private health : Health;
    private energy : number;
    private energyCost : number;


    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem : PiSystem){
        this.nameIdentifier = nameIdentifier;
        this.firstPlayer = isFirstPlayer;
        this.system = piSystem;
        this.ship = new Ship(scene, x, y, this);
        this.drones = [new Drone(scene, x, y, this, 0), new Drone(scene, x, y, this, 1), new Drone(scene, x, y, this,2 )];
        this.scene = scene;
        this.activatedDrones = 0;
        this.solarDrones = [new EnergyDrone(scene, x, y, this, 0), new EnergyDrone(scene, x, y, this, 1),new EnergyDrone(scene, x, y, this, 2),new EnergyDrone(scene, x, y, this, 3),new EnergyDrone(scene, x, y, this, 4)];
        this.activatedDrones = 0;
        this.activatedSolarDrones = 1;
        this.system = piSystem;
        this.health = new Health(scene, this, piSystem);

        // z1 starts with 1 shield
        this.health.addToHz(piSystem, 'rshield', 'z1');
        this.health.addToHz(piSystem, 'rshield', 'z1');
        this.health.addToHz(piSystem, 'rarmor', 'z1');
        this.health.addToHz(piSystem, 'rshield', 'z1');
        this.health.addToHz(piSystem, 'rarmor', 'z1');
        this.health.addToHz(piSystem, 'rshield', 'z1');
        this.health.addToHz(piSystem, 'rarmor', 'z1');

        // z2 starts with 1 shield
        this.health.addToHz(piSystem, 'rshield', 'z2');
        this.health.addToHz(piSystem, 'rarmor', 'z2');
        this.health.addToHz(piSystem, 'rarmor', 'z2');

        // z3 starts with 1 armor
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rarmor', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rarmor', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rarmor', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rarmor', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');

        // z4 starts with 1 armor
        this.health.addToHz(piSystem, 'rarmor', 'z4');
        this.health.addToHz(piSystem, 'rarmor', 'z4');
        this.health.addToHz(piSystem, 'rshield', 'z4');

        this.energy = 10;
        this.energyCost = 2;

        if(this.nameIdentifier == "P1"){
            this.system.pushSymbol(this.system.add.channelIn("solar1","*").process("cD14", () => {
                this.createSolarDrone(1);
            }));
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("renergy1","*").process("cD15", () => {
                this.gainEnergy(3);
            })));

        }else {
            this.system.pushSymbol(this.system.add.channelIn("solar2","*").process("cD24", () => {
                this.createSolarDrone(1);
            }));
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("renergy2","*").process("cD25", () => {
                this.gainEnergy(3);
            })));
        }

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
    getNrSolarDrones(): number{
        return this.activatedSolarDrones;
    }
    getSolarDrones(): EnergyDrone[]{
        return this.solarDrones;
    }


    getSystem() : PiSystem{
        return this.system;
    }

    /**
    activate weapon drone that will be able to mount up to three weapons
     */
    createDrone(index : number) : void{
        this.activatedDrones = this.activatedDrones + 1;
        if(index != 0) {
            this.drones[index].setVisible(true);
        }
        this.drones[index].buildPiTerm();
        this.drones[index].refreshOnScreenText();

    }

    createSolarDrone(index : number) : void{
        this.activatedSolarDrones += 1;
        this.solarDrones[index].setVisible(true);

        if(index == 1){
            if(this.nameIdentifier == "P1"){
                this.system.pushSymbol(this.system.add.channelIn('solar1', '*').process("cD13", ()=>{this.createSolarDrone(2)}));
            }else{
                this.system.pushSymbol(this.system.add.channelIn('solar2', '*').process("cD23", ()=>{this.createSolarDrone(2)}));
            }
        }
        else if(index == 2){
            if(this.nameIdentifier == "P1"){
                this.system.pushSymbol(this.system.add.channelIn('solar1', '*').process("cD16", ()=>{this.createSolarDrone(3)}));
            }else{
                this.system.pushSymbol(this.system.add.channelIn('solar2', '*').process("cD26", ()=>{this.createSolarDrone(3)}));
            }
        }
        else if(index == 3){
            if(this.nameIdentifier == "P1"){
                this.system.pushSymbol(this.system.add.channelIn('solar1', '*').process("cD17", ()=>{this.createSolarDrone(4)}));
            }else{
                this.system.pushSymbol(this.system.add.channelIn('solar2', '*').process("cD27", ()=>{this.createSolarDrone(4)}));
            }
        }

    }

    pushEnergy(): void{
        for(let d of this.solarDrones){
            if(d.getPlayer().getNameIdentifier() == "P1" && (d.visible || d.getIndex() == 0)){
                this.system.pushSymbol(
                    this.system.add.channelIn("locks", "*").
                    channelOut("renergy1", "*").nullProcess())
            }
            else if(d.visible|| d.getIndex() == 0){
                this.system.pushSymbol(
                    this.system.add.channelIn("locks", "*").
                    channelOut("renergy2", "*").nullProcess())
            }

        }
        this.unlockSolar();
    }

    unlockSolar() : void{
        for(let i = 0; i < this.activatedSolarDrones; i++){
            this.system.pushSymbol(this.system.add.channelOut("locks", "*").nullProcess());
        }
    }

    getEnergy() : number
    {
        return this.energy;
    }

    payEnergy(cost: number) : void
    {
        this.energy -= cost;
    }

    gainEnergy(amount: number) : void
    {
        this.energy += amount;
    }

    getEnergyCost(): number
    {
        return this.energyCost;
    }

    raiseEnergyCost(amount: number) : void
    {
        this.energyCost += amount;
    }

    setEnergy(amount: number) : void
    {
        this.energy = amount;
    }
    resetEnergy() : void
    {
        this.energy = 10;
    }
}