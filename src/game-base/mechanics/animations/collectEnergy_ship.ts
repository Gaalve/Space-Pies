import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;
import Sprite = Phaser.GameObjects.Sprite;
import RandomZone = Phaser.GameObjects.Particles.Zones.RandomZone;


export class collectEnergy_ship {
    private circle;
    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private collectEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        this.circle = new Phaser.Geom.Circle(400,300,500);

        this.collectEmitter = this.pem.createEmitter( {
            frame: "particle_1",
            moveToX: 0,
            moveToY: 0,
            tint: 0xffd42a,
            scale: {start: 0.6, end: 0},
            on: false,
            emitZone: new RandomZone(this.circle),
        });
    }

    public collect(sx: number, sy: number): void{
        this.setCollectConfig(sx,sy);
        this.collectEmitter.emitParticle(50);
    }


    private setCollectConfig(sx: number, sy: number):void{
        this.circle = this.circle = new Phaser.Geom.Circle(sx,sy,500);
        this.collectEmitter.fromJSON({
            moveToX: sx,
            moveToY: sy,
            emitZone: new RandomZone(this.circle)
            }
        )
    }

}