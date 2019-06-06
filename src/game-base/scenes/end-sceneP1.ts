import {Button} from "../mechanics/button";
import {MainScene} from "./main-scene";


export class EndSceneP1 extends Phaser.Scene {


    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private buttonMain: Button;
    private buttonCredits: Button;

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )

    }

    constructor() {
        super({
            key: "EndSceneP1",
            active: false
        })
    }


    create(): void {


        const titleText = this.add.text(1920/2-150, 200, 'Player 2 Wins!', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });

        this.buttonMain = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
            this.scene.launch('FadeScene', {shut: 'EndSceneP1', start: 'MainScene'});this.scene.get('FadeScene').scene.bringToTop()
            });

        this.buttonMain.setPosition(1920/2-100, 1080/2-75);

        const textMain = this.add.text(1920/2, 1080/2-100, "Main-Menu", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});



        this.buttonCredits = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{});

        this.buttonCredits.setPosition(1920/2-100, 1080/2+75);

        const textCredits = this.add.text(1920/2, 1080/2+50, "Credits", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.buttonMain.updateStep()
            this.buttonCredits.updateStep();

        }
    }
}