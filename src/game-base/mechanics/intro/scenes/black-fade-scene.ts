import {SubScene} from "../sub-scene";
import Sprite = Phaser.GameObjects.Sprite;

export class BlackFadeInScene extends SubScene{

    sprite: Sprite;
    constructor(scene: Phaser.Scene) {
        super(scene, 1, 1, 2);
        this.sprite = new Sprite(scene, 1920/2, 1080/2, 'button_bg');
        this.sprite.setScale(500);
        this.sprite.setTint(0x000000);

    }



    subIntro(delta: number): void {
        this.sprite.setAlpha(delta);
    }

    subOutro(delta: number): void {
        this.sprite.setAlpha(1-delta);
    }

    subScene(delta: number): void {
        this.sprite.setAlpha(1);
    }

    destroy(): void {
        this.sprite.destroy();
    }

    launch(): void {
        this.scene.add.existing(this.sprite);
    }



}