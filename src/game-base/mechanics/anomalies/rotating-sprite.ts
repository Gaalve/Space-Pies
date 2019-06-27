import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;


export class RotatingSprite extends Sprite{


    private sinCounter: number;
    private rotationScale: number;


    public constructor(scene: Scene, tex: string, x: number, y: number, rotationScale: number){
        super(scene, x, y, tex);
        this.sinCounter = 0;
        this.rotationScale = rotationScale;
    }


    public update(delta: number): void {
        this.sinCounter += delta / this.rotationScale;
        this.sinCounter %= Math.PI * 2;
        this.rotation = this.sinCounter;
    }
}