import {HealthType} from "./health-type";
import Sprite = Phaser.GameObjects.Sprite;

export class HealthbarSprites {
    public readonly sprite: Phaser.GameObjects.Sprite;
    private readonly type: HealthType;
    private readonly pid: string;
    public constructor(scene: Phaser.Scene, type: HealthType, x: number, y: number, pid: string){
        this.sprite = new Sprite(scene, x, y, 'atlas',  HealthbarSprites.getTexture(type));
        this.type = type;
        this.pid = pid;
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

    public static getAbbreviation(type: HealthType): string{
        switch (type) {
            case HealthType.HitZoneBar:
                return "l";
            case HealthType.ShieldBar:
                return "s";
            case HealthType.ArmorBar:
                return "a";
            case HealthType.AdaptiveBar:
                return "x";
            case HealthType.NanoBar:
                return "n";
            case HealthType.RocketBar:
                return "r";
        }
        return "";
    }

    private getAbbreviation(): string{
        return HealthbarSprites.getAbbreviation(this.type);
    }

    public destroy(): void{
        this.sprite.destroy();
    }

    public toString(): string{
        return this.getAbbreviation()+(this.pid);
    }
}