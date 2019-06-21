import {EnergyDrone} from "./energyDrone";
import {Player} from "./player";
import {WormHole} from "./anomalies/worm-hole";
import {Anomaly} from "./anomalies/anomaly";
import {MainScene} from "../scenes/main-scene";
import {BulletInfo} from "./weapon/bulletInfo";


export class NanoDrone extends EnergyDrone {


    public constructor(scene : Phaser.Scene, player : Player, index : number, pem: Phaser.GameObjects.Particles.ParticleEmitterManager) {
        super(scene, 960, 540, player, index, pem, "nano");
        if(this.player.getNameIdentifier() == "P1"){
            this.setTexture("ssr_nuke_drone");
        }else{
            this.setTexture("ssb_nuke_drone");
        }

        let p = this.player.getNameIdentifier().charAt(1);
        this.createShields(p);
    }

    /**
     build pi Term that represents the solar drone and will be displayed on Screen
     */
    buildPiTerm() : void {
        if(this.visible || this.index == 0) {
            this.piTerm = "nano" + this.player.getNameIdentifier().charAt(1);
        }
    }

    public explode():void{
        this.explosion.explosionAt(this.x,this.y);
        this.player.scene.time.delayedCall(300,()=>{this.setVisible(false)},[],this);
    }

    private createShields(p: string){
        let x = this.x;
        let y = this.y;
        let system = this.player.getSystem();

        let shield = system.add.term("NanoShield"+p+"5", undefined);
        let term = system.add.channelIn("newShield"+p+"5","")
            .channelInCB("shieldp"+p,"",()=>{this.player.getSolarDrones()[5].health.destroyBar()},
            new BulletInfo(false, x,y), 0.6)
            .channelInCB("armorp"+p,"",()=>{this.player.getSolarDrones()[5].health.destroyBar()},
            new BulletInfo(false, x,y),0.6)
            .channelOutCB("dessol"+p+"nano","nano5", ()=>{this.player.getSolarDrones()[5].explode()})
            .channelOut('rocketp'+p, '').channelOut('rocketp'+p, '')
            .channelOut('rocketp'+p, '')
            .next(shield);

        shield.symbol = term;
        system.pushSymbol(shield);
    }

}