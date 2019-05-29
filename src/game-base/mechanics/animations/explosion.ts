import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;

export class Explosion {

    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private explosionSmoke: Phaser.GameObjects.Particles.ParticleEmitter;
    private explosionRed: Phaser.GameObjects.Particles.ParticleEmitter;
    private explosionOrange: Phaser.GameObjects.Particles.ParticleEmitter;
    private explosionYellow: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(pem: ParticleEmitterManager){
        this.pem = pem;

        this.explosionSmoke = this.pem.createEmitter( {
            x: 0, y: 0, tint: 0xff333333, speed: {min: 10, max: 120},
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1800, max: 2000}, on: false});
        this.explosionRed = this.pem.createEmitter({
            x: 0, y: 0, tint: 0xffc83737, speed: {min: 10, max: 90},
            scale: (particle, key, t) => particle.scaleX = particle.scaleY = t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1600, max: 1800}, on: false});
        this.explosionOrange = this.pem.createEmitter({
            x: 0, y: 0, tint: 0xffff9955, speed: {min: 10, max: 70},
            scale: (particle, key, t) => particle.scaleX = particle.scaleY = t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1400, max: 1600}, on: false});
        this.explosionYellow = this.pem.createEmitter({
            x: 0, y: 0, tint: 0xffffdd55, speed: {min: 10, max: 50},
            scale: (particle, key, t) => particle.scaleX = particle.scaleY = t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1200, max: 1400}, on: false});
    }

    public explosionAt(x: number, y: number, lifeScale: number = 1, speedScale: number = 1): void{

        this.setExplosionConfig(lifeScale, speedScale);

        this.explosionSmoke.emitParticle(140 * lifeScale*speedScale, x, y);
        this.explosionRed.emitParticle(100 * lifeScale*speedScale, x, y);
        this.explosionOrange.emitParticle(80 * lifeScale*speedScale, x, y);
        this.explosionYellow.emitParticle(60 * lifeScale*speedScale, x, y);
    }

    private setExplosionConfig(lifeScale: number = 1, speedScale: number = 1): void{
        this.explosionSmoke.fromJSON({
            x: 0, y: 0,  tint: 0xff1a1a1a, speed: {min: 5*speedScale, max: 120*speedScale},radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
        this.explosionRed.fromJSON({
            x: 0, y: 0,  tint: 0xffd40000, speed: {min: 5*speedScale, max: 90*speedScale}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1600*lifeScale, max: 1800*lifeScale}, on: false});
        this.explosionOrange.fromJSON({
            x: 0, y: 0,  tint: 0xffff6600, speed: {min: 5*speedScale, max: 70*speedScale}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1400*lifeScale, max: 1600*lifeScale}, on: false});
        this.explosionYellow.fromJSON({
            x: 0, y: 0, tint: 0xffffcc00, speed: {min: 5*speedScale, max: 50*speedScale}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1200*lifeScale, max: 1400*lifeScale}, on: false});
    }
}