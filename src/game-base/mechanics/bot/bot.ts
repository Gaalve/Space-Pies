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

    public displayedEnergy: number;

    public possibleActions: string[];

    public activeSD: boolean[];
    public nrActiveSD: number;

    public steps: number;
    public id: string;
    public opId : string;

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

    public botRegenRate: number;
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

    private bubble: Phaser.GameObjects.Sprite;
    private bubbleText: Phaser.GameObjects.Text;


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
        this.botRegenRate = 50;
        this.displayedEnergy = this.botEnergy;

        this.active = false;
        this.steps = 0;
        this.id = nameIdentifier.charAt(1);
        this.opId = nameIdentifier.charAt(1) == "1" ? "2" : "1";

        this.botLog = new Botlog(this);
        this.botLog.setInvisible();
        this.possibleActions = [];

        this.bubble = new Phaser.GameObjects.Sprite(this.scene, 1920/2 + 350, 1080/2 - 170, "intro_textbox_scream");
        this.bubble.flipX = true;
        this.scene.add.existing(this.bubble);
        this.bubble.setVisible(false);

        this.bubbleText = new Phaser.GameObjects.Text(this.scene, 1920/2 + 365, 1080/2 - 185, "You win!\nThis time...",
            {fill: '#000', fontFamily: '"Roboto"', fontSize: 32, strokeThickness: 4});
        this.bubbleText.setOrigin(0.5,0.5);
        this.scene.add.existing(this.bubbleText);
        this.bubbleText.setVisible(false);
    }

    public start(): void{
        this.updateActiveSD();
        this.updateRegenRate();
        this.updateHitzones();
        this.displayedEnergy = this.botEnergy;
        this.botLog.clearLog();
        this.botLog.setVisible();
        this.botLog.updateEnergy(this.displayedEnergy, this.botRegenRate);
        this.botLog.setLogoVisible();
        this.botLog.insertLog("Started with " + this.displayedEnergy + " Energy.");
        this.active = true;

        while(this.active) {
            if(this.isDead){
                this.active = false;
                this.createBubble();
                break;
            }
            this.steps++;
            let action = this.chooseAction();
            this.clearPosActions();
            this.chooseType(action, this.steps);
        }
        this.updateActiveSD();
        this.updateRegenRate();
        this.regenEnergy();
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
            let x = this.buyShield(shield);

            this.scene.time.delayedCall(delay, () => {
                system.pushSymbol(system.add.channelOut("r" + shield + "p" + this.id + "z" + hz, "").nullProcess());
                if (shield == "shield") {
                    this.botLog.insertLog(s + ". I built a laser shield on hitzone " + hz + ". (-" + x + " E.)");
                } else if (shield == "adap") {
                    this.botLog.insertLog(s + ". I built an adaptive shield on hitzone " + hz + ". (-" + x + " E.)");
                } else if (shield == "armor") {
                    this.botLog.insertLog(s + ". I built an armor shield on hitzone " + hz + ". (-" + x + " E.)");
                } else {
                    this.botLog.insertLog(s + ". I built a " + shield + " shield on hitzone " + hz + ". (-" + x + " E.)");
                }
                this.reduceDisplayedEnergy(x);
                this.botLog.updateEnergy(this.displayedEnergy, this.botRegenRate);
            }, [], this);

        }else if(action == this.wext){
            let weapon = this.chooseWeaponType();
            this.clearPosActions();
            let mod = this.chooseWeaponMod();
            this.clearPosActions();
            let nr = mod.toString() + (3-this.droneSlots[mod]).toString();
            this.droneSlots[mod]--;
            this.weaponSlots--;
            let x = this.buyWeapon(weapon);

            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("wext" + this.id + nr, weapon + "p" + this.opId).nullProcess());

                let w = "rocket launcher";
                if(weapon != "rocket") w = weapon == "armor" ? "laser weapon" : "projectile weapon";
                this.botLog.insertLog(s + ". I built a " + w + " on wmod " + mod + ". (-" + x + " E.)");
                this.reduceDisplayedEnergy(x);
                this.botLog.updateEnergy(this.displayedEnergy, this.botRegenRate);
            },[], this);

        }else if(action == this.mot){
            let motor = this.chooseMotorType();
            this.clearPosActions();
            let nr = this.getMotorNr(motor);
            let x = this.buyUpgrade(this.botMotor);

            this.scene.time.delayedCall(delay,()=> {
                system.pushSymbol(system.add.channelOut("buymotor" + motor + this.id + nr, "").nullProcess());
                this.botLog.insertLog(s + ". I built a " + motor + " motor. (-" + x + " E.)");
                this.reduceDisplayedEnergy(x);
                this.botLog.updateEnergy(this.displayedEnergy, this.botRegenRate);
            },[], this);
            if(motor == this.mlas) this.motorLaserSlots--;
            if(motor == this.mpro) this.motorProjectileSlots--;
            if(motor == this.mroc) this.motorRocketSlots--;

        }else if(action == this.wmod){
            let nr = (3-this.wmodSlots).toString();
            this.weaponSlots += 3;
            this.wmodSlots--;
            let x = this.buyUpgrade(this.botWmod);

            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("wmod" + this.id + nr, "").nullProcess());
                this.botLog.insertLog(s + ". I built a weapon mod. (-" + x + " E.)");
                this.reduceDisplayedEnergy(x);
                this.botLog.updateEnergy(this.displayedEnergy, this.botRegenRate);
            }, [], this);

            this.updateWmodCost();

        }else if(action == this.solar){
            let nr = this.getSolarNr();
            this.activeSD[parseInt(nr)-1] = true;
            let x = this.buyUpgrade(this.botSolar);
            this.nrActiveSD++;
            this.updateRegenRate();

            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("newsolar" + this.id + nr, "").nullProcess());
                this.botLog.insertLog(s + ". I built a solar drone. (-" + x + " E.)");
                this.reduceDisplayedEnergy(x);
                this.botLog.updateEnergy(this.displayedEnergy, this.botRegenRate);
            }, [], this);

            this.updateSolarCost();

        }else if(action == this.end){
            this.scene.time.delayedCall(delay, ()=> {
                system.pushSymbol(system.add.channelOut("botend", "").nullProcess());
                this.botLog.insertLog(s + ". I´m finished. It´s your turn.");
                this.botLog.insertLog("Finished with " + this.displayedEnergy + " Energy.");

            }, [], this);
            this.scene.time.delayedCall(delay + 1500, ()=>{this.botLog.setInvisible(); this.botLog.setLogoInvisible()}, [], this);
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

    public buyUpgrade(x: number): number{
        this.botEnergy -= x;
        return x;
    }

    public buyShield(type: string): number{
        switch(type){
            case(this.n):{
                this.botEnergy -= this.botnano;
                return this.botnano
            }
            case(this.ar):{
                this.botEnergy -= this.botShield;
                return this.botShield
            }
            case(this.s):{
                this.botEnergy -= this.botShield;
                return this.botShield
            }
            case(this.ad):{
                this.botEnergy -= this.botAdapt;
                return this.botAdapt
            }
            case(this.r):{
                this.botEnergy -= this.botRocketS;
                return this.botRocketS
            }
        }
    }

    public buyWeapon(type: string): number{
        switch(type){
            case(this.pro):{
                this.botEnergy -= this.botWeapon;
                return this.botWeapon
            }
            case(this.las):{
                this.botEnergy -= this.botWeapon;
                return this.botWeapon
            }
            case(this.roc): {
                this.botEnergy -= this.botRocket;
                return this.botRocket
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
        this.botSolar = 60 + (this.nrActiveSD*20);
    }

    public updateHitzones(): void{
        if(this.getHealth().zone1Bar.activeBars <= 0) this.z1Active = false;
        if(this.getHealth().zone2Bar.activeBars <= 0) this.z2Active = false;
        if(this.getHealth().zone3Bar.activeBars <= 0) this.z3Active = false;
        if(this.getHealth().zone4Bar.activeBars <= 0) this.z4Active = false;
    }

    public regenEnergy(): void{

        this.botEnergy += this.botRegenRate;
    }

    public updateRegenRate(): void{
        let nd = 0;
        if(this.getSolarDrones()[5].visible) nd = 50;
        this.botRegenRate = (50 + this.nrActiveSD*25 + nd);
    }

    public reduceDisplayedEnergy(x: number): void{
        this.displayedEnergy -= x;
    }

    public createBubble(): void{
        if(this.id == "2") {
            this.bubble.flipX = false;
            this.bubble.setPosition(1920 / 2 - 350, 1080 / 2 - 170)
            this.bubbleText.setPosition(1920 / 2 - 350, 1080 / 2 - 185);
        }
        this.bubble.setVisible(true);
        this.bubbleText.setVisible(true);
    }
}