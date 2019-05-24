import {Player} from "./player";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import {BaseShip} from "./ship/base-ship";
import {RedShip} from "./ship/red-ship";
import {BlueShip} from "./ship/blue-ship";
import Scene = Phaser.Scene;


export class Ship{

    private scene: Scene;
    private posX : number;
    private posY : number;
    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private explosionSmoke: Phaser.GameObjects.Particles.ParticleEmitter;
    private explosionRed: Phaser.GameObjects.Particles.ParticleEmitter;
    private explosionOrange: Phaser.GameObjects.Particles.ParticleEmitter;
    private explosionYellow: Phaser.GameObjects.Particles.ParticleEmitter;
    private isRed: boolean;
    private modularShip: BaseShip;

    public constructor (scene : Phaser.Scene, x: number, y: number, player : Player){
        this.scene = scene;
        if(player.getNameIdentifier() == "P1"){
            // super(scene, x, y, "ssr_ship_on");+
            this.isRed = true;
            this.modularShip = new RedShip(scene, x, y);
        }else{
            // super(scene, x, y, "ssb_ship_on");
            this.isRed = false;
            this.modularShip = new BlueShip(scene, x, y);
        }

        this.posX = x;
        this.posY = y;
        // scene.add.existing(this);
        // this.alpha = 0.5;
        // this.setTintFill(0xFFFFFF);
        // this.setTint(0x00FFFF);
        this.pem = scene.add.particles("particle");
        this.pem.setDepth(5);
        this.explosionSmoke = this.pem.createEmitter( {
            x: x, y: y, tint: 0xff333333, speed: {min: 10, max: 120},
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1800, max: 2000}, on: false});
        this.explosionRed = this.pem.createEmitter({
            x: x, y: y, tint: 0xffc83737, speed: {min: 10, max: 90},
            scale: (particle, key, t) => particle.scaleX = particle.scaleY = t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1600, max: 1800}, on: false});
        this.explosionOrange = this.pem.createEmitter({
            x: x, y: y, tint: 0xffff9955, speed: {min: 10, max: 70},
            scale: (particle, key, t) => particle.scaleX = particle.scaleY = t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1400, max: 1600}, on: false});
        this.explosionYellow = this.pem.createEmitter({
            x: x, y: y, tint: 0xffffdd55, speed: {min: 10, max: 50},
            scale: (particle, key, t) => particle.scaleX = particle.scaleY = t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1200, max: 1400}, on: false});
        if(player.isFirstPlayer())
            scene.time.delayedCall(4000, this.explosion, [], this);
    }

    public explosion(): void{
        this.scene.time.delayedCall(0, this.explosionAt, [0, 0], this);
        for (let i = 0; i < 110; i++) {
            this.scene.time.delayedCall(150 * i, this.explosionAt, [Math.random()*300 - 150, Math.random()*300 - 150, Math.random()*0.4 + 0.3], this);
        }
        if(this.isRed) this.exploedP1();
    }

    public update(delta: number): void{
        this.modularShip.update(delta);
    }

    private exploedP1(): void{
        this.scene.time.delayedCall(2000, this.explosion2At, [40, -130, 0.85, 2.4], this);
        this.scene.time.delayedCall(2500, ()=>{this.modularShip.toDestroyedWingUp()}, [], this);

        this.scene.time.delayedCall(5000, this.explosion2At, [40, 110, 0.85, 2.4], this);
        this.scene.time.delayedCall(5050, this.explosion2At, [40, 0, 0.85, 1], this);
        this.scene.time.delayedCall(5500, ()=>{this.modularShip.toDestroyedWingDown()}, [], this);

        this.scene.time.delayedCall(8000, this.explosion2At, [-60, -100, 0.85, 2.4], this);
        this.scene.time.delayedCall(8050, this.explosion2At, [-60, 100, 0.85, 2.4], this);
        this.scene.time.delayedCall(8500, ()=>{this.modularShip.toDestroyedBack()}, [], this);


        this.scene.time.delayedCall(11000, this.explosion2At, [165, 0, 0.85, 2.4], this);
        this.scene.time.delayedCall(11500, ()=>{this.modularShip.toDestroyedPilot()}, [], this);

        this.scene.time.delayedCall(14000, this.explosion2At, [20, 0, 0.85, 2.4], this);
        this.scene.time.delayedCall(14080, this.explosion2At, [150, 0, 0.85, 1.2], this);
        this.scene.time.delayedCall(14500, ()=>{this.modularShip.toDestroyedHull()}, [], this);
    }

    private explosionAt(offX: number, offY: number, scale: number = 1): void{
        this.explosionSmoke.fromJSON({
            x: this.posX, y: this.posY,  tint: 0xff1a1a1a, speed: {min: 5, max: 120},radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1800*scale, max: 2000*scale}, on: false});
        this.explosionRed.fromJSON({
            x: this.posX, y: this.posY,  tint: 0xffd40000, speed: {min: 5, max: 90}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1600*scale, max: 1800*scale}, on: false});
        this.explosionOrange.fromJSON({
            x: this.posX, y: this.posY,  tint: 0xffff6600, speed: {min: 5, max: 70}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1400*scale, max: 1600*scale}, on: false});
        this.explosionYellow.fromJSON({
            x: this.posX, y: this.posY, tint: 0xffffcc00, speed: {min: 5, max: 50}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1200*scale, max: 1400*scale}, on: false});

        this.explosionSmoke.emitParticle(120 * scale, this.posX + offX, this.posY + offY);
        this.explosionRed.emitParticle(120 * scale, this.posX + offX, this.posY + offY);
        this.explosionOrange.emitParticle(120 * scale, this.posX + offX, this.posY + offY);
        this.explosionYellow.emitParticle(120 * scale, this.posX + offX, this.posY + offY);
    }

    public explosion2At(offX: number, offY: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.explosionSmoke.fromJSON({
            x: this.posX, y: this.posY,  tint: 0xff1a1a1a, speed: {min: 5*speedScale, max: 120*speedScale},radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1800*lifeScale, max: 2000*lifeScale}, on: false});
        this.explosionRed.fromJSON({
            x: this.posX, y: this.posY,  tint: 0xffd40000, speed: {min: 5*speedScale, max: 90*speedScale}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1600*lifeScale, max: 1800*lifeScale}, on: false});
        this.explosionOrange.fromJSON({
            x: this.posX, y: this.posY,  tint: 0xffff6600, speed: {min: 5*speedScale, max: 70*speedScale}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1400*lifeScale, max: 1600*lifeScale}, on: false});
        this.explosionYellow.fromJSON({
            x: this.posX, y: this.posY, tint: 0xffffcc00, speed: {min: 5*speedScale, max: 50*speedScale}, radial: true,
            scale: (particle, key, t) => t > 0.8 ? 1-(t - 0.8)*5 : 1,
            lifespan: {min: 1200*lifeScale, max: 1400*lifeScale}, on: false});

        this.explosionSmoke.emitParticle(120 * lifeScale*speedScale, this.posX + offX, this.posY + offY);
        this.explosionRed.emitParticle(120 * lifeScale*speedScale, this.posX + offX, this.posY + offY);
        this.explosionOrange.emitParticle(120 * lifeScale*speedScale, this.posX + offX, this.posY + offY);
        this.explosionYellow.emitParticle(120 * lifeScale*speedScale, this.posX + offX, this.posY + offY);
    }

}