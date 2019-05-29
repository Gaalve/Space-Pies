import {WeaponType} from "./weapon-type";
import Sprite = Phaser.GameObjects.Sprite;
import {Player} from "../player";
import Vector2 = Phaser.Math.Vector2;


export class Bullet extends Sprite{

    private speedX: number;
    private speedY: number;
    private hit: boolean;
    private isFirst: boolean;
    private player: Player;
    private weaponType: WeaponType;

    constructor(scene: Phaser.Scene, x: number, y: number, isFirstPlayer: boolean, type: WeaponType, hit: boolean, player: Player) {
        super(scene, x, y, Bullet.getBulletTex(type));
        this.weaponType = type;
        this.player = player;
        scene.add.existing(this);
        this.setDepth(10); //TODO
        this.hit = hit;
        this.isFirst = isFirstPlayer;
        let speed = 5;
        if(isFirstPlayer){
            this.speedX = speed;
            this.flipX = true;
            this.x += 15;
        }
        else {
            this.speedX = -speed;
            this.x -= 15;
        }
        this.speedY = (540 - y) * (speed / 1100)
    }

    private static getBulletTex(type: WeaponType) : string{
        switch (type) {
            case WeaponType.LASER_ARMOR: return "shot_laser";
            case WeaponType.PROJECTILE_SHIELD: return "shot_projectile";
            case WeaponType.ROCKET: return "shot_rocket"
        }
        return "shot_laser"
    }

    public update(delta: number): void{
        this.x += delta*this.speedX;
        this.y += delta*this.speedY;
    }

    public hasHit(): boolean{
        if(!this.hit) return false;
        if(!this.isFirst && this.x < 400){
            this.playHitAnimation();
            return true;
        }
        else if(this.isFirst && this.x > 1520){
            this.playHitAnimation();
            return true;
        }
        return false
    }

    public isOutOfBounds(): boolean{
        return this.x < -50 || this.x > 1970;
    }

    private playHitAnimation(): void{
        switch (this.weaponType) {
            case WeaponType.LASER_ARMOR:
                this.player.laserImpact.impactAt(this.x, this.y, 0.32, 5,
                    new Vector2(this.speedX, this.speedY).angle()* Phaser.Math.RAD_TO_DEG);
                break;
            case WeaponType.PROJECTILE_SHIELD:
                this.player.projectileImpact.impactAt(this.x, this.y, 0.32, 5,
                    new Vector2(this.speedX, this.speedY).angle()* Phaser.Math.RAD_TO_DEG);
                break;
            case WeaponType.ROCKET:
                this.player.explosion.explosionAt(this.x, this.y, 0.4, 1.2);
                break;
        }
    }
}