import {Player} from "../player";
import {PiSystem} from "../picalc/pi-system";
import {BattleTimeBar} from "../battleTimeBar";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {Botlog} from "./botlog";


export class Bot extends Player{

    public active: boolean;
    public weaponSlots: number;
    public motorLaserSlots: number;
    public motorProjectileSlots: number;
    public motorRocketSlots: number;

    public possibleActions: string[];

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


    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem: PiSystem, pem: ParticleEmitterManager, bt: BattleTimeBar){
        super(scene, x, y, nameIdentifier, isFirstPlayer, piSystem, pem, bt);

        this.weaponSlots = 2;
        this.motorLaserSlots = 2;
        this.motorRocketSlots = 2;
        this.motorProjectileSlots = 2;

        this.active = false;
        this.steps = 0;
        this.id = nameIdentifier.charAt(1);

        this.botLog = new Botlog(this);
        this.botLog.setInvisible();
        this.possibleActions = [];
    }

    public start(): void{
        this.botLog.clearLog();
        this.botLog.setVisible();
        this.active = true;

        while(this.active) {
            this.clearPosActions();
            if(this.isDead){
                this.active = false;
                break;
            }
            this.steps++;
            this.getPossibleActions();
            let action = this.chooseAction();
            this.clearPosActions();
            this.chooseType(action, this.steps);

        }
    }

    public getPossibleActions(): void{
        if(this.getEnergyCost("nano") <= this.getEnergy()){
            this.possibleActions.push(this.reg);
        }
        if(this.getEnergyCost("weapon") <= this.getEnergy() && this.weaponSlots > 0){
            this.possibleActions.push(this.wext);
        }
        if(this.getEnergyCost("motor") <= this.getEnergy() && (this.motorLaserSlots > 0 || this.motorProjectileSlots > 0 || this.motorRocketSlots > 0)){
            this.possibleActions.push(this.mot);
        }
        if(this.getEnergyCost("wmod") <= this.getEnergy() && this.getNrDrones() < 3){
            this.possibleActions.push(this.wmod);
        }
        if(this.getEnergyCost("solar") <= this.getEnergy() && this.getNrSolarDrones() < 4){
            this.possibleActions.push(this.solar);
        }
    }

    public clearPosActions():void{
        while(this.possibleActions.length > 0){
            this.possibleActions.pop();
        }
    }


    public chooseAction(): string {
        let z = Phaser.Math.Between(1, 10);

        if(z > 90 || this.possibleActions.length == 0){
            return "end";
        }else{
            let x = Phaser.Math.Between(0, this.possibleActions.length-1)
            return this.possibleActions[x];
        }
    }

    public chooseType(action: string, step: number){
        let s = step.toString();
        let system = this.getSystem();

        switch(action){
            case("reg"):{
                let shield = this.chooseShieldType();
                this.clearPosActions();
                let hz = this.chooseHitzone();
                this.clearPosActions();

                system.pushSymbol(system.add.channelOut("r" + shield + "p" + this.id + "z" + hz, "").nullProcess());

                if(shield == "shield") {
                    this.botLog.insertLog(s + ". I built a laser shield on hitzone " + hz + ".");
                }else if(shield == "adap"){
                    this.botLog.insertLog(s + ". I built an adaptive shield on hitzone " + hz + ".");
                }else if(shield == "armor"){
                    this.botLog.insertLog(s + ". I built an armor shield on hitzone " + hz + ".");
                }else{
                    this.botLog.insertLog(s + ". I built a " + shield + " shield on hitzone " + hz + ".");
                }
                break;
            }
            case("wext"):{
                let weapon = this.chooseWeaponType();
                this.clearPosActions();
                let mod = this.chooseWeaponMod();
                this.clearPosActions();

                system.pushSymbol(system.add.channelOut("wext" + this.id + mod, "").nullProcess());

                let w = "rocket launcher";
                if(weapon != "rocket"){
                    w = weapon == "armor" ? "laser weapon" : "projectile weapon";
                }
                this.botLog.insertLog(s + ". I built a " + w + " on weapon mod " + mod + ".");
                this.weaponSlots--;
                break;
            }
            case("motor"):{
                let motor = this.chooseMotorType();

                this.clearPosActions();
                if(motor == this.mlas) this.motorLaserSlots--;
                if(motor == this.mpro) this.motorProjectileSlots--;
                if(motor == this.mroc) this.motorRocketSlots--;

                let nr = this.getMotorNr(motor);

                system.pushSymbol(system.add.channelOut("buymotor" + motor + this.id + nr, "").nullProcess());
                this.botLog.insertLog(s + ". I built a " + motor + " motor.");
                break;
            }
            case("wmod"):{
                system.pushSymbol(system.add.channelOut("wmod" + this.id + this.getNrDrones(), "").nullProcess());
                this.botLog.insertLog(s + ". I built a weapon mod.");
                this.weaponSlots += 3;
                break;
            }
            case("solar"):{
                system.pushSymbol(system.add.channelOut("newsolar" + this.id + this.getNrSolarDrones(), "").nullProcess());
                this.botLog.insertLog(s + ". I built a solar drone.");
                break;
            }
            case("end"):{
                system.pushSymbol(system.add.channelOut("botend", "").nullProcess());
                this.botLog.insertLog(s + ". I´m finished. It´s your turn.");
                break;
            }
        }
    }

    public chooseShieldType(): string{
        if(this.getEnergyCost("nano") <= this.getEnergy()) this.possibleActions.push(this.n);
        if(this.getEnergyCost("armor") <= this.getEnergy()) this.possibleActions.push(this.ar);
        if(this.getEnergyCost("shield") <= this.getEnergy()) this.possibleActions.push(this.s);
        if(this.getEnergyCost("rocket") <= this.getEnergy()) this.possibleActions.push(this.r);
        if(this.getEnergyCost("adap") <= this.getEnergy()) this.possibleActions.push(this.ad);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1)
        return this.possibleActions[x];
    }

    public chooseHitzone(): string{
        if(!this.z1Destroyed) this.possibleActions.push(this.z1);
        if(!this.z2Destroyed) this.possibleActions.push(this.z2);
        if(!this.z3Destroyed) this.possibleActions.push(this.z3);
        if(!this.z4Destroyed) this.possibleActions.push(this.z4);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1)
        return this.possibleActions[x];
    }

    public chooseWeaponType(): string{
        if(this.getEnergyCost("weapon") <= this.getEnergy()) {this.possibleActions.push(this.las); this.possibleActions.push(this.pro)}
        if(this.getEnergyCost("rocketl") <= this.getEnergy()) this.possibleActions.push(this.roc);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1)
        return this.possibleActions[x];
    }

    public chooseWeaponMod(): string{

        let mod0 = false;
        let mod1 = false;
        let mod2 = false;

        for (let w of this.getDrones()[0].getWeapons()){if(!w.visible) mod0 = true;}
        for (let w of this.getDrones()[1].getWeapons()){if(!w.visible) mod1 = true;}
        for (let w of this.getDrones()[2].getWeapons()){if(!w.visible) mod2 = true;}

        if(mod0) this.possibleActions.push("0");
        if(mod1 && this.getNrDrones() == 2) this.possibleActions.push("1");
        if(mod2 && this.getNrDrones() == 3) this.possibleActions.push("2");

        let x = Phaser.Math.Between(0, this.possibleActions.length-1);
        return this.possibleActions[x];

    }

    public chooseMotorType(): string{

        if(this.motorRocketSlots < 3) this.possibleActions.push(this.mroc);
        if(this.motorProjectileSlots < 3) this.possibleActions.push(this.mpro);
        if(this.motorLaserSlots < 3) this.possibleActions.push(this.mlas);

        let x = Phaser.Math.Between(0, this.possibleActions.length-1);
        return this.possibleActions[x];
    }

    public getMotorNr(type: string): string{
        let p1 = this.id == "1";

        switch(type){
            case("laser"):{
                if(p1){
                    return this.motor.getactiveMotorLaserP1().toString();
                }else{
                    return this.motor.getactiveMotorLaserP2().toString();
                }
            }
            case("projectile"):{
                if(p1){
                    return this.motor.getactiveMotorProjectileP1().toString();
                }else{
                    return this.motor.getactiveMotorProjectileP2().toString();
                }
            }
            case("rocket"):{
                if(p1){
                    return this.motor.getactiveMotorRocketP1().toString();
                }else{
                    return this.motor.getactiveMotorRocketP2().toString();
                }
            }
        }
    }


    public getBotLog(): Botlog {
        return this.botLog;
    }
}