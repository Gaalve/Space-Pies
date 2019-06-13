import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;
import Sprite = Phaser.GameObjects.Sprite;


export class collectEnergy_ship {
    private circle;
    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private collectEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private block;
    public constructor(pem: ParticleEmitterManager){
        /*this.block= this.physics.add.image(400, 100, 'ssr_ship');
        var source = {
            contains: function (x, y)
            {
                return block.body.hitTest(x, y);
            }
        };
        */

        this.pem = pem;
        let speedScale = 1;
        let lifeScale = 1;
        this.circle = new Phaser.Geom.Circle(400,300,500);

        //{ frames: [ 'red', 'green', 'blue' ], cycle: true, quantity: 2 }

        this.collectEmitter = this.pem.createEmitter( {
            frame: "particle_1",
            x: 0,
            y: 0,
            tint: 0x40FF00,
            moveToX: 400,
            moveToY: 600,
            lifespan: 1500,
            scale: 0.4,
            quantity: 3,
            blendMode: 'ADD',
            on: false,
            emitZone: { source: this.circle },
            //deathZone:{ type: 'onEnter', source: source }
        });
    }

    public collect(sx: number, sy: number): void{

        this.setCollectConfig(sx,sy);
        this.collectEmitter.emitParticle(10);


    }

    private setCollectConfig(sx: number, sy: number):void{
        this.circle = this.circle = new Phaser.Geom.Circle(sx,sy,500);
        this.collectEmitter.fromJSON({
            moveToX: sx,
            moveToY: sy,
            emitZone: { source: this.circle }
            }

        )
    }

}