import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;


export class BulletTrail {

    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private bulletSpark: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        let speedScale = 1;
        let lifeScale = 1;
        this.bulletSpark = this.pem.createEmitter( {
            x: 0, y: 0,  tint: 0xffffffff,
            angle: {min: 50 - 13, max: 50 - 3},
            speed: {min: 5*speedScale, max: 120*speedScale},
            alpha: 0.5,
            radial: true,
            rotate: BulletTrail.angleUpdate,
            scale: (particle, key, t) => (t > 0.2 ? 1-(t - 0.2)*(1.0/0.8) : 1)*0.15,
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false, frame: "particle_2"});
    }

    public trailAt(sx: number, sy: number, ex: number, ey: number, lifeScale: number = 1, speedScale: number = 1, trailAngle: number): void{
        // trailAngle += 180;
        this.setTrailConfig(trailAngle, lifeScale, speedScale);
        for (let i = 0; i < 5 ; i++) {
            let x = sx + (ex - sx)*Math.random()*0.75;
            let y = sy + (ey - sy)*Math.random()*0.75;
            this.bulletSpark.emitParticle(1, x, y);
        }
    }

    private setTrailConfig(trailAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        const angleOffset = 5;
        this.bulletSpark.fromJSON({
            angle: {min: trailAngle - angleOffset, max: trailAngle + angleOffset},
            speed: {min: 50*speedScale, max: 150*speedScale},
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
    }


    static angleUpdate(particle: Particle, key, t, value){
        return t == 0 ? Phaser.Math.Angle.Between(0,0,particle.velocityX, particle.velocityY) * Phaser.Math.RAD_TO_DEG : value;
    }
}