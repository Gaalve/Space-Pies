
export class Star {

    private readonly starSprite: Phaser.GameObjects.Sprite;
    private readonly scale: number;
    private static readonly vel: number = 60;
    private lastX: number;

    public constructor(scene: Phaser.Scene, scale: number, x: number){
        this.scale = scale;
        this.lastX = x;
        this.starSprite = new Phaser.GameObjects.Sprite(scene, x, Math.random()*1120-40, "star");
        this.starSprite.setOrigin(0.5, 0.5);
        this.starSprite.setScale(scale);
        scene.add.existing(this.starSprite);
    }


    public update(delta: number): void{
        this.starSprite.x += Star.vel * this.scale * delta;
    }

    public shouldRemove(): boolean{
        return this.starSprite.x > 1960;
    }

    public destroy(): void{
        this.starSprite.destroy();
    }
}