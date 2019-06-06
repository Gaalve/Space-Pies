import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";
import {Ship} from "./ship";
import {Health} from "./health/health";
import {EnergyDrone} from "./energyDrone";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {Explosion} from "./animations/explosion";
import {LaserImpact} from "./animations/laser-impact";
import {ProjectileImpact} from "./animations/projectile-impact";
import {LaserTrail} from "./animations/laser-trail";
import {RocketTrail} from "./animations/rocket-trail";
import {BulletTrail} from "./animations/bullet-trail";
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
    private shieldCost : number = 10; // cost for armor/shield/rocket shield
    private nanoCost : number = 5;  // cost for nano shield
    private wModCost : number = 10;  // cost for wMod
    private weaponCost : number = 25; // cost for laser/projectile weapon
    private rocketCost : number = 40;  // cost for rocket launcher
    private solarCost: number = 60; // cost for solar drone
    private adaptCost: number = 20; // cost for adaptive shield




    public explosion: Explosion;
    public laserImpact: LaserImpact;
    public projectileImpact: ProjectileImpact;
    public laserTrail: LaserTrail;
    public rocketTrail: RocketTrail;
    public bulletTrail: BulletTrail;

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem : PiSystem, pem: ParticleEmitterManager){
        this.nameIdentifier = nameIdentifier;
        this.firstPlayer = isFirstPlayer;
        this.system = piSystem;
        this.ship = new Ship(scene, x, y, this);
        this.drones = [new Drone(scene, x, y, this, 0), new Drone(scene, x, y, this, 1), new Drone(scene, x, y, this,2 )];
        this.scene = scene;
        this.activatedDrones = 0;
        this.solarDrones = [new EnergyDrone(scene, x, y, this, 0), new EnergyDrone(scene, x, y, this, 1),new EnergyDrone(scene, x, y, this, 2),new EnergyDrone(scene, x, y, this, 3),new EnergyDrone(scene, x, y, this, 4)];
        this.activatedSolarDrones = 0;
        this.health = new Health(scene, this, piSystem);
        this.explosion = new Explosion(pem);
        this.laserImpact = new LaserImpact(pem);
        this.projectileImpact = new ProjectileImpact(pem);
        this.laserTrail = new LaserTrail(pem);
        this.rocketTrail = new RocketTrail(pem);
        this.bulletTrail = new BulletTrail(pem);

        //TODO: remove when Triebwerke ready
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('armor'+nameIdentifier, '', "miss").nullProcess()));
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('shield'+nameIdentifier, '', "miss").nullProcess()));
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('rocket'+nameIdentifier, '', "miss").nullProcess()));

        // z1 starts with 1 shield
        // this.health.addToHz(piSystem, 'rrocket', 'z1');
        // this.health.addToHz(piSystem, 'rshield', 'z1');
        // this.health.addToHz(piSystem, 'rarmor', 'z1');
        // this.health.addToHz(piSystem, 'rnano', 'z1');
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

        this.energy = 55;
    }

    public update(delta: number): void{
        this.ship.update(delta);
        this.drones[0].update(delta);
        this.drones[1].update(delta);
        this.drones[2].update(delta);
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
        if(index != 0) {
            this.solarDrones[index].setVisible(true);
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

    gainEnergy(value : string, amount: number) : void
    {
        if(value == "1") {
            this.energy += amount;
        }
    }

    getEnergyCost(type: string): number
    {   switch (type) {
        case("shield"):{
               return this.shieldCost;
           }
        case("armor"):{
            return this.shieldCost;
        }
        case("rocket"):{
            return this.shieldCost;
        }
        case("nano"):{
            return this.nanoCost;
        }
        case("wmod"):{
            return this.wModCost;
        }
        case("weapon"):{
            return this.weaponCost;
        }
        case("rocketl"):{
            return this.rocketCost;
        }
        case("solar"):{
            return this.solarCost;
        }
        case("adapt"):{
            return this.adaptCost;
        }
        default: return 0;

        }
    }

    raiseEnergyCost(type: string, amount: number) : void
    {
        switch (type) {
            case("wmod"): {
                this.wModCost += amount;
                break;
            }
            case("solar"):{
                this.solarCost += amount;
                break;
            }
            default: return;
        }
    }

    setEnergy(amount: number) : void
    {
        this.energy = amount;
    }
    resetEnergy() : void
    {
        this.energy = 55;
    }
}