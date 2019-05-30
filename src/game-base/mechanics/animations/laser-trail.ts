import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;


export class LaserTrail {

    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private laserParticle: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        let speedScale = 1;
        let lifeScale = 1;
        this.laserParticle = this.pem.createEmitter( {
            x: 0, y: 0,  tint: [0xffff2a2a, 0xffff0000, 0xffd40000, 0xffaa0000],
            angle: {min: 50 - 13, max: 50 - 3},
            speed: {min: 5*speedScale, max: 120*speedScale},
            alpha: 0.35,
            radial: true,
            scale: (particle, key, t) => (t > 0.2 ? 1-(t - 0.2)*(1.0/0.8) : 1)*0.2,
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false, frame: "particle_1"});
    }

    public trailAt(sx: number, sy: number, ex: number, ey: number, lifeScale: number = 1, speedScale: number = 1, trailAngle: number): void{
        // trailAngle += 180;
        this.setTrailConfig(trailAngle, lifeScale, speedScale);
        for (let i = 0; i < 10 ; i++) {
            let x = sx + (ex - sx)*Math.random();
            let y = sy + (ey - sy)*Math.random();
            this.laserParticle.emitParticle(1, x, y);
        }

    }

    private setTrailConfig(trailAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.laserParticle.fromJSON({
            angle: {min: trailAngle - 2, max: trailAngle + 2},
            speed: {min: 120 * speedScale, max: 400*speedScale},
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
    }
}