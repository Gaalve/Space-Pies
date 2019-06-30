import {Button} from "../mechanics/button";
import {MainScene} from "./main-scene";
import Sprite = Phaser.GameObjects.Sprite;
import {Player} from "../mechanics/player";

export class EndSceneP1 extends Phaser.Scene {


    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;
    private fadetimeer :number;


    private buttonMain: Button;
    private buttonRestart: Button;
    //private buttonCredits: Button;
    private background;
    private titleText;
    private reseText;
    private mainText;
    private P1: Player;
    private P2: Player;

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
        this.fadetimeer=0;
        this.P1 = this.scene.get('MainScene').data.get("P1");
        this.P2 = this.scene.get('MainScene').data.get("P2");


        this.background = new Sprite(this, 960, 540, "button_bg");
        this.background.setScale(500);
        this.background.setTint(0x000000);
        this.add.existing(this.background);
        this.background.setAlpha(0);

        if (this.P1.isDead) {
            this.titleText = this.add.text(1920/2-200, 500, 'Player 2 Wins!', {
                fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
            });
        } else{
            this.titleText = this.add.text(1920/2-150, 500, 'Player 1 Wins!', {
                fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
            });
        }

        this.titleText.alpha=0;



        this.buttonRestart = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_skip",0.95,
            ()=>{
                this.scene.get('AnimationScene').scene.stop();
                this.scene.get('SimplePiCalc').scene.stop();
                this.scene.get('MainScene').scene.stop();
                this.scene.launch('FadeScene', {shut: 'EndSceneP1', start: 'SimplePiCalc'});
                this.P2.resetEnergy();
                this.P1.resetEnergy();
            });

        this.buttonRestart.setPosition(1920/2-100, 1080*2/3);
        this.buttonRestart.removeInteractive();
        this.buttonRestart.setInvisible();

        this.buttonMain = new Button(this, 1920/2-100, 1080*2/3 + 200, "button_shadow",
            "button_bg", "button_fg", "button_skip",0.95,
            ()=>{
                this.scene.get("GuiScene").scene.sleep();
                this.scene.get('AnimationScene').scene.stop();
                this.scene.get('SimplePiCalc').scene.stop();
                this.scene.get('MainScene').scene.stop();
                this.scene.launch('FadeScene', {shut: 'EndSceneP1', start: 'StartScene'});
                this.P2.resetEnergy();
                this.P1.resetEnergy();
            });

        this.buttonMain.removeInteractive();
        this.buttonMain.setInvisible();

        this.reseText = this.add.text(1920/2, 1080*2/3-25, "Restart", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.reseText.alpha=0;

        this.mainText = this.add.text(1920/2, 1080*2/3+175, "Back to main", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.mainText.alpha=0;

        let options = this.scene.get("MainScene").data.get("buttonOptions");
        options.removeInteractive();
        options.setInvisible();
        let botLog = this.scene.get("MainScene").data.get("buttonBotLog");
        botLog.removeInteractive();
        botLog.setInvisible();

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        this.fadetimeer+=delta/2;
        let setvis;
        if(this.fadetimeer<4500) {
            setvis=false;
            this.titleText.alpha=this.fadetimeer/4500;
            this.background.setAlpha(this.fadetimeer/9000);
        } else {
            if(!setvis){
                this.background.setAlpha(0.5);
                this.titleText.alpha=1;
                this.reseText.alpha=1;
                this.mainText.alpha=1;
                this.buttonRestart.restoreInteractive();
                this.buttonRestart.setVisible();
                this.buttonMain.restoreInteractive();
                this.buttonMain.setVisible();
                setvis=true;
            }
        }

        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.buttonRestart.updateStep();
            this.buttonMain.updateStep();
            //this.buttonCredits.updateStep();

        }
    }
}