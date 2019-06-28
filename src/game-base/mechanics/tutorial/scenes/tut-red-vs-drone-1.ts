import Text = Phaser.GameObjects.Text;
import {TutSubScene} from "../tut-sub-scene";
import {ButtonWithText} from "./scene-mechanics/button-with-text";
import {TutRedShip} from "./scene-mechanics/tut-red-ship";
import {TutDrone} from "./scene-mechanics/tut-drone";

export class TutRedVsDrone1 extends TutSubScene{
    text: Text;
    button: ButtonWithText;
    red: TutRedShip;
    drone: TutDrone;


    constructor(scene: Phaser.Scene, text: string, fontSize: number, duration: number = 5, intro: number = 2, outro: number = 2) {
        super(scene, intro, outro, duration);
        this.text = new Text(this.scene, 1920/2, 1080/2 - 300, text, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: fontSize, fontStyle: 'bold', strokeThickness: 2});
        this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(1);
        this.blockMainScene = true;
        this.button = new ButtonWithText(scene, "blue_arrow", "Shoot Projectile", ()=>{}, 1920/2, 1080/2 + 400);
        this.button.setVisible(false);

    }

    subIntro(delta: number): void {
        this.text.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.text.setAlpha( 1 );
    }

    subOutro(delta: number): void {
        // this.text.setAlpha(1 - delta);
    }

    destroy(): void {
        this.button.destroy();
        this.text.destroy()
    }

    launch(): void {
        this.red = new TutRedShip(this.scene, 250, 1080/2);
        this.drone = new TutDrone(this.scene, 1700, 1080/2, 1,false);
        this.drone.addWeapon("arm");
        this.drone.create();
        this.button.setVisible(true);
        this.scene.add.existing(this.text);
        this.text.setAlpha(0);
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.button.update(delta);
        this.drone.update(delta*1000);
    }

    setText(text: string): void{
        console.log(text);
        this.text.setText(text);
    }


    private shootP(): void{

    }
}