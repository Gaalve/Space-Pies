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


export class Bot extends Player{

    public active: boolean;
    public weaponSlots: number;

    public possibleActions: BotAction[];
    public actions: BotAction[];

    public steps: number;

    public id: string;


    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem: PiSystem, pem: ParticleEmitterManager, bt: BattleTimeBar, blackHole: string){
        super(scene, x, y, nameIdentifier, isFirstPlayer, piSystem, pem, bt, blackHole);

        this.weaponSlots = 2;
        this.active = false;
        this.steps = 0;
        this.id = nameIdentifier.charAt(1);

        this.actions.splice(0, 0, new BotRegenerate("reg", this, 0));
        this.actions.splice(1, 0, new BotWext("wext", this, 0));
        this.actions.splice(2, 0, new BotMotor("motor", this, 0));
        this.actions.splice(3, 0, new BotWMod("wMod", this, this.getEnergyCost("wmod")));
        this.actions.splice(4, 0, new BotSolar("solar", this, this.getEnergyCost("solar")));
        this.actions.splice(5, 0, new BotEnd("end", this, 0));
    }

    public start(): void{
        while(this.active) {
            if(this.isDead){
                this.active = false;
                break;
            }

            this.steps++;

            this.updateExecutable();
            this.clearPosActions();
            this.getPossibleActions();
            this.chooseAction(this.steps*2000);
        }

    }

    public getPossibleActions(): void{
        for(let i = 0; i < 5; i++){
            if(this.actions[i].executable){
                this.possibleActions.push(this.actions[i]);
            }
        }
    }

    public clearPosActions(): void{
        this.possibleActions = [];
    }

    public updateExecutable(): void{
        for(let action of this.actions){
            action.checkExecutable();
        }
    }

    public chooseAction(delay: number): void{
        let x = Phaser.Math.Between(0, this.possibleActions.length-1);
        this.possibleActions[x].activate(delay);
    }
}