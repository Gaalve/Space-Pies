import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;


export class LaserImpact {

    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private laserSpark: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        let speedScale = 1;
        let lifeScale = 1;
        this.laserSpark = this.pem.createEmitter( {
            x: 0, y: 0,  tint: [0xffff2a2a, 0xffff0000, 0xffd40000, 0xffaa0000],
            angle: {min: 50 - 13, max: 50 - 3},
            speed: {min: 5*speedScale, max: 120*speedScale},
            alpha: 0.35,
            radial: true,
            rotate: LaserImpact.angleUpdate,
            scale: (particle, key, t) => (t > 0.2 ? 1-(t - 0.2)*(1.0/0.8) : 1)*0.55,
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false, frame: "particle_2"});
    }

    public impactAt(x: number, y: number, lifeScale: number = 1, speedScale: number = 1, impactAngle: number): void{
        impactAngle += 180;

        this.setImpactConfig1(impactAngle, lifeScale, speedScale);
        this.laserSpark.emitParticle(10, x, y);
        this.setImpactConfig2(impactAngle, lifeScale, speedScale);
        this.laserSpark.emitParticle(10, x, y);
    }

    private setImpactConfig1(impactAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.laserSpark.fromJSON({
            angle: {min: impactAngle - 13, max: impactAngle - 1},
            speed: {min: 50*speedScale, max: 200*speedScale},
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
    }
    private setImpactConfig2(impactAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.laserSpark.fromJSON({
            angle: {min: impactAngle + 1, max: impactAngle + 13},
            speed: {min: 50*speedScale, max: 200*speedScale},
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
    }

    static angleUpdate(particle: Particle, key, t, value){
        return t == 0 ? Phaser.Math.Angle.Between(0,0,particle.velocityX, particle.velocityY) * Phaser.Math.RAD_TO_DEG : value;
    }
}