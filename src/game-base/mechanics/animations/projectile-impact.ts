import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;


export class ProjectileImpact {

    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private bulletSpark: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        let speedScale = 1;
        let lifeScale = 1;
        this.bulletSpark = this.pem.createEmitter( {
            x: 0, y: 0,  tint: [0xffff7f2a, 0xffffb380, 0xffffd42a, 0xffeeaa],
            angle: {min: 50 - 13, max: 50 - 3},
            speed: {min: 5*speedScale, max: 120*speedScale},
            alpha: 0.35,
            radial: true,
            rotate: ProjectileImpact.angleUpdate,
            scale: (particle, key, t) => (t > 0.2 ? 1-(t - 0.2)*(1.0/0.8) : 1)*0.55,
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false, frame: "particle_2"});
    }

    public impactAt(x: number, y: number, lifeScale: number = 1, speedScale: number = 1, impactAngle: number): void{
        impactAngle += 180;
        this.setImpactConfig(impactAngle, lifeScale, speedScale);
        this.bulletSpark.emitParticle(50, x, y);
    }

    private setImpactConfig(impactAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.bulletSpark.fromJSON({
            angle: {min: impactAngle - 20, max: impactAngle + 20},
            speed: {min: 50*speedScale, max: 200*speedScale},
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
    }


    static angleUpdate(particle: Particle, key, t, value){
        return t == 0 ? Phaser.Math.Angle.Between(0,0,particle.velocityX, particle.velocityY) * Phaser.Math.RAD_TO_DEG : value;
    }
}