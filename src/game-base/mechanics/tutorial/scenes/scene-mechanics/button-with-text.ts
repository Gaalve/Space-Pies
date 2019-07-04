import {Button} from "../../../button";
import Text = Phaser.GameObjects.Text;
import Scene = Phaser.Scene;


export class ButtonWithText {
    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;
    private button: Button;
    private text: Text;

    public constructor(scene: Scene, img: string, text: string, onClick: ()=>any, x: number, y: number){
        this.button = new Button(scene, x, y, "button_shadow",
            "button_bg", "button_fg", img, 0.95, onClick);

        this.text = new Text(scene, x + 60, y, text, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 46, fontStyle: 'bold', strokeThickness: 2});
        this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.0, 0.5);
        scene.add.existing(this.text);
    }

    public update(delta: number){
        this.timeAccumulator += delta * 1000;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.button.updateStep();
        }
    }

    public setVisible(value: boolean): void{
        value ? this.button.setVisible() : this.button.setInvisible();
        this.text.setVisible(value);
    }

    public destroy(): void{
        this.text.destroy();
        this.button.destroy();
    }
}