import {SubScene} from "../sub-scene";
import Text = Phaser.GameObjects.Text;

export class GenericTextScene extends SubScene{
    text: Text;

    constructor(scene: Phaser.Scene, text: string, fontSize: number, duration: number = 5) {
        super(scene, 2, 2, duration);
        this.text = new Text(scene, 1920/2, 1080/2 + 200, text, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: fontSize, fontStyle: 'bold', strokeThickness: 2});
        this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(1);
    }

    subIntro(delta: number): void {
        this.text.x = -1000 + Math.sin(delta*Math.PI/2 )*(1920/2 + 1000);
        this.text.setAlpha(1);
    }

    subOutro(delta: number): void {
        this.text.x = 1920 + 1000 -Math.cos(delta*Math.PI/2 )*(1920/2 + 1000);
    }

    subScene(delta: number): void {
        this.text.x = 1920/2;
    }

    destroy(): void {
        this.text.destroy()
    }

    launch(): void {
        this.scene.add.existing(this.text);
        this.text.setAlpha(0);

    }

}