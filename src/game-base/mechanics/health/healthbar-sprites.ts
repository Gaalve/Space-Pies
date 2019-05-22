import {HealthType} from "./health-type";
import Sprite = Phaser.GameObjects.Sprite;

export class HealthbarSprites {
    private readonly sprite: Phaser.GameObjects.Sprite;
    public constructor(scene: Phaser.Scene, type: HealthType, x: number, y: number){
        this.sprite = new Sprite(scene, x, y, HealthbarSprites.getTexture(type));
        scene.add.existing(this.sprite);
    }

    private static getTexture(type: HealthType): string{
        switch (type) {
            case HealthType.HitZoneBar:
                return "hitzone_shield";
            case HealthType.ShieldBar:
                return "laser_shield";
            case HealthType.ArmorBar:
                return "armor_shield";
            case HealthType.AdaptiveBar:
                return "adap_shield";
            case HealthType.NanoBar:
                return "nano_shield";
            case HealthType.RocketBar:
                return "rocket_shield";
        }
        return "";
    }

    public destroy(): void{
        this.sprite.destroy();
    }

    public getSprite() {
        return this.sprite;
    }
}