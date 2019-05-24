import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;

export class ShipPart {
    private scene: Scene;
    private normal: Sprite;
    private destroyed: Sprite;
    private offX: number;
    private offY: number;

    private desOffX: number;
    private desOffY: number;

    public constructor(scene: Scene, x: number, y: number, normTex: string, desTex: string, offX: number, offY: number,
                       desOffX: number, desOffY: number){
        this.scene = scene;
        this.normal = new Sprite(scene, x, y, normTex);
        this.destroyed = new Sprite(scene, x, y, desTex);
        this.offX = offX;
        this.offY = offY;

        this.desOffX = desOffX;
        this.desOffY = desOffY;
        this.scene.add.existing(this.normal);
    }

    public toDestroyedPart(): void{
        this.normal.destroy();
        this.scene.add.existing(this.destroyed);
    }

    public setPosition(x: number, y: number): void{
        this.normal.setPosition(x + this.offX, y + this.offY);
        this.destroyed.setPosition(x + this.desOffX, y + this.desOffY);
    }
}