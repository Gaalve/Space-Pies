import {WeaponType} from "./weapon-type";
import Sprite = Phaser.GameObjects.Sprite;


export class Bullet extends Sprite{

    private speedX: number;
    private speedY: number;
    private hit: boolean;
    private isFirst: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, isFirstPlayer: boolean, type: WeaponType, hit: boolean) {
        super(scene, x, y, Bullet.getBulletTex(type));
        scene.add.existing(this);
        this.setDepth(10); //TODO
        this.hit = hit;
        this.isFirst = isFirstPlayer;
        let speed = 1;
        if(isFirstPlayer){
            this.speedX = speed;
            this.flipX = true;
        }
        else {
            this.speedX = -speed;
        }
        this.speedY = (540 - y) * (speed / 1100)
    }

    private static getBulletTex(type: WeaponType) : string{
        switch (type) {
            case WeaponType.LASER_ARMOR: return "shot_laser";
            case WeaponType.PROJECTILE_SHIELD: return "shot_projectile";
            case WeaponType.ROCKET: return "shot_rocket"
        }
    }

    public update(delta: number): void{
        this.x += delta*this.speedX;
        this.y += delta*this.speedY;
    }

    public checkHit(): boolean{
        if(!this.hit) return false;
        if(this.isFirst) return this.x < 400;
        else return this.x > 1520;
    }

    public checkBounds(): boolean{
        return this.x < -50 || this.x > 1970;
    }
}