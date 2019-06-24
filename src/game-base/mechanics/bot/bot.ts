import {Player} from "../player";
import {PiSystem} from "../picalc/pi-system";
import {BattleTimeBar} from "../battleTimeBar";
import {BotRegenerate} from "./botregenerate";
import {BotWext} from "./botwext";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {BotWMod} from "./botwmod";
import {BotSolar} from "./botsolar";
import {BotEnd} from "./botend";
import {BotAction} from "./botaction";
import {BotMotor} from "./botmotor";
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
            if(this.isDead){
                this.active = false;
                break;
            }

            this.steps++;
            this.getPossibleActions();
            let action = this.chooseAction();
            this.possibleActions = [];
            this.chooseType(action, this.steps);
        }
    }

    public getPossibleActions(): void{
        if(this.getEnergyCost("nano") <= this.getEnergy()){
            this.possibleActions.push("reg");
        }
        if(this.getEnergyCost("weapon") <= this.getEnergy() && this.weaponSlots > 0){
            this.possibleActions.push("wext");
        }
        if(this.getEnergyCost("motor") <= this.getEnergy() && (this.motorLaserSlots > 0 || this.motorProjectileSlots > 0 || this.motorRocketSlots > 0)){
            this.possibleActions.push("motor");
        }
        if(this.getEnergyCost("wmod") <= this.getEnergy() && this.getNrDrones() < 3){
            this.possibleActions.push("wmod");
        }
        if(this.getEnergyCost("solar") <= this.getEnergy() && this.getNrSolarDrones() < 4){
            this.possibleActions.push("solar");
        }
        this.possibleActions.push("end");
    }


    public chooseAction(): string {
        let z = Phaser.Math.Between(1, 10)

        if(z > 90 || this.possibleActions.length == 1){
            return "end";
        }else{
            let x = Phaser.Math.Between(0, this.possibleActions.length-2)
            return this.possibleActions[x];
        }
    }

    public chooseType(action: string, step: number){
        let system = this.getSystem();

        switch(action){
            case("reg"):{

                break;
            }
            case("wext"):{

                break;
            }
            case("motor"):{

                break;
            }
            case("wmod"):{
                system.pushSymbol(system.add.channelOut("wmod" + this.id + this.getNrDrones(), "").nullProcess());
                this.botLog.insertLog(step + ". I built a weapon mod.");
                break;
            }
            case("solar"):{
                system.pushSymbol(system.add.channelOut("newsolar" + this.id + this.getNrSolarDrones(), "").nullProcess());
                this.botLog.insertLog(step + ". I built a solar drone.");
                break;
            }
            case("end"):{
                system.pushSymbol(system.add.channelOut("botend", "").nullProcess());
                this.botLog.insertLog(step + ". I´m finished. It´s your turn.");
                break;
            }
        }
    }

    public chooseShieldType(): void{

    }

    public chooseWeaponMod(): void{

    }

    public chooseMotorType(): void{

    }


    public getBotLog(): Botlog {
        return this.botLog;
    }
}