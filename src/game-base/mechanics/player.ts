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
    public ship : Ship;
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
        this.solarDrones = [new EnergyDrone(scene, x, y, this, 0), new EnergyDrone(scene, x, y, this, 1),new EnergyDrone(scene, x, y, this, 2),new EnergyDrone(scene, x, y, this, 3),new EnergyDrone(scene, x, y, this, 4)];
        this.activatedDrones = 1;
        this.activatedSolarDrones = 1;
        this.drones[0].addWeapon("p");
        this.system = piSystem;
        this.health = new Health(scene, this, piSystem);

        // // z1 starts with 1 shield
        // this.health.addToHz(piSystem, 'rshield', 'z1');
        // this.health.addToHz(piSystem, 'rshield', 'z1');
        // this.health.addToHz(piSystem, 'rarmor', 'z1');
        // this.health.addToHz(piSystem, 'rshield', 'z1');
        // this.health.addToHz(piSystem, 'rarmor', 'z1');
        // this.health.addToHz(piSystem, 'rshield', 'z1');
        // this.health.addToHz(piSystem, 'rarmor', 'z1');
        //
        // // z2 starts with 1 shield
        // this.health.addToHz(piSystem, 'rshield', 'z2');
        // this.health.addToHz(piSystem, 'rarmor', 'z2');
        // this.health.addToHz(piSystem, 'rarmor', 'z2');
        //
        // // z3 starts with 1 armor
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        // this.health.addToHz(piSystem, 'rarmor', 'z3');
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        // this.health.addToHz(piSystem, 'rarmor', 'z3');
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        // this.health.addToHz(piSystem, 'rarmor', 'z3');
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        // this.health.addToHz(piSystem, 'rarmor', 'z3');
        // this.health.addToHz(piSystem, 'rshield', 'z3');
        //
        // // z4 starts with 1 armor
        // this.health.addToHz(piSystem, 'rarmor', 'z4');
        // this.health.addToHz(piSystem, 'rarmor', 'z4');
        // this.health.addToHz(piSystem, 'rshield', 'z4');

        this.energy = 10;
        this.energyCost = 2;

        if(this.nameIdentifier == "P1"){
            this.system.pushSymbol(this.system.add.channelIn("wmod1","*").process("cD11", () => {
                this.createDrone(1);
            }));
            this.system.pushSymbol(this.system.add.channelIn("solar1","*").process("cD14", () => {
                this.createSolarDrone(1);
            }));
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("renergy1","*").process("cD15", () => {
                this.gainEnergy(3);
            })));

        }else {
            this.system.pushSymbol(this.system.add.channelIn("wmod2", "*").process("cD21", () => {
                this.createDrone(1);
            }));
            this.system.pushSymbol(this.system.add.channelIn("solar2","*").process("cD24", () => {
                this.createSolarDrone(1);
            }));
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("renergy2","*").process("cD25", () => {
                this.gainEnergy(3);
            })));
        }

    }

    public update(delta: number): void{
        this.ship.update(delta);
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
        this.unlockWeapons();
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

    /**
    unlock the existing weapons in attack phase to deal damage to the opponents hit-points
     */
    unlockWeapons() : void{
        for(let i = 0; i < this.activatedDrones; i++){
            this.system.pushSymbol(this.system.add.channelOut("lock", "*").nullProcess());
        }
    }

    unlockSolar() : void{
        for(let i = 0; i < this.activatedSolarDrones; i++){
            this.system.pushSymbol(this.system.add.channelOut("locks", "*").nullProcess());
        }
    }

    getPiSystem() : PiSystem
    {
        return this.system;
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