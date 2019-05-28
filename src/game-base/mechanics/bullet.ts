import {WeaponType} from "./weapon-type";
import Sprite = Phaser.GameObjects.Sprite;


export class Bullet extends Sprite{

    private speedX: number;
    private hit: boolean;
    private isFirst: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, isFirstPlayer: boolean, type: WeaponType, hit: boolean) {
        super(scene, x, y, Bullet.getBulletTex(type));
        this.hit = hit;
        this.isFirst = isFirstPlayer;
        let speed = 50;
        if(isFirstPlayer){
            this.speedX = speed;
            this.flipX = true;
        }
        else {
            this.speedX = -speed;
        }
    }

    private static getBulletTex(type: WeaponType) : string{
        switch (type) {
            case WeaponType.LASER_ARMOR: return "shot_laser";
            case WeaponType.PROJECTILE_SHIELD: return "shot_projectile";
            case WeaponType.ROCKET: return "shot_rocket"
        }
    }

    public update(delta: number){
        this.x += delta*this.speedX;
    }

    public checkHit(){
        
    }

    public checkBounds(){

    }
}