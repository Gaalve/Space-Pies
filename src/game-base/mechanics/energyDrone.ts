import {Player} from "./player";
import {HealthbarSD} from "./health/healthbarSD";
import {Explosion} from "./animations/explosion";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {BulletInfo} from "./weapon/bulletInfo";


export class EnergyDrone extends Phaser.GameObjects.Sprite{

    private player : Player;
    private readonly index : number;
    private piTerm : string;
    public health : HealthbarSD;
    public explosion: Explosion;

    public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, index : number, pem: Phaser.GameObjects.Particles.ParticleEmitterManager){
        super(scene, x, y, "ssr_solar_drone");
        if(player.getNameIdentifier() == "P2"){
            this.setTexture("ssb_solar_drone");
        }
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

        this.player = player;
        this.index = index;
        this.explosion = new Explosion(pem);
        if(index > 0) {
            this.health = new HealthbarSD(scene, this.x, this.y, player.getNameIdentifier(), index);
        }
        this.setVisible(false);
        scene.add.existing(this);

        this.buildPiTerm();
        this.createRepsSolarDrones(this.player.getNameIdentifier().charAt(1), this.index);
        if(this.index != 0){
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
        this.explosion.explosionAt(this.x,this.y);
        this.player.scene.time.delayedCall(300,()=>{this.setVisible(false); this.player.setSmallestIndexSD();},[],this);
    }

    private createRepsSolarDrones(p : string, sd : number){
        let d = sd.toString();
        let system = this.player.getSystem();

        system.pushSymbol(
            system.add.replication(
                system.add.channelInCB("solar" + p + d,"amount", (amount)=>{
                    this.player.gainEnergy(amount)})
                    .nullProcess()));
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
            .channelInCB("armorp"+p,"",()=>{this.player.getSolarDrones()[sd].health.destroyBar()},
                new BulletInfo(false, x,y),0.6)
            .channelOutCB("dessol"+p+d,"e"+d, ()=>{this.player.getSolarDrones()[sd].explode()})
            .next(shield);

        shield.symbol = term;
        system.pushSymbol(shield);
    }

}