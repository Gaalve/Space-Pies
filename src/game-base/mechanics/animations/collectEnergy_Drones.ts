import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;
import Sprite = Phaser.GameObjects.Sprite;


export class collectEnergy_Drones {
    private circle;
    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private collectEmit: Phaser.GameObjects.Particles.ParticleEmitter;
    public constructor(pem: ParticleEmitterManager){


        this.pem = pem;
        this.circle = new Phaser.Geom.Circle(0,0,100);


        this.collectEmit = this.pem.createEmitter( {
            frame: "particle_1",
            moveToX:0,
            moveToY:0,
            tint: [0xffcc00, 0xffd42a, 0xffdd55],
            scale: {start: 0.6, end: 0},
            lifespan: {min: 320, max: 1100},
            quantity: 1,
            frequency:20,
            on: false,
            emitZone: { source: this.circle }
            //deathZone:{ type: 'onEnter', source: source }
        });


    }

    public collect(sx:number,sy:number,ex:number,ey:number): void{
        this.setCollectConfig(sx,sy,ex,ey);
        this.collectEmit.start()

    }


    public stopCollect():void{
        this.collectEmit.stop();
    }

    private setCollectConfig(sx:number,sy:number,ex:number,ey:number):void{
        this.circle = this.circle = new Phaser.Geom.Circle(sx,sy,80);
        this.collectEmit.fromJSON({
                moveToX: ex,
                moveToY: ey,
                emitZone: { source: this.circle }
            }

        )
    }
}