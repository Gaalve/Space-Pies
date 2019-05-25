import {SubScene} from "../sub-scene";
import Text = Phaser.GameObjects.Text;
import Sprite = Phaser.GameObjects.Sprite;

export class SpacePiesScene extends SubScene{

    text: Text;
    subText: Text;
    logo: Sprite;
    constructor(scene: Phaser.Scene) {
        super(scene, 2, 2, 5);
        this.text = new Text(scene, -1920/2, 1080/2 + 250, "The Ultimate Game", {
            fill: '#ff2a2a', fontFamily: '"Roboto"', fontSize: 160, fontStyle: 'bold', strokeThickness: 2, stroke: '#782121ff'});
        this.text.setShadow(0,6,'#000', 10);
        this.text.setAlign('center');
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(1);

        this.subText = new Text(scene, -1920/2, 1080/2 + 400, "GoldEdition", {
            fill: '#ffdd55', fontFamily: '"Roboto"', fontSize: 160, fontStyle: 'bold', strokeThickness: 2, stroke: '#806600ff'});
        this.subText.setShadow(0,6,'#000', 10);
        this.subText.setAlign('center');
        this.subText.setOrigin(0.5, 0.5);
        this.subText.setDepth(1);

        this.logo = new Sprite(scene, -1920/2, 1080/2-200, 'atlas', 'logo_space_pies');
        this.logo.setDepth(1);
    }

    subIntro(delta: number): void {
        this.text.x = -1000 + Math.sin(delta*Math.PI/2 )*(1920/2 + 1000);
        this.subText.x = -1000 + Math.sin(delta*Math.PI/2 )*(1920/2 + 1000);
        this.text.setAlpha(1);
        this.logo.x = -500 + Math.sin(delta*Math.PI/2 )*(1920/2 + 500);
    }

    subOutro(delta: number): void {
        this.logo.x = 1920 + 500 -Math.cos(delta*Math.PI/2 )*(1920/2 + 500);
        this.text.x = 1920 + 1000 -Math.cos(delta*Math.PI/2 )*(1920/2 + 1000);
        this.subText.x = 1920 + 1000 -Math.cos(delta*Math.PI/2 )*(1920/2 + 1000);
    }

    subScene(delta: number): void {
        this.text.x = 1920/2;
        this.subText.x = 1920/2;
        this.logo.x = 1920/2;
    }

    destroy(): void {
        this.text.destroy();
        this.subText.destroy();
        this.logo.destroy();
    }

    launch(): void {
        this.scene.add.existing(this.text);
        this.scene.add.existing(this.logo);
        this.text.setAlpha(0);
        this.scene.add.existing(this.subText);
    }

}