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
    private energyCost : number;

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
        //this.health.addToHz(piSystem, 'rnano', 'z1');
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