import {Button} from "../mechanics/button";
import {MainScene} from "./main-scene";

export class StartScene extends Phaser.Scene {


    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private buttonStart: Button;
    private buttonSettings: Button;

    private Player1start = new Phaser.Math.Vector2(280, 540);
    private Player2start = new Phaser.Math.Vector2(1650, 540);
    private Radius=150;
    private path;
    private path2;
    private graphics;
    private ship;
    private ship2;

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

        // creat path 1
        this.path = new Phaser.Curves.Path(this.Player1start.x+this.Radius-25, 1900);
        this.path.lineTo(this.Player1start.x+this.Radius-25, this.Player1start.y-this.Radius);
        this.path.ellipseTo(this.Radius, this.Radius, 0, 90, true);
        this.path.lineTo(this.Player1start.x-5, this.Player1start.y);
        this.path.lineTo(this.Player1start.x, this.Player1start.y);

        // creat path 2
        this.path2 = new Phaser.Curves.Path(this.Player2start.x-this.Radius+25, 1900);
        this.path2.lineTo(this.Player2start.x-this.Radius+25, this.Player2start.y-this.Radius);
        this.path2.ellipseTo(-this.Radius, -this.Radius, 0, 270, false);
        this.path2.lineTo(this.Player2start.x+15, this.Player2start.y);
        this.path2.lineTo(this.Player2start.x, this.Player2start.y);



        // show path
        /*
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff, 1);
        this.path.draw(this.graphics, 128);
        this.path2.draw(this.graphics, 128);
        */


        this.ship = this.add.follower(this.path, this.Player1start.x+this.Radius-25, 1900, 'ssr_ship_on');
        this.ship2 = this.add.follower(this.path2, this.Player2start.x-this.Radius+25, 1900, 'ssb_ship_on_rot');



        this.ship.startFollow({
            ease: 'Linear',
            duration: 8000,
            rotateToPath: true,
            verticalAdjust: true
            //callbackAtEnd: this.enda()
        });

        this.ship2.startFollow({
            duration: 8000,
            rotateToPath: true,
            verticalAdjust: true,
        });


        const titleText = this.add.text(1920/2-160, 200, 'Main-Menu', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });



        this.buttonStart = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_resume",
            ()=>{
                this.scene.launch('FadeScene', {shut: 'StartScene', start: 'MainScene'});
                this.scene.bringToTop('FadeScene')}
        );

        this.buttonStart.setPosition(1920/2-150, 1080/2-75);

        const StartText = this.add.text(1920/2-70, 1080/2-110, "Start Game", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});



        this.buttonSettings = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_options",
            ()=>{
            });

        this.buttonSettings.setPosition(1920/2-150, 1080/2+75);

        const SettingsText = this.add.text(1920/2-70, 1080/2+50, "Settings", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;

            this.buttonStart.updateStep();
            this.buttonSettings.updateStep();

        }
    }

}