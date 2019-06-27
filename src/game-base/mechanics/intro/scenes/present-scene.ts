import {SubScene} from "../sub-scene";
import Sprite = Phaser.GameObjects.Sprite;
import Text = Phaser.GameObjects.Text;

export class PresentScene extends SubScene{


    logo: Sprite;
    text: Text;

    constructor(scene: Phaser.Scene) {
        super(scene, 2, 2, 5);
        this.logo = new Sprite(scene, 1920/2, 1080/2, "logo");
        this.text = new Text(scene, 1920/2, 750 + 200, "Presents", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 112, fontStyle: 'bold', strokeThickness: 2});
        this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(1);
        this.logo.setDepth(1);
    }



    subIntro(delta: number): void {
        this.logo.setAlpha(1);
        this.logo.x = -500 + Math.sin(delta*Math.PI/2 )*(1920/2 + 500);

        this.text.x = -800 + Math.sin(delta*Math.PI/2 )*(1920/2 + 800);
        this.text.setAlpha(1);
    }

    subOutro(delta: number): void {
        this.logo.x = 1920 + 500 -Math.cos(delta*Math.PI/2 )*(1920/2 + 500);
        this.text.x = 1920 + 800 -Math.cos(delta*Math.PI/2 )*(1920/2 + 800);
    }

    subScene(delta: number): void {
        this.logo.x = 1920/2;
        this.text.x = 1920/2;
    }

    destroy(): void {
        this.logo.destroy();
        this.text.destroy();
    }

    launch(): void {
        this.scene.add.existing(this.logo);
        this.scene.add.existing(this.text);
        this.logo.setAlpha(0);
        this.text.setAlpha(0);

    }



}