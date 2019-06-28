import Text = Phaser.GameObjects.Text;
import {TutSubScene} from "../tut-sub-scene";
import Scene = Phaser.Scene;

export class TutGenericTextScene extends TutSubScene{
    text: Text;
    strText: string;
    fontSize: number;

    constructor(scene: Phaser.Scene, text: string, fontSize: number, duration: number = 5, intro: number = 2, outro: number = 2) {
        super(scene, intro, outro, duration);
        this.strText = text;
        this.fontSize = fontSize;
    }

    subIntro(delta: number): void {
        this.text.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.text.setAlpha( 1 );
    }

    subOutro(delta: number): void {
        this.text.setAlpha(1 - delta);
    }

    destroy(): void {
        this.text.destroy()
    }

    launch(): void {
        this.text = new Text(this.scene, 1920/2, 1080/2, "OPERT", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: this.fontSize, fontStyle: 'bold', strokeThickness: 2});
        this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(1);
        this.scene.add.existing(this.text);
        this.text.setAlpha(0);
    }

    update(delta: number): void {
    }

    setText(text: string): void{
        console.log(text);
        this.text.setText(text);
    }

}