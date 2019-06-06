import {Button} from "../mechanics/button";
import {MainScene} from "./main-scene";
import {Player} from "../mechanics/player";

export class PauseScene extends Phaser.Scene {


    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private background;
    private buttonResume: Button;
    private buttonReset: Button;
    private buttonDebug: Button;
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
        const titleText = this.add.text(1920/2-130, 200, 'Pause!', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });

        this.buttonResume = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_resume",
            ()=>{
            this.scene.resume("MainScene");
            this.scene.sleep();}
            //this.scene.setVisible(false,"PauseScene")}
        );
        this.buttonResume.setPosition(1920/2-130, 1080/2-75);

        const resumeText = this.add.text(1920/2-60, 1080/2-100, "Resume", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.buttonReset = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
            this.scene.get('MainScene').scene.restart();
            this.P2.resetEnergy();
            this.P1.resetEnergy();
            this.scene.sleep();});

        this.buttonReset.setPosition(1920/2-130, 1080/2+75);

        const resetText = this.add.text(1920/2-60, 1080/2+50, "Reset", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        const debugText = this.add.text(1760, 1020, "Change Debug",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20});
        debugText.setOrigin(0.5);
        const debugState = this.add.text(1760, 1050, "State: true",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20});
        debugState.setOrigin(0.5);


        this.buttonDebug = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg","button_options",
            ()=>{
            let bool = this.P1.getSystem().changeDebugLogger();
            debugState.setText("State: " + bool);
            })

        this.buttonDebug.setPosition(1880, 1040);



        // Weapons Hints
        this.add.text(120,150,'Waepon Hints:',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 28, strokeThickness: 2});


        this.add.image(120,350,'ssr_weap_pro');
        this.add.image(120,400,'ssb_weap_pro');
        this.add.text(230,350+25,'Projectile Weapons to attack Armor-shields');

        this.add.image(120,550,'ssr_weap_las');
        this.add.image(120,600,'ssb_weap_las');
        this.add.text(230,550+25,'Laser Weapons to attack energy-shields');

        this.add.image(120,750,'ssr_weap_rock');
        this.add.image(120,800,'ssb_weap_rock');
        this.add.text(230,750+25,'Rocket launcher to destory all kinds of shields');


        // Shield Hints

        this.add.text(1920-400,150,'Shield Hints:',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 28, strokeThickness: 2});


        this.add.image(1920-120,340,'button_shield');
        this.add.text(1920-600,340,'Energy-shield protects from Laser Weapons,\nvisualis by blue bars\nPi-Kalk:');

        this.add.image(1920-120,460,'button_armor');
        this.add.text(1920-600,440,'Armor-shield protects from Projectile Weapons,\nvisualis by grey bars');

        this.add.image(1920-120,580,'button_rocket');
        this.add.text(1920-600,560,'Rocket-shield protects from Rocket launcher,\nvisualis by red bars');

        this.add.image(1920-120,700,'button_nano');
        this.add.text(1920-600,680,'Nano-shield cheap and weak shield,\nthat protects from all kinds of Weapons\nvisualis by braun bars');

        this.add.image(1920-120,820,'button_adapt');
        this.add.text(1920-600,800,'Super-shield expensive and strong shield,\nthat protects from all kinds of Weapons');

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;

            this.buttonReset.updateStep();
            this.buttonResume.updateStep();
            this.buttonDebug.updateStep();

        }
    }
}