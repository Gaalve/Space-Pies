import {Button} from "../mechanics/button";
import {MainScene} from "./main-scene";

export class StartScene extends Phaser.Scene {


    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private buttonStart: Button;


    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )

    }

    constructor() {
        super({
            key: "StartScene",
            active: false
        })
    }


    create(): void {


        const titleText = this.add.text(1920/2-50, 200, 'Main-Menu', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });

        this.buttonStart = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
                this.scene.launch('MainScene');
                this.scene.launch('GuiScene');
                this.scene.stop();});

        this.buttonStart.setPosition(1920/2, 1080/2+75);

        const resetText = this.add.text(1920/2+80, 1080/2+50, "Start Game", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;

            this.buttonStart.updateStep();

        }
    }
}