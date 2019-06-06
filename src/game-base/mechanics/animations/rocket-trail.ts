import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;

export class RocketTrail {

    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private trailSmoke: Phaser.GameObjects.Particles.ParticleEmitter;
    private trailOrange: Phaser.GameObjects.Particles.ParticleEmitter;
    private tailYellow: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;
        this.trailSmoke = this.pem.createEmitter( {
            angle: {min: 0, max: 0},
            x: 0, y: 0, tint: 0xff1a1a1a, speed: {min: 10, max: 120},
            scale: RocketTrail.scalingA,
            lifespan: {min: 1800, max: 2000}, on: false, frame: "particle_1"});
        this.trailOrange = this.pem.createEmitter({
            angle: {min: 0, max: 0},
            x: 0, y: 0, tint: 0xffff6600, speed: {min: 10, max: 70},
            scale: RocketTrail.scalingC,
            lifespan: {min: 1400, max: 1600}, on: false, frame: "particle_1"});
        this.tailYellow = this.pem.createEmitter({
            angle: {min: 0, max: 0},
            x: 0, y: 0, tint: 0xffffcc00, speed: {min: 10, max: 50},
            scale: RocketTrail.scalingD,
            lifespan: {min: 1200, max: 1400}, on: false, frame: "particle_1"});
    }

    public trailAt(sx: number, sy: number, ex: number, ey: number, lifeScale: number = 1, speedScale: number = 1, trailAngle: number): void{
        trailAngle -= 180;
        this.setTrailConfig(trailAngle, lifeScale, speedScale);
        for (let i = 0; i < 10 ; i++) {
            let x = sx + (ex - sx) * Math.random();
            let y = sy + (ey - sy) * Math.random();
            this.trailSmoke.emitParticle(3, x, y);
            // this.explosionRed.emitParticle(1, x, y);
            this.trailOrange.emitParticle(1, x, y);
            this.tailYellow.emitParticle(1, x, y);
        }
    }

    private setTrailConfig(trailAngle: number, lifeScale: number = 1, speedScale: number = 1): void{
        const angleOffset = 15;
        this.trailSmoke.fromJSON({
            angle: {min: trailAngle - angleOffset, max: trailAngle + angleOffset},
            speed: {min: 5*speedScale, max: 120*speedScale},
            lifespan: {min: 2000*lifeScale, max: 2400*lifeScale}, on: false});
        this.trailOrange.fromJSON({
            angle: {min: trailAngle - angleOffset, max: trailAngle + angleOffset},
            speed: {min: 5*speedScale, max: 120*speedScale},
            lifespan: {min: 1400*lifeScale, max: 1600*lifeScale}, on: false});
        this.tailYellow.fromJSON({
            angle: {min: trailAngle - angleOffset, max: trailAngle + angleOffset},
            speed: {min: 5*speedScale, max: 120*speedScale},
            lifespan: {min: 1200*lifeScale, max: 1400*lifeScale}, on: false});
    }

    private static scalingA(particle, key, t){
        const start = 0.2;
        const timeScale = 1/(1-start);
        return (t > start ? 1-(t - start)*timeScale : 1)*0.5;
    }
    private static scalingC(particle, key, t){
        const start = 0.2;
        const timeScale = 1/(1-start);
        return (t > start ? 1-(t - start)*timeScale : 1)*0.4;
    }
    private static scalingD(particle, key, t){
        const start = 0.2;
        const timeScale = 1/(1-start);
        return (t > start ? 1-(t - start)*timeScale : 1)*0.35;
    }
}