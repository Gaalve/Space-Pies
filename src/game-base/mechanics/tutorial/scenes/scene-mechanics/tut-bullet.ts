import Sprite = Phaser.GameObjects.Sprite;
import {WeaponType} from "../../../weapon/weapon-type";
import {TutAnimationContainer} from "./tut-animation-container";
import Vector2 = Phaser.Math.Vector2;


export class Bullet extends Sprite{

    private speedX: number;
    private speedY: number;
    private hit: boolean;
    private isFirst: boolean;
    private weaponType: WeaponType;
    private animationContainer: TutAnimationContainer;

    constructor(scene: Phaser.Scene, x: number, y: number, isFirstPlayer: boolean, type: WeaponType, hit: boolean,
                toX: number, toY: number) {
        super(scene, x, y, Bullet.getBulletTex(type));
        this.weaponType = type;
        scene.add.existing(this);
        this.setDepth(10); //TODO
        this.hit = hit;
        this.isFirst = isFirstPlayer;
        let speed = 4;

        this.animationContainer = scene.data.get("animCont");

        this.setAngle(Phaser.Math.Angle.Between(x, y, toX, toY) * Phaser.Math.RAD_TO_DEG - 180);

        this.speedX = Math.cos(Phaser.Math.Angle.Between(x, y, toX, toY)) * speed;
        this.speedY = Math.sin(Phaser.Math.Angle.Between(x, y, toX, toY)) * speed;

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
        let lastX = this.x;
        let lastY = this.y;
        this.x += delta*this.speedX;
        this.y += delta*this.speedY;

        if(!this.checkHit()){
            switch (this.weaponType) {
                case WeaponType.LASER_ARMOR:
                    this.animationContainer.laserTrail.trailAt(this.x, this.y, lastX, lastY,1, 1,
                        new Vector2(this.speedX, this.speedY).angle()* Phaser.Math.RAD_TO_DEG);
                    break;
                case WeaponType.PROJECTILE_SHIELD:
                    this.animationContainer.bulletTrail.trailAt(this.x, this.y, lastX, lastY,1, 1,
                        new Vector2(this.speedX, this.speedY).angle()* Phaser.Math.RAD_TO_DEG);
                    break;
                case WeaponType.ROCKET:
                    this.animationContainer.rocketTrail.trailAt(this.x, this.y, lastX, lastY,1, 1,
                        new Vector2(this.speedX, this.speedY).angle()* Phaser.Math.RAD_TO_DEG);
                    break;
            }
        }
    }

    public checkHit(): boolean{
        if(!this.hit) return false;
        if(!this.isFirst && this.x < 400){
            return true;
        }
        else if(this.isFirst && this.x > 1520){
            return true;
        }
        return false
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
                this.animationContainer.laserImpact.impactAt(this.x, this.y, 0.32, 5,
                    new Vector2(this.speedX, this.speedY).angle()* Phaser.Math.RAD_TO_DEG);
                break;
            case WeaponType.PROJECTILE_SHIELD:
                this.animationContainer.projectileImpact.impactAt(this.x, this.y, 0.32, 5,
                    new Vector2(this.speedX, this.speedY).angle()* Phaser.Math.RAD_TO_DEG);
                break;
            case WeaponType.ROCKET:
                this.animationContainer.explosion.explosionAt(this.x, this.y, 0.4, 1.2);
                break;
        }
    }
}