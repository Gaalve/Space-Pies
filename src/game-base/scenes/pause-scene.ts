import {Button} from "../mechanics/button";
import {MainScene} from "./main-scene";
import {Player} from "../mechanics/player";

export class PauseScene extends Phaser.Scene {


    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private background;
    private buttonResume: Button;
    private buttonReset: Button;
    private P1: Player;
    private P2: Player;


    preload(): void {
        // this.load.pack(
        //     "preload",
        //     "assets/pack.json",
        //     "preload"
        // )

    }

    constructor() {
        super({
            key: "PauseScene",
            active: false
        })
    }


    create(): void {

        this.background = this.add.image(1920/2, 540,"pause_bg");
        this.P1 = this.scene.get('MainScene').data.get("P1");
        this.P2 = this.scene.get('MainScene').data.get("P2");

        //this.add.image(1920/2, 1080/2, "background_space")
        const titleText = this.add.text(1920/2-50, 200, 'Pause!', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });

        this.buttonResume = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_resume",
            ()=>{
            this.scene.resume("MainScene");
            this.scene.sleep();}
            //this.scene.setVisible(false,"PauseScene")}
        );
        this.buttonResume.setPosition(1920/2, 1080/2-75);

        const resumeText = this.add.text(1920/2+80, 1080/2-100, "Resume", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.buttonReset = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
            this.scene.get('MainScene').scene.restart();
            this.P2.resetEnergy();
            this.P1.resetEnergy();
            this.scene.sleep();});

        this.buttonReset.setPosition(1920/2, 1080/2+75);

        const resetText = this.add.text(1920/2+80, 1080/2+50, "Reset", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;

            this.buttonReset.updateStep();
            this.buttonResume.updateStep();

        }
    }
}