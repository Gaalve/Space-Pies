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
import {Anomaly} from "./anomalies/anomaly";
import {SunEruption} from "./anomalies/sun-eruption";
import {WormHole} from "./anomalies/worm-hole";
import {NanoDrone} from "./nanoDrone";
import {BlackHole} from "./anomalies/black-hole";

export class Player {
    private nameIdentifier: string;
    private firstPlayer: boolean;
    private drones : [Drone, Drone, Drone];
    private solarDrones: [EnergyDrone, EnergyDrone, EnergyDrone, EnergyDrone, EnergyDrone, NanoDrone];
    public scene : Phaser.Scene;
    private system : PiSystem;
    public ship : Ship;
    private activatedDrones : number;
    public activatedSolarDrones : number;
    private smallestIndexSolDrone : number;
    public isDead:boolean;
    public z1Destroyed: boolean = false;
    public z2Destroyed: boolean = false;
    public z3Destroyed: boolean = false;
    public z4Destroyed: boolean = false;


    private health : Health;
    private energy : number;
    private shieldCost : number = 10; // cost for armor/shield/rocket shield
    private nanoCost : number = 6;  // cost for nano shield
    private wModCost : number = 10;  // cost for wMod
    private weaponCost : number = 25; // cost for laser/projectile weapon
    private rocketCost : number = 40;  // cost for rocket launcher
    private solarCost: number = 60; // cost for solar drone
    private adaptCost: number = 16; // cost for adaptive shield



    public pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    public explosion: Explosion;
    public laserImpact: LaserImpact;
    public projectileImpact: ProjectileImpact;
    public laserTrail: LaserTrail;
    public rocketTrail: RocketTrail;
    public bulletTrail: BulletTrail;
    public collectE: collectEnergy_ship;


    private anomalies: string[];
    public currentAnomaly: Anomaly;

    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem : PiSystem, pem: ParticleEmitterManager, bt: BattleTimeBar, blackholeAppears: string){
        this.isDead=false;
        this.nameIdentifier = nameIdentifier;
        this.firstPlayer = isFirstPlayer;
        this.system = piSystem;
        this.ship = new Ship(scene, x, y, this);
        this.drones = [new Drone(scene, x, y, this, 0), new Drone(scene, x, y, this, 1), new Drone(scene, x, y, this,2 )];
        this.scene = scene;
        this.activatedDrones = 0;
        this.solarDrones = [new EnergyDrone(scene, x, y, this, 0,pem), new EnergyDrone(scene, x, y, this, 1,pem),
            new EnergyDrone(scene, x, y, this, 2,pem),new EnergyDrone(scene, x, y, this, 3,pem),
            new EnergyDrone(scene, x, y, this, 4,pem), new NanoDrone(scene, this, 5, pem)];
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

        this.anomalies = this.randomizeAnomalyAppearance(blackholeAppears);
        //console.log(blackholeAppears)
        //for (let i= 0; i < this.anomalies.length; i++){ console.log(this.anomalies[i])}
        //this.anomalies = ["hole", "eruption", "nanodrone"];

        //TODO: remove when Triebwerke ready
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('armor'+nameIdentifier, '',
            new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('shield'+nameIdentifier, '',
            new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
        this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('rocket'+nameIdentifier, '',
            new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn(
            'shotblock'+this.getNameIdentifier().charAt(1), "","", 0).nullProcess())
        );


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
        this.buildAnomalyPi(p, x, y, blackholeAppears.charAt(1) == p);
        this.buildEnergyDrones(p);
        this.createFirstWeapon(p);
        this.createFirstSolarDrone(p);
    }

    public update(delta: number): void{
        this.ship.update(delta);
        this.drones[0].update(delta);
        this.drones[1].update(delta);
        this.drones[2].update(delta);

        if(this.currentAnomaly != undefined) this.currentAnomaly.update();
    }

    getNameIdentifier(): string{
        return this.nameIdentifier;
    }

    getOpponentsIdentifier(): string{
        if(this.getNameIdentifier().charAt(1) == '1') return "2";
        else return "1";
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



    setDestroyedZone(zone: string){
        switch (zone) {
            case("z1"):{ this.z1Destroyed = true; break;}
            case("z2"):{ this.z2Destroyed = true; break;}
            case("z3"):{ this.z3Destroyed = true; break;}
            case("z4"):{ this.z4Destroyed = true; break;}

        }
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
            this.solarDrones[index].health.addBar(HealthType.ArmorBarSmall);
            this.solarDrones[index].health.addBar(HealthType.ShieldBarSmall);
            this.solarDrones[index].health.addBar(HealthType.ShieldBarSmall);
            this.solarDrones[index].setVisible(true);
            this.setSmallestIndexSD();
        }
    }

    randomizeAnomalyAppearance(blackHoleAppears: string) : string[] {

        let index = 0;
        if(blackHoleAppears.charAt(0) == "1") {
            if(Math.random() < 0.5){
                return ["hole","eruption","nanodrone"];
            }
            else{
                return ["hole","nanodrone","eruption"];
            }
        }
        if(blackHoleAppears.charAt(0) == "2") {
            if(Math.random() < 0.5){
                return ["eruption","hole","nanodrone"];
            }
            else{
                return ["nanodrone","hole","eruption"];
            }
        }
        if(blackHoleAppears.charAt(0) == "3") {
            if(Math.random() < 0.5){
                return ["eruption","nanodrone","hole"];
            }
            else{
                return ["nanodrone","eruption","hole"];
            }
        }
    }

    createNanoDrone() : void{
        this.solarDrones[5].health.addBar(HealthType.ArmorBarSmall);
        this.solarDrones[5].health.addBar(HealthType.ShieldBarSmall);
    }

    createAnomaly(action: string) : void{

        if(action == "erupt"){
            this.currentAnomaly = new SunEruption(this.scene, this);
        }
        if(action == "nano"){
            this.currentAnomaly = new WormHole(this.scene, this, this.solarDrones[5]);
        }
        if(action == "hole"){
            this.currentAnomaly = new BlackHole(this.scene, this);
        }
    }

    getAnomaly(index: number){
        return this.anomalies[index];
    }

    getEnergy() : number
    {
        return this.energy;
    }

    payEnergy(cost: number) : void
    {
        this.energy -= cost;
    }

    gainEnergy(amount: string) : void
    {
        let toAdd = +amount;
        this.energy += toAdd;
    }

    public CollectEnergyAnimation():void{
        this.collectE.collect(this.ship.posX,this.ship.posY);
        for (let i=1;i<5;i++) {
            if(this.solarDrones[i].visible){
                this.solarDrones[i].collectED.collect(this.solarDrones[i].x,this.solarDrones[i].y,this.ship.posX,this.ship.posY);
                this.scene.time.delayedCall(500, ()=>{this.solarDrones[i].collectED.stopCollect();}, [], this);
            }
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

    private buildAnomalyPi(p : string, x: number, y: number, blackHoleAppears: boolean){

        let anomLock = this.system.add.term("AnomLock" + p, undefined);
        let sum = this.system.add.sum([
            this.system.add.channelIn('a'+p, '', '', 0.5). // chance of anomaly to appear
            next(anomLock),
            this.system.add.channelIn('locklock'+p,"a" + p).next(anomLock),
            this.system.add.channelIn('unlocklock'+p,"anomalyunlock" + p).next(anomLock)
        ]);
        anomLock.symbol = sum;
        this.system.pushSymbol(anomLock);

        let shotLock = this.system.add.term("Blocker" + p, undefined);
        let shot = this.system.add.sum([
            this.system.add.channelIn('shot'+p, '').
            channelIn('shieldp'+p, '',
                new BulletInfo(true, x, y + Math.random()*800 - 400)).next(shotLock),
            this.system.add.channelIn('shotlock'+p, "shot"+p).next(shotLock),
            this.system.add.channelIn('shotunlock'+p,"shotblock"+p).next(shotLock)
        ]);
        shotLock.symbol = shot;
        this.system.pushSymbol(shotLock);

        let anom = this.system.add.term("Anomalies"+p, undefined);
        let term = this.system.add.sum([
            this.system.add.channelInCB('eruption'+p, '', () => {this.createAnomaly("erupt")}).
            channelOut('unlocklock'+p, "a" + p).
            channelOut('shieldp'+p, '').
            channelOut('shieldp'+p, '').
            channelOut('shieldp'+p, '').
            channelIn('anomalyunlock'+p,'').
            channelIn('anomalyunlock'+p,'').
            channelIn('anomalyunlock'+p,'').
            channelOut('anlock'+p, "").
            next(anom),
            this.system.add.channelInCB('nanodrone'+p , '', () => {this.createAnomaly("nano")}).
            channelOut("newnano" + p, "solar" + p + "5").
            channelOut('unlocklock'+p, "a" + p).
            channelIn('anomalyunlock'+p,'').
            channelIn('anomalyunlock'+p,'').
            channelIn('anomalyunlock'+p,'').
            channelOut('anlock'+p, "").
            next(anom),
            this.system.add.channelIn('hole' + p, '').
            //channelOut('bHLock' + this.getOpponentsIdentifier(), "").
            channelOut('firstunlock'+p, "").
            channelOutCB('secondunlock'+p, "",() => {
                if (blackHoleAppears) this.createAnomaly("hole")
            }).
            channelOut('unlocklock'+p, "a" + p).
            //channelOut('unlocklock'+this.getOpponentsIdentifier(), "a" + p).
            channelOut('shotlock'+p,'shotblock'+p). // enable raising probability to block shot
            channelInCB('anomalyunlock'+p,'', () => {
                if (blackHoleAppears) this.currentAnomaly.scaleUp = -1;
            }).
            channelInCB('anomalyunlock'+p,'', () => {
                if (blackHoleAppears) this.currentAnomaly.scaleUp = -2;
            }).
            channelInCB('anomalyunlock'+p,'', () => {
                if (blackHoleAppears) this.currentAnomaly.scaleUp = -3;
            }).
            channelOut('shotunlock'+p,"shot"+p).  // disable raising probability to block shot
            channelOut('anlock'+p, "").
            next(anom)
        ]);
        anom.symbol = term;
        this.system.pushSymbol(anom);

        this.system.pushSymbol(this.system.add.channelOut('firstanomaly'+p, this.getAnomaly(0)+p).nullProcess());
        this.system.pushSymbol(this.system.add.channelOut('secanomaly'+p, this.getAnomaly(1)+p).nullProcess());

        /*if (blackHoleAppears){*/

            this.system.pushSymbol(this.system.add.channelOut('thirdanomaly'+p, this.getAnomaly(2)+p).nullProcess());

            this.system.pushSymbol(
                this.system.add./*channelIn('anomalyunlock'+p,'').channelIn('anomalyunlock'+p,'').
                channelIn('anomalyunlock'+p,'').channelIn('anomalyunlock'+p,'').*/
                channelOut('locklock'+p, "anomalyunlock" + p).
                channelIn('anomalyunlock'+p,'').                 // at least 5 rounds without anomaly at beginning
                channelIn('firstanomaly'+p,'anomaction0'+p).
                channelOut("anomaction0"+p,"").                 // start first anomaly
                channelIn('anlock'+p, "").
                channelOut('locklock'+p, "anomalyunlock" + p).
                channelIn('anomalyunlock'+p,'').
                channelIn('secanomaly'+p,'anomaction1'+p).
                channelOut("anomaction1"+p,"").                 // start second anomaly
                channelIn('anlock'+p, "").
                channelOut('locklock'+p, "anomalyunlock" + p).
                channelIn('anomalyunlock'+p,'').
                channelIn('thirdanomaly'+p,'anomaction2'+p).
                channelOut("anomaction2"+p,"").                 // start third anomaly
                channelIn('anlock'+p, "").
                channelOut('locklock'+p, "anomalyunlock" + p).nullProcess()
            );
            /*}
          /*else{
                this.system.pushSymbol(
                    this.system.add.channelIn('bHLock' + p, '').
                    channelOut('hole'+p, "").
                    channelIn('bHLock'+this.getOpponentsIdentifier(), '').
                    nullProcess()
                );

                this.system.pushSymbol(
                    this.system.add.channelIn('anomalyunlock'+p,'').channelIn('anomalyunlock'+p,'').
                    channelIn('anomalyunlock'+p,'').channelIn('anomalyunlock'+p,'').
                    channelOut('locklock'+p, "anomalyunlock" + p).
                    channelIn('anomalyunlock'+p,'').                // at least 5 rounds without anomaly at beginning
                    channelIn('firstanomaly'+p,'anomaction0'+p).
                    channelOut("anomaction0"+p,"").                 // start first anomaly
                    channelOut('unlocklock'+p, "a" + p).
                    channelIn('anlock'+p, "").
                    channelOut('locklock'+p, "anomalyunlock" + p).
                    channelIn('anomalyunlock'+p,'').
                    channelIn('secanomaly'+p,'anomaction1'+p).
                    channelOut("anomaction1"+p,"").                 // start second anomaly
                    channelOut('unlocklock'+p, "a" + p).
                    channelIn('anlock'+p, "").
                    channelOut('locklock'+p, "anomalyunlock" + p).nullProcess()
                );
            }*/

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
        channelOut("e0", "50").
        channelOut("e1", "25").
        channelOut("e2", "25").
        channelOut("e3", "25").
        channelOut("e4", "25").
        channelOut("nano5", "50").
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
            this.system.add.channelInCB("newnano" + p, "nano5", () => {
                this.createNanoDrone();
            }).
            channelOut("newShield" + p + "5","").
            next(drone),
            this.system.add.channelIn("dessol" + p + "1", "solar" + p + "1").
            next(drone),
            this.system.add.channelIn("dessol" + p + "2", "solar" + p + "2").
            next(drone),
            this.system.add.channelIn("dessol" + p + "3", "solar" + p + "3").
            next(drone),
            this.system.add.channelIn("dessol" + p + "4", "solar" + p + "4").
            next(drone),
            this.system.add.channelIn("dessol" + p + "nano", "solar" + p + "5").
            next(drone)
        ]);

        drone.symbol = sum;
        this.system.pushSymbol(drone);
    }

    private createFirstSolarDrone(p : string) : void{
        this.system.pushSymbol(this.system.add.channelOut("newsolar" + p + "0", "solar" + p + "0").nullProcess());
    }
}