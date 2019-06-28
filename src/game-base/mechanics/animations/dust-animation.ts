import RandomZone = Phaser.GameObjects.Particles.Zones.RandomZone;
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;


export class DustAnimation {
    private circle;
    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private dustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        this.circle = new Phaser.Geom.Circle(960,540,300);

        this.dustEmitter = this.pem.createEmitter( {
            frame: "particle_1",
            speed: {min: 10, max: 50},
            tint: [0xc87137, 0x784421, 0x502d16],
            scale: {start: 0.7, end: 0.0},
            alpha: {start: 1.0, end: 0.0},
            on: false,
            emitZone: new RandomZone(this.circle),
        });


    }

    public at(x: number, y:number, radius: number, amount: number ): void{
        this.setCollectConfig(x, y, radius);
        this.dustEmitter.emitParticle(amount);
    }


    private setCollectConfig(x: number, y:number, radius: number):void{
        this.circle = this.circle = new Phaser.Geom.Circle(x, y, radius);
        this.dustEmitter.fromJSON({
                emitZone: new RandomZone(this.circle)
            }
        )
    }
}