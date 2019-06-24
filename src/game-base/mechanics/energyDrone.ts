import {Player} from "./player";
import {HealthbarSD} from "./health/healthbarSD";
import {Explosion} from "./animations/explosion";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {BulletInfo} from "./weapon/bulletInfo";
import {collectEnergy_Drones} from "./animations/collectEnergy_Drones";
import {NanoDrone} from "./nanoDrone";
import {PiAnimSystem} from "./pianim/pi-anim-system";


export class EnergyDrone extends Phaser.GameObjects.Sprite{

    protected player : Player;
    protected readonly index : number;
    protected piTerm : string;
    public health : HealthbarSD;
    public collectED:collectEnergy_Drones;



    public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, index : number, piAnim: PiAnimSystem,
                       pem: Phaser.GameObjects.Particles.ParticleEmitterManager, type?: string){
        super(scene, x, y, "ssr_solar_drone");
        if(player.getNameIdentifier() == "P2"){
            this.setTexture("ssb_solar_drone");
        }

        if(!type) type = "solar";

        //reposition external drones
        if(index == 1){
            if(player.getNameIdentifier() == "P1"){
                this.setPosition(x + 100, y - 400);
            }else{
                this.setPosition(x - 150, y - 400);
            }
        }else if(index == 2){
            if(player.getNameIdentifier() == "P1"){
                this.setPosition(x + 100, y + 400);
            }else{
                this.setPosition(x - 150, y + 400);
            }
        }
        else if(index == 3){
            if(player.getNameIdentifier() == "P1"){
                this.setPosition(x - 50, y - 450);
            }else{
                this.setPosition(x , y - 450);
            }
        }
        else if(index == 4){
            if(player.getNameIdentifier() == "P1"){
                this.setPosition(x - 50, y + 450);
            }else{
                this.setPosition(x , y + 450);
            }
        }
        else if(index == 5){
            if(player.getNameIdentifier() == "P1"){
                this.setPosition(x - 760, y + 280);
            }else{
                this.setPosition(x + 760, y + 280);
            }
        }

        this.player = player;
        this.index = index;
        this.collectED=new collectEnergy_Drones(pem);
        if(index > 0) {
            this.health = new HealthbarSD(scene, this.x, this.y, player.getNameIdentifier(), index, piAnim);
        }
        this.setVisible(false);
        scene.add.existing(this);

        this.buildPiTerm();
        this.createRepsSolarDrones(this.player.getNameIdentifier().charAt(1), this.index);
        if(this.index != 0 && type == "solar"){
            this.createSolarShields(this.player.getNameIdentifier().charAt(1), this.index);
        }

    }

    /**
     get number of solar drone (0: ship, 1: upper weapondrone, 2: lower weapondrone)
     */
    getIndex() : number{
        return this.index;
    }

    /**
     build pi Term that represents the solar drone and will be displayed on Screen
     */
    buildPiTerm() : void {
        if(this.visible || this.index == 0) {
            this.piTerm = "renergy" + this.player.getNameIdentifier().charAt(1);
        }
    }

    public toString() : string{
        return "lock(*)." + this.piTerm + "<*>.0";
    }

    public explode():void{
        this.player.activatedSolarDrones--;
        this.player.raiseEnergyCost("solar",-20);
        this.player.explosion.explosionAt(this.x,this.y);
        this.player.scene.time.delayedCall(300,()=>{this.setVisible(false); this.player.setSmallestIndexSD();},[],this);
    }

    private createRepsSolarDrones(p : string, sd : number){
        let d = sd.toString();
        let system = this.player.getSystem();

        system.pushSymbol(
            system.add.replication(
                system.add.channelInCB("solar" + p + d,"amount", (amount)=>{
                    this.player.gainEnergy(amount)})
                    .process('Enegry', ()=>{})));
    }

    private createSolarShields(p: string, sd: number){
        let d = sd.toString();
        let x = this.x;
        let y = this.y;
        let system = this.player.getSystem();

        let shield = system.add.term("SolarShield"+p+d, undefined);
        let term = system.add.channelIn("newShield"+p+d,"")
            .channelInCB("shieldp"+p,"",()=>{this.player.getSolarDrones()[sd].health.destroyBar()},
                new BulletInfo(false, x,y), 0.6)
            .channelInCB("shieldp"+p,"",()=>{this.player.getSolarDrones()[sd].health.destroyBar()},
                new BulletInfo(false, x,y), 0.6)
            .channelInCB("armorp"+p,"",()=>{this.player.getSolarDrones()[sd].health.destroyBar()},
                new BulletInfo(false, x,y),0.6)
            .channelOutCB("dessol"+p+d,"e"+d, ()=>{this.player.getSolarDrones()[sd].explode()})
            .next(shield);

        shield.symbol = term;
        system.pushSymbol(shield);
    }


}