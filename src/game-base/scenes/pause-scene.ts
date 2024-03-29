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
    private changeAnimationButton: Button;
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
        this.add.text(1920/2-130, 200, 'Pause!', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });
        this.buttonResume = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_resume", 0.95,
            ()=>{
            this.scene.resume("MainScene");
            this.scene.sleep();}
            //this.scene.setVisible(false,"PauseScene")}
        );
        this.buttonResume.setPosition(1920/2-130, 1080/2-75);
        this.add.text(1920/2-60, 1080/2-100, "Resume", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.buttonReset = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_skip",0.95,
            ()=>{
                this.scene.get('AnimationScene').scene.stop();
                this.scene.get('SimplePiCalc').scene.stop();
                this.scene.get('MainScene').scene.stop();
                this.scene.launch('FadeScene', {shut: 'PauseScene', start: 'SimplePiCalc'});
                this.P2.resetEnergy();
                this.P1.resetEnergy();
        });

        this.buttonReset.setPosition(1920/2-130, 1080/2+75);
        this.add.text(1920/2-60, 1080/2+50, "Reset", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        const debugText = this.add.text(1760, 1020, "Change Debug",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20});
        debugText.setOrigin(0.5);
        const debugState = this.add.text(1760, 1050, "State: " + this.P1.getSystem().getDebugLogState(),{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20});
        debugState.setOrigin(0.5);


        this.buttonDebug = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg","button_options",0.95,
            ()=>{
            this.P1.getSystem().changeDebugLogger();
            debugState.setText("State: " + this.P1.getSystem().getDebugLogState());
            });

        this.buttonDebug.setPosition(1880, 1040);



        // Weapons Hints
        this.add.text(120,240,'Weapon Hints:',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 28, strokeThickness: 2});


        this.add.image(120,350,'ssr_weap_pro');
        this.add.image(120,400,'ssb_weap_pro');
        this.add.text(230,365,'Projectile Weapons attack laser shields.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});
        this.add.image(200, 375,"laser_shield");
        // this.add.image(200, 400, "rocket_shield");

        this.add.image(120,550,'ssr_weap_las');
        this.add.image(120,600,'ssb_weap_las');
        this.add.text(230,565,'Laser Weapons attack armor shields.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});
        this.add.image(200, 575,"armor_shield");
        // this.add.image(200, 600, "rocket_shield");

        this.add.image(120,750,'ssr_weap_rock');
        this.add.image(120,800,'ssb_weap_rock');
        this.add.text(230,750,'Rocket launchers attack armor, laser \nand hyper shields.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});
        this.add.image(200, 750,"armor_shield");
        this.add.image(218, 775,"rocket_shield");
        this.add.image(200, 800, "laser_shield");


        let animationText = this.add.text(1920/2-60, 1080/2+200, "Pi-Style: #1", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.changeAnimationButton = new Button(this, 1920/2-130, 1080/2+225, "button_shadow",
            "button_bg", "button_fg", "button_options",0.95, ()=>{
                let anim1: boolean = this.scene.isVisible("AnimationScene");
                if (anim1) {
                    this.scene.setVisible(false, "AnimationScene");
                    this.scene.setVisible(true, "SimplePiCalc");
                    animationText.setText("Pi-Style: #1")
                }
                else {
                    this.scene.setVisible(true, "AnimationScene");
                    this.scene.setVisible(false, "SimplePiCalc");
                    animationText.setText("Pi-Style: #2")
                }
            });


        // Shield Hints

        this.add.text(1920-400,240,'Shield Hints:',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 28, strokeThickness: 2});


        this.add.image(1920-120,340,'button_shield');
        this.add.image(1920-170,340,"laser_shield");
        this.add.text(1920-600,317,'Laser shields protect against\nlaser weapons.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});

        this.add.image(1920-120,460,'button_armor');
        this.add.image(1920-170,460, "armor_shield");
        this.add.text(1920-600,437,'Armor shields protect against\nprojectile weapons.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});

        this.add.image(1920-120,580,'button_rocket');
        this.add.image(1920-170,580, "rocket_shield");
        this.add.text(1920-600,557,'Hyper shields protect against\nlaser and projectile weapons.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});

        this.add.image(1920-120,700,'button_nano');
        this.add.image(1920-170,700, "nano_shield");
        this.add.text(1920-600,677,'Nano shields are cheap, but can be\nattacked by all kinds of weapons.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});

        this.add.image(1920-120,820,'button_adapt');
        this.add.image(1920-185,820, "adap_shield");
        this.add.image(1920-170,820, "adap_shield2");
        this.add.text(1920-600,785,'Adaptive shields can be attacked by\nall kinds of weapons. Second bar \nwill adapt to protect against the \nweapon that hit the first bar.', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24});

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;

            this.buttonReset.updateStep();
            this.buttonResume.updateStep();
            this.buttonDebug.updateStep();
            this.changeAnimationButton.updateStep();

        }
    }
}