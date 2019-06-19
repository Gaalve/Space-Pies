import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";
import {Ship} from "./ship";
import {Health} from "./health/health";
import {EnergyDrone} from "./energyDrone";
import {Explosion} from "./animations/explosion";
import {LaserImpact} from "./animations/laser-impact";
import {ProjectileImpact} from "./animations/projectile-impact";
import {LaserTrail} from "./animations/laser-trail";
import {RocketTrail} from "./animations/rocket-trail";
import {BulletTrail} from "./animations/bullet-trail";
import {collectEnergy_ship} from "./animations/collectEnergy_ship";
import {HealthType} from "./health/health-type";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {BulletInfo} from "./weapon/bulletInfo";
import {BattleTimeBar} from "./battleTimeBar";
import get = Reflect.get;

export class Player {
    private nameIdentifier: string;
    private firstPlayer: boolean;
    private drones : [Drone, Drone, Drone];
    private solarDrones: [EnergyDrone, EnergyDrone, EnergyDrone, EnergyDrone, EnergyDrone];
    public scene : Phaser.Scene;
    private system : PiSystem;
    public ship : Ship;
    private activatedDrones : number;
    public activatedSolarDrones : number;
    private smallestIndexSolDrone : number;
    public isDead:boolean;

    private health : Health;
    private energy : number;
    private shieldCost : number = 10; // cost for armor/shield/rocket shield
    private nanoCost : number = 5;  // cost for nano shield
    private wModCost : number = 10;  // cost for wMod
    private weaponCost : number = 25; // cost for laser/projectile weapon
    private rocketCost : number = 40;  // cost for rocket launcher
    private solarCost: number = 60; // cost for solar drone
    private adaptCost: number = 20; // cost for adaptive shield



    public pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    public explosion: Explosion;
    public laserImpact: LaserImpact;
    public projectileImpact: ProjectileImpact;
    public laserTrail: LaserTrail;
    public rocketTrail: RocketTrail;
    public bulletTrail: BulletTrail;
    public collectE: collectEnergy_ship;

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem : PiSystem, pem: ParticleEmitterManager, bt: BattleTimeBar){
        this.isDead=false;
        this.nameIdentifier = nameIdentifier;
        this.firstPlayer = isFirstPlayer;
        this.system = piSystem;
        this.ship = new Ship(scene, x, y, this);
        this.drones = [new Drone(scene, x, y, this, 0), new Drone(scene, x, y, this, 1), new Drone(scene, x, y, this,2 )];
        this.scene = scene;
        this.activatedDrones = 0;
        this.solarDrones = [new EnergyDrone(scene, x, y, this, 0,pem), new EnergyDrone(scene, x, y, this, 1,pem),new EnergyDrone(scene, x, y, this, 2,pem),new EnergyDrone(scene, x, y, this, 3,pem),new EnergyDrone(scene, x, y, this, 4,pem)];
        this.activatedSolarDrones = 0;
        this.smallestIndexSolDrone = 1;
        this.health = new Health(scene, this, piSystem);
        this.pem = pem;
        this.explosion = new Explosion(pem);
        this.laserImpact = new LaserImpact(pem);
        this.projectileImpact = new ProjectileImpact(pem);
        this.laserTrail = new LaserTrail(pem);
        this.rocketTrail = new RocketTrail(pem);
        this.bulletTrail = new BulletTrail(pem);
        this.collectE = new collectEnergy_ship(pem);

        //TODO: remove when Triebwerke ready
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('armor'+nameIdentifier,
            '', new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('shield'+nameIdentifier,
            '', new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('rocket'+nameIdentifier,
            '', new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));

        // z1 starts with 1 shield
        // this.health.addToHz(piSystem, 'radap', 'z1');
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

        this.energy = 55;

        let p = this.getNameIdentifier().charAt(1);
        this.buildLocksPi(p, bt);
        this.buildEnergyDrones(p);
        this.createFirstWeapon(p);
        this.createFirstSolarDrone(p);
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
        if (index != 0) {
            this.solarDrones[index].health.addBar(HealthType.ArmorBarSmall);
            this.solarDrones[index].health.addBar(HealthType.ShieldBarSmall);
            this.solarDrones[index].setVisible(true);
            this.setSmallestIndexSD();
        }
    }

    getEnergy() : number
    {
        this.collectE.collect(this.ship.posX,this.ship.posY);
        return this.energy;
    }

    payEnergy(cost: number) : void
    {
        this.energy -= cost;
    }

    gainEnergy(amount: string) : void
    {
        this.collectE.collect(this.ship.posX,this.ship.posY);
        let toAdd = +amount;
        this.energy += toAdd;
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
        case("adap"):{
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

    getHealth(): Health{
        return this.health;
    }

    getSmallestIndexSD(): string{
        console.log(this.smallestIndexSolDrone);
        return this.smallestIndexSolDrone.toString();
    }
    setSmallestIndexSD(): void{
        for(let i = 4; i > 0; i--){
            if(!this.solarDrones[i].visible){
                this.smallestIndexSolDrone = this.solarDrones[i].getIndex();
            }
        }
    }

    /**
     * builds the necessary locks for all weaponmods
     * @param p - number of player as string
     * @param bt - Battle time Bar
     */

    private buildLocksPi(p : string, bt : BattleTimeBar) : void{

        let rlock = this.system.add.term("RLock" + p, undefined);

        let sum = this.system.add.sum([this.system.add.channelIn("unlock" + p, "")
            .channelOutCB("nolock1", "", ()=>{bt.setVisible(true); bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB("nolock2", "", ()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB("nolock3", "", ()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
            .channelOutCB("attackp" + p + "end", "",()=>{bt.setVisible(false); bt.resetTime()}).next(rlock),
            this.system.add.channelIn("newlock" + p + "0", "nolock1").
            next(rlock),
            this.system.add.channelIn("newlock" + p + "1", "nolock2").
            next(rlock),
            this.system.add.channelIn("newlock" + p + "2", "nolock3").
            next(rlock)]);
        rlock.symbol = sum;
        this.system.pushSymbol(rlock);
    }

    private createFirstWeapon(p : string): void{
        let op : string;
        if(p == "1"){
            op = "2";
        }else{
            op = "1";
        }
        //create 1 projectile weapon on ship
        this.system.pushSymbol(this.system.add.channelOut("wmod" + p + "0","").channelOut("wext" + p + "00", "shieldp" + op).nullProcess());
    }

    /**
     * builds the energy drones
     * @param p - number of player as string 1/2
     */
    private buildEnergyDrones(p : string) : void{

        let drone = this.system.add.term("Drone" + p, undefined);
        let sum = this.system.add.sum([this.system.add.channelIn("startephase" + p, "").
        channelOut("e0", "40").
        channelOut("e1", "15").
        channelOut("e2", "15").
        channelOut("e3", "15").
        channelOut("e4", "15").
        next(drone),
            this.system.add.channelInCB("newsolar" + p + "0", "e0", () =>{
                this.createSolarDrone(0);
            }).
            next(drone),
            this.system.add.channelInCB("newsolar" + p + "1", "e1", () =>{
                this.createSolarDrone(1);
            }).
            channelOut("newShield" + p + "1","").
            next(drone),
            this.system.add.channelInCB("newsolar" + p + "2", "e2", () =>{
                this.createSolarDrone(2);
            }).
            channelOut("newShield" + p + "2","").
            next(drone),
            this.system.add.channelInCB("newsolar" + p + "3", "e3", () =>{
                this.createSolarDrone(3);
            }).
            channelOut("newShield" + p + "3","").
            next(drone),
            this.system.add.channelInCB("newsolar" + p + "4", "e4", () =>{
                this.createSolarDrone(4);
            }).
            channelOut("newShield" + p + "4","").
            next(drone),
            this.system.add.channelIn("dessol" + p + "1", "solar" + p + "1").
            next(drone),
            this.system.add.channelIn("dessol" + p + "2", "solar" + p + "2").
            next(drone),
            this.system.add.channelIn("dessol" + p + "3", "solar" + p + "3").
            next(drone),
            this.system.add.channelIn("dessol" + p + "4", "solar" + p + "4").
            next(drone)
        ]);

        drone.symbol = sum;
        this.system.pushSymbol(drone);
    }

    private createFirstSolarDrone(p : string) : void{
        this.system.pushSymbol(this.system.add.channelOut("newsolar" + p + "0", "solar" + p + "0").nullProcess());
    }
}