
export class Star {

    private starSprite: Phaser.GameObjects.Sprite;
    private scale: number;
    private static readonly vel: number = 0.8;

    public constructor(scene: Phaser.Scene, scale: number, x: number){
        this.scale = scale;
        this.starSprite = new Phaser.GameObjects.Sprite(scene, x, Math.random()*1120-40, "star");
        this.starSprite.setOrigin(0.5, 0.5);
        this.starSprite.setScale(scale);
        scene.add.existing(this.starSprite);
    }

    public updateStep(): void{
        this.starSprite.x += Star.vel * this.scale;
    }

    public shouldRemove(): boolean{
        return this.starSprite.x > 1960;
    }

    public destroy(): void{
        this.starSprite.destroy();
    }
}