import {Player} from "../player";
import {PiSystem} from "../picalc/pi-system";
import {BattleTimeBar} from "../battleTimeBar";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {Botlog} from "./botlog";
import {parse} from "ts-node";


export class Bot extends Player{

    public active: boolean;
    public weaponSlots: number;
    public motorLaserSlots: number;
    public motorProjectileSlots: number;
    public motorRocketSlots: number;
    public wmodSlots: number;
    public droneSlots: number[];

    public possibleActions: string[];

    public activeSD: boolean[];
    public nrActiveSD: number;

    public steps: number;
    public id: string;

    public botLog: Botlog;

    public reg: string = "reg";
        public n: string = "nano";
        public ar: string = "armor";
        public s: string = "shield";
        public r: string = "rocket";
        public ad: string = "adap";
            public z1: string = "1";
            public z2: string = "2";
            public z3: string = "3";
            public z4: string = "4";
            public z1Active: boolean;
            public z2Active: boolean;
            public z3Active: boolean;
            public z4Active: boolean;

    public wext: string = "wext";
        public las: string = "armor";
        public pro: string = "shield";
        public roc: string = "rocket";

    public mot: string = "motor";
        public mlas: string = "laser";
        public mpro: string = "projectile";
        public mroc: string = "rocket";

    public wmod: string = "wmod";
    public solar: string = "solar";
    public end: string = "end";

    public botEnergy: number;
        private botShield: number;
        private botnano: number;
        private botWmod: number;
        private botWeapon: number;
        private botRocket: number;
        private botSolar: number;
        private botAdapt: number;
        private botMotor: number;
        private botRocketS: number;


    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem: PiSystem, pem: ParticleEmitterManager, bt: BattleTimeBar){
        super(scene, x, y, nameIdentifier, isFirstPlayer, piSystem, pem, bt);

        this.weaponSlots = 2;
        this.motorLaserSlots = 2;
        this.motorRocketSlots = 2;
        this.motorProjectileSlots = 2;
        this.wmodSlots = 2;
        this.activeSD = [];
        this.activeSD.push(false);
        this.activeSD.push(false);
        this.activeSD.push(false);
        this.activeSD.push(false);
        this.nrActiveSD = 0;

        this.z1Active = true;
        this.z2Active = true;
        this.z3Active = true;
        this.z4Active = true;

        this.droneSlots = [];
        this.droneSlots.splice(0,0, 2);
        this.droneSlots.splice(1,0, 3);
        this.droneSlots.splice(2,0, 3);

        this.botShield = this.getEnergyCost("armor");
        this.botnano = this.getEnergyCost("nano");
        this.botWmod = this.getEnergyCost("wmod");
        this.botWeapon = this.getEnergyCost("weapon");
        this.botRocket = this.getEnergyCost("rocketl");
        this.botSolar = this.getEnergyCost("solar");
        this.botAdapt = this.getEnergyCost("adap");
        this.botMotor = this.getEnergyCost("motor");
        this.botRocketS = this.getEnergyCost("rocket");
        this.botEnergy = this.getEnergy();

        this.active = false;
        this.steps = 0;
        this.id = nameIdentifier.charAt(1);

        this.botLog = new Botlog(this);
        this.botLog.setInvisible();
        this.possibleActions = [];
    }

    public start(): void{
        this.updateActiveSD();
        this.updateHitzones();
        this.botLog.clearLog();
        this.botLog.setVisible();
        this.active = true;
        this.botEnergy = this.getEnergy();

        while(this.active) {
            console.log("Energie: " + this.botEnergy);
            if(this.isDead){
                this.active = false;
                break;
            }
            this.steps++;
            let action = this.chooseAction();
            this.clearPosActions();
            this.chooseType(action, this.steps);
        }
    }

    public clearPosActions():void{
        while(this.possibleActions.length > 0){
            this.possibleActions.pop();
        }
    }


    public chooseAction(): string {
        if(this.botnano <= this.botEnergy ){
            this.possibleActions.push(this.reg);
        }
        if(this.botWeapon <= this.botEnergy && this.weaponSlots > 0){
            this.possibleActions.push(this.wext);
        }
        if(this.botMotor <= this.botEnergy && (this.motorLaserSlots > 0 || this.motorProjectileSlots > 0 || this.motorRocketSlots > 0)){
            this.possibleActions.push(this.mot);
        }
        if(this.botWmod <= this.botEnergy && this.wmodSlots > 0){
            this.possibleActions.push(this.wmod);
        }
        if(this.botSolar <= this.botEnergy && this.nrActiveSD < 5){
            this.possibleActions.push(this.solar);
        }

        let z = Phaser.Math.Between(1, 10);

        if(z > 9 || this.possibleActions.length == 0){
            return "end";
        }else{
            let x = Phaser.Math.Between(0, this.possibleActions.length-1);
            return this.possibleActions[x];
        }
    }

    public chooseType(action: string, step: number){
        let s = step.toString();
        let delay = step*2000;
        let system = this.getSystem();

        if(action == this.reg){
            let shield = this.chooseShieldType();
            this.clearPosActions();
            let hz = this.chooseHitzone();
            this.clearPosActions();
            this.buyShield(shield);

            this.scene.time.delayedCall(delay, () => {
                system.pushSymbol(system.add.channelOut("r" + shield + "p" + this.id + "z" + hz, "").nullProcess());
                if (shield == "shield") {
                    this.botLog.insertLog(s + ". I built a laser shield on hitzone " + hz + ".");
                } else if (shield == "adap") {
                    this.botLog.insertLog(s + ". I built an adaptive shield on hitzone " + hz + ".");
                } else if (shield == "armor") {
                    this.botLog.insertLog(s + ". I built an armor shield on hitzone " + hz + ".");
                } else {
                    this.botLog.insertLog(s + ". I built a " + shield + " shield on hitzone " + hz + ".");
                }
            }, [], this);

        }else if(action == this.wext){
            let weapon = this.chooseWeaponType();
            this.clearPosActions();
            let mod = this.chooseWeaponMod();
            this.clearPosActions();
            let nr = mod.toString() + (3-this.droneSlots[mod]).toString();
            this.droneSlots[mod]--;
            this.weaponSlots--;
            this.buyWeapon(weapon);

            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("wext" + this.id + nr, weapon + "p" + this.id).nullProcess());

                let w = "rocket launcher";
                if(weapon != "rocket") w = weapon == "armor" ? "laser weapon" : "projectile weapon";
                this.botLog.insertLog(s + ". I built a " + w + " on wmod " + mod + ".");
            },[], this);

        }else if(action == this.mot){
            let motor = this.chooseMotorType();
            this.clearPosActions();
            let nr = this.getMotorNr(motor);
            this.buyUpgrade(this.botMotor);

            this.scene.time.delayedCall(delay,()=> {
                system.pushSymbol(system.add.channelOut("buymotor" + motor + this.id + nr, "").nullProcess());
                this.botLog.insertLog(s + ". I built a " + motor + " motor.");
            },[], this);
            if(motor == this.mlas) this.motorLaserSlots--;
            if(motor == this.mpro) this.motorProjectileSlots--;
            if(motor == this.mroc) this.motorRocketSlots--;

        }else if(action == this.wmod){
            let nr = (3-this.wmodSlots).toString();
            this.weaponSlots += 3;
            this.wmodSlots--;
            this.buyUpgrade(this.botWmod);
            this.updateWmodCost();

            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("wmod" + this.id + nr, "").nullProcess());
                this.botLog.insertLog(s + ". I built a weapon mod.");
            }, [], this);


        }else if(action == this.solar){
            let nr = this.getSolarNr();
            this.activeSD[parseInt(nr)-1] = true;
            this.buyUpgrade(this.botSolar);
            this.updateSolarCost();

            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("newsolar" + this.id + nr, "").nullProcess());
                this.botLog.insertLog(s + ". I built a solar drone.");
            }, [], this);

        }else if(action == this.end){
            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("botend", "").nullProcess());
                this.botLog.insertLog(s + ". I´m finished. It´s your turn.");
            }, [], this);
            this.scene.time.delayedCall(delay + 1000, ()=>this.botLog.setInvisible(), [], this);
            this.active = false;
            this.steps = 0;
            }
        }

    public chooseShieldType(): string{
        this.possibleActions.push(this.n);
        if(this.botShield <= this.botEnergy) {
            this.possibleActions.push(this.ar);
            this.possibleActions.push(this.s);
        }
        if(this.botShield <= this.botEnergy) this.possibleActions.push(this.r);
        if(this.botAdapt <= this.botEnergy) this.possibleActions.push(this.ad);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1);
        return this.possibleActions[x];
    }

    public chooseHitzone(): string{
        if(this.z1Active) this.possibleActions.push(this.z1);
        if(this.z2Active) this.possibleActions.push(this.z2);
        if(this.z3Active) this.possibleActions.push(this.z3);
        if(this.z4Active) this.possibleActions.push(this.z4);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1)
        return this.possibleActions[x];
    }

    public chooseWeaponType(): string{
        if(this.botWeapon <= this.botEnergy) {this.possibleActions.push(this.las); this.possibleActions.push(this.pro)}
        if(this.botRocket <= this.botEnergy) this.possibleActions.push(this.roc);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1);
        return this.possibleActions[x];
    }

    public chooseWeaponMod(): number{

        let mod0 = false;
        let mod1 = false;
        let mod2 = false;

        if(this.droneSlots[0] > 0) mod0 = true;
        if(this.droneSlots[1] > 0) mod1 = true;
        if(this.droneSlots[2] > 0) mod2 = true;

        if(mod0) this.possibleActions.push("0");
        if(mod1 && this.wmodSlots == 1) this.possibleActions.push("1");
        if(mod2 && this.wmodSlots == 0) this.possibleActions.push("2");

        let x = Phaser.Math.Between(0, this.possibleActions.length-1);
        return parseInt(this.possibleActions[x]);

    }

    public chooseMotorType(): string{

        if(this.motorRocketSlots < 3) this.possibleActions.push(this.mroc);
        if(this.motorProjectileSlots < 3) this.possibleActions.push(this.mpro);
        if(this.motorLaserSlots < 3) this.possibleActions.push(this.mlas);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1);
        return this.possibleActions[x];
    }

    public getMotorNr(type: string): string{

        switch(type){
            case("laser"):{
                return (3-this.motorLaserSlots).toString();
            }
            case("projectile"):{
                return(3-this.motorProjectileSlots).toString();
            }
            case("rocket"):{
                return (3-this.motorRocketSlots).toString();
            }
        }
    }

    public getSolarNr(): string{
        let nr = "";
        for(let i = 3; i>=0; i--){
            if(!this.activeSD[i]) nr = (i+1).toString();
        }
        return nr;
    }

    public getBotLog(): Botlog {
        return this.botLog;
    }

    public buyUpgrade(x: number): void{
        this.botEnergy -= x;
    }

    public buyShield(type: string): void{
        switch(type){
            case(this.n):{
                this.botEnergy -= this.botnano;
                break
            }
            case(this.ar):{
                this.botEnergy -= this.botShield;
                break
            }
            case(this.s):{
                this.botEnergy -= this.botShield;
                break
            }
            case(this.ad):{
                this.botEnergy -= this.botAdapt;
                break
            }
            case(this.r):{
                this.botEnergy -= this.botRocketS;
                break
            }
        }
    }

    public buyWeapon(type: string): void{
        switch(type){
            case(this.pro):{
                this.botEnergy -= this.botWeapon;
                break
            }
            case(this.las):{
                this.botEnergy -= this.botWeapon;
                break
            }
            case(this.roc): {
                this.botEnergy -= this.botRocket;
                break
            }
        }
    }

    public updateWmodCost(): void{
        this.botWmod += 15;
    }
    public updateSolarCost(): void{
        this.botSolar += 20;
    }

    public updateActiveSD(): void{
        this.nrActiveSD = 0;
        for(let i = 1; i <= 4; i++){
            if(this.getSolarDrones()[i].visible){
                this.activeSD[i-1] = true;
                this.nrActiveSD++;
            }
        }
        this.botSolar = this.getEnergyCost("solar") + (this.nrActiveSD*20);
    }

    public updateHitzones(): void{
        if(this.z1Destroyed) this.z1Active = false;
        if(this.z2Destroyed) this.z2Active = false;
        if(this.z3Destroyed) this.z3Active = false;
        if(this.z4Destroyed) this.z4Active = false;
    }
}