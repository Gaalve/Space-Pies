import {EnergyDrone} from "./energyDrone";
import {Player} from "./player";
import {BulletInfo} from "./weapon/bulletInfo";
import {Infobox} from "./Infobox";


export class NanoDrone extends EnergyDrone {

    private infobox: Infobox;
    public exists: boolean;

    public constructor(scene : Phaser.Scene, player : Player, index : number, pem: Phaser.GameObjects.Particles.ParticleEmitterManager) {
        super(scene, 960, 540, player, index, pem, "nano");
        if(this.player.getNameIdentifier() == "P1"){
            this.setTexture("ssr_nuke_drone");
        }else{
            this.setTexture("ssb_nuke_drone");
        }
        this.exists = false;

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
        this.player.explosion.explosionAt(this.x,this.y);
        this.player.scene.time.delayedCall(300,()=>{this.setVisible(false)},[],this);
    }

    public refreshInfoBox(){

        if (this.exists){
            this.infobox = <Infobox> this.scene.data.get("infoboxx");
            this.infobox.addTooltipInfo(this,
                "[" + this.player.getNameIdentifier() + "] Nuclear Drone:\n" +
                " This drone generates 50 energy points. But it also has a negative effect.\n" +
                " If it will be destroyed, then it is going to send out 3 rockets, that may\n" +
                " destroy some of your armors or shields."
            );
        }
        else{
            this.infobox = undefined;
        }
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
            .channelOutCB("dessol"+p+"nano","nano5", ()=>{
                this.player.getSolarDrones()[5].explode();
                this.exists = false;
                this.refreshInfoBox();
            })
            .channelOut('rocketp'+p, '')
            .channelOut('rocketp'+p, '')
            .channelOut('rocketp'+p, '')
            .next(shield);

        shield.symbol = term;
        system.pushSymbol(shield);
    }

}