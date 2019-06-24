import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;
import Sprite = Phaser.GameObjects.Sprite;
import RandomZone = Phaser.GameObjects.Particles.Zones.RandomZone;


export class BlackholeParticle {
    private circle;
    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private blackholeEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        this.circle = new Phaser.Geom.Circle(960,540,300);

        this.blackholeEmitter = this.pem.createEmitter( {
            frame: "particle_1",
            moveToX: 960,
            moveToY: 540,
            speed: {min: 10, max: 50},
            tint: 0x000000,
            scale: {start: 0.3, end: 0.1},
            on: false,
            emitZone: new RandomZone(this.circle),
        });


    }

    public at(scale: number, amount: number ): void{

        this.setCollectConfig(scale);
        this.blackholeEmitter.emitParticle(amount);

    }


    private setCollectConfig(scale: number):void{
        this.circle = this.circle = new Phaser.Geom.Circle(960,540,500 * scale);
        this.blackholeEmitter.fromJSON({
                emitZone: new RandomZone(this.circle)
            }
        )
    }

}