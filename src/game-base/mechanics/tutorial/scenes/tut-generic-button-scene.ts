import Text = Phaser.GameObjects.Text;
import {TutSubScene} from "../tut-sub-scene";
import {ButtonWithText} from "./scene-mechanics/button-with-text";

export class TutGenericButtonScene extends TutSubScene{
    text: Text;
    buttons: ButtonWithText[];
    strText: string;
    constructor(scene: Phaser.Scene, text: string, buttons: ButtonWithText[]) {
        super(scene, 2, 0, 0.5);
        this.strText = text;
        this.buttons = buttons;
        this.buttons.forEach(v=>v.setVisible(false));
    }

    subIntro(delta: number): void {
        this.text.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.text.setAlpha( 1);
        this.buttons.forEach(v => v.setVisible(true))
    }

    subOutro(delta: number): void {
        this.text.setAlpha(1 - delta);
    }

    destroy(): void {
        this.text.destroy();
        this.buttons.forEach(v => v.setVisible(false));
    }

    launch(): void {
        this.text = new Text(this.scene, 1920/2, 1080/2 - 400, this.strText, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 68, fontStyle: 'bold', strokeThickness: 2});
        this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(1);
        this.buttons.forEach(v => v.setVisible(false));
        this.blockMainScene = true;
        this.scene.add.existing(this.text);
        this.text.setAlpha(0);

    }

    update(delta: number): void {
        this.buttons.forEach(v => v.update(delta))
    }

}