import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Particle = Phaser.GameObjects.Particles.Particle;


export class NeutronTurb {

    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private laserSpark: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        let speedScale = 1;
        let lifeScale = 1;
        this.laserSpark = this.pem.createEmitter( {
            x: 0, y: 0,
            // tint: [0xffeeaa, 0xffdd55, 0xffd42a],
            tint: [0xaaeeff, 0x2ad4ff, 0x2a7fff],
            angle: {min: 50 - 13, max: 50 - 3},
            speed: {min: 5*speedScale, max: 120*speedScale},
            alpha: 0.5,
            radial: true,
            rotate: NeutronTurb.angleUpdate,
            scale: (particle, key, t) => (t > 0.2 ? 1-(t - 0.2)*(1.0/0.8) : 1)*0.45,
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false, frame: "particle_2"});
    }

    public impactAt(x: number, y: number, lifeScale: number = 1, speedScale: number = 1, impactAngle: number): void{
        impactAngle += 180;

        this.setImpactConfig1(impactAngle, lifeScale, speedScale);
        this.laserSpark.emitParticle(15, x, y);
        this.setImpactConfig2(impactAngle, lifeScale, speedScale);
        this.laserSpark.emitParticle(15, x, y);
    }

    private setImpactConfig1(impactAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.laserSpark.fromJSON({
            angle: {min: impactAngle - 26, max: impactAngle - 1},
            speed: {min: 50*speedScale, max: 200*speedScale},
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
    }
    private setImpactConfig2(impactAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.laserSpark.fromJSON({
            angle: {min: impactAngle + 1, max: impactAngle + 26},
            speed: {min: 50*speedScale, max: 200*speedScale},
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
    }

    static angleUpdate(particle: Particle, key, t, value){
        return t == 0 ? Phaser.Math.Angle.Between(0,0,particle.velocityX, particle.velocityY) * Phaser.Math.RAD_TO_DEG : value;
    }
}