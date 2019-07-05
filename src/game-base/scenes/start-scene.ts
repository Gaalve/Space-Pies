import {Button} from "../mechanics/button";
import {MainScene} from "./main-scene";

export class StartScene extends Phaser.Scene {


    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private buttonTutorial: Button;
    private buttonStart: Button;
    private buttonCredits: Button;

    private buttonSP: Button;
    private buttonMP: Button;
    private buttonReturnMain: Button;

    private buttonP1: Button;
    private buttonP2: Button;
    private buttonReturnMode: Button;

    private buttonFromCreditsToMain: Button;


    private titleText: Phaser.GameObjects.Text;
    private tutorialText: Phaser.GameObjects.Text;
    private startText: Phaser.GameObjects.Text;
    private settingsText: Phaser.GameObjects.Text;
    private chooseModeText: Phaser.GameObjects.Text;
    private singleText: Phaser.GameObjects.Text;
    private multiText: Phaser.GameObjects.Text;
    private choosePlayerText: Phaser.GameObjects.Text;
    private olafText: Phaser.GameObjects.Text;
    private holgerText: Phaser.GameObjects.Text;
    private backText: Phaser.GameObjects.Text;
    private creditsText: Phaser.GameObjects.Text;
    private creditsText2: Phaser.GameObjects.Text;
    private creditsHeader: Phaser.GameObjects.Text;

    private Player1start = new Phaser.Math.Vector2(280, 540);
    private Player2start = new Phaser.Math.Vector2(1650, 540);
    private Radius=150;
    private path;
    private path2;
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
        this.path.ellipseTo(this.Radius, this.Radius, 0, 90, true, 0);
        this.path.lineTo(this.Player1start.x-5, this.Player1start.y);
        this.path.lineTo(this.Player1start.x, this.Player1start.y);

        // creat path 2
        this.path2 = new Phaser.Curves.Path(this.Player2start.x-this.Radius+25, 1900);
        this.path2.lineTo(this.Player2start.x-this.Radius+25, this.Player2start.y-this.Radius);
        this.path2.ellipseTo(-this.Radius, -this.Radius, 0, 270, false, 0);
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
            duration: 3500,
            rotateToPath: true,
            verticalAdjust: true
            //callbackAtEnd: this.enda()
        });

        this.ship2.startFollow({
            duration: 3500,
            rotateToPath: true,
            verticalAdjust: true,
        });


        this.titleText = this.add.text(1920/2, 100, 'Main-Menu', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });
        this.titleText.setOrigin(0.5);

        this.buttonStart = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_resume",0.95,
            ()=>{
            this.changeToMode();
        });

        this.buttonStart.setPosition(1920/2-150, 1080/2-75);

        this.startText = this.add.text(1920/2-70, 1080/2-110, "Start Game", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.buttonTutorial = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_resume",0.95,
            ()=>{
                this.scene.launch('FadeScene', {shut: 'StartScene', start: 'TutorialScene', mode: '0'});
            });

        this.buttonTutorial.setPosition(1920/2-150, 1080/2-175);

        this.tutorialText = this.add.text(1920/2-70, 1080/2-210, "Noob? Tutorial!", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});



        this.buttonCredits = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_options",0.95,
            ()=>{this.changeToCredits();
            });

        this.buttonCredits.setPosition(1920/2-150, 1080/2+75);

        this.settingsText = this.add.text(1920/2-70, 1080/2+50, "Credits", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.creditsText = this.add.text(1920/2-200, 1080/2-50,
            "Adrian\n" +
            "(Product-owner)\n" +
            "\nJanis\n" +
            "(Developer)\n" +
            "\nLars\n" +
            "(M-R-manager)\n" +
            "\nPatrick B.\n" +
            "(D-O-engineer)",
            {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 38, strokeThickness: 1});
        this.creditsText.setOrigin(0.5, 0.5);
        this.creditsText.setAlign("center");
        this.creditsText.setVisible(false);

        this.creditsText2 = this.add.text(1920/2+200, 1080/2-50,
            "Louis\n" +
            "(Scrum-master)\n" +
            "\nKara\n" +
            "(Developer)\n" +
            "\nMax\n" +
            "(Developer)\n" +
            "\nPatrick R.\n" +
            "(M-R-manager)",
            {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 38, strokeThickness: 1});
        this.creditsText2.setOrigin(0.5, 0.5);
        this.creditsText2.setAlign("center");
        this.creditsText2.setVisible(false);

        this.creditsHeader = this.add.text(1920/2, 1080/2-400, "Credits", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 64, strokeThickness: 2});
        this.creditsHeader.setOrigin(0.5);
        this.creditsHeader.setVisible(false);


        //Buttons and Text for choose Mode
        this.chooseModeText = this.add.text(1920/2, 100, 'Which mode do you want to play?', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });
        this.chooseModeText.setVisible(false);
        this.chooseModeText.setOrigin(0.5);

        this.buttonSP = new Button(this, 1920/2-280, 1080/2-75, "button_shadow",
            "button_bg", "button_fg", "singleplayer", 1, ()=>{
                this.changeToPlayer();
            });
        this.singleText = this.add.text(1920/2-200, 1080/2-110, "Play against the computer", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.singleText.setVisible(false);
        this.buttonSP.removeInteractive();
        this.buttonSP.setInvisible();

        this.buttonMP = new Button(this, 1920/2-280, 1080/2+75, "button_shadow",
            "button_bg", "button_fg", "multiplayer", 1, ()=>{
                this.scene.launch('FadeScene', {shut: 'StartScene', start: 'GuiScene', mode: '0'});
            });
        this.multiText = this.add.text(1920/2-200, 1080/2+50, "Play against a human friend", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.multiText.setVisible(false);
        this.buttonMP.removeInteractive();
        this.buttonMP.setInvisible();

        //Buttons and Text for choose Player in Singleplayer
        this.choosePlayerText = this.add.text(1920/2, 100, 'Which player do you want to be?', {
            fill: '#f0f1ff', fontFamily: '"Roboto"', fontSize: 60, fontStyle: 'bold', strokeThickness: 2
        });
        this.choosePlayerText.setVisible(false);
        this.choosePlayerText.setOrigin(0.5);

        this.buttonP1 = new Button(this, 1920/2, 1080/2-100, "button_shadow",
            "button_bg", "button_fg", "red_arrow", 1, ()=>{
                this.scene.launch('FadeScene', {shut: 'StartScene', start: 'GuiScene', mode: '1'});
                this.scene.bringToTop('FadeScene')
            });
        this.olafText = this.add.text(1920/2, 1080/2-220, "Play as Olaf (Player 1)\ntrying to escape with the stolen cake.", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.olafText.setVisible(false);
        this.olafText.setOrigin(0.5);
        this.olafText.setAlign("center");
        this.buttonP1.removeInteractive();
        this.buttonP1.setInvisible();

        this.buttonP2 = new Button(this, 1920/2, 1080/2+100, "button_shadow",
            "button_bg", "button_fg", "blue_arrow", 1, ()=>{
                this.scene.launch('FadeScene', {shut: 'StartScene', start: 'GuiScene', mode: '2'});
                this.scene.bringToTop('FadeScene')
            });
        this.holgerText = this.add.text(1920/2, 1080/2+220, "Play as Olga (Player 2)\ntrying to stop the thief.", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.holgerText.setVisible(false);
        this.holgerText.setOrigin(0.5);
        this.holgerText.setAlign("center");
        this.buttonP2.removeInteractive();
        this.buttonP2.setInvisible();

        this.buttonReturnMain = new Button(this, 1920/2, 1080 - 130, "button_shadow",
            "button_bg", "button_fg", "button_back", 1, ()=>{
            this.returnToMain();
            });
        this.buttonReturnMain.setInvisible();
        this.buttonReturnMain.removeInteractive();

        this.buttonReturnMode = new Button(this, 1920/2, 1080 - 130, "button_shadow",
            "button_bg", "button_fg", "button_back", 1, ()=>{
            this.returnToMode();
            });
        this.buttonReturnMode.setInvisible();
        this.buttonReturnMode.removeInteractive();

        this.backText = this.add.text(1920/2, 1080-60, "Back", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 32, strokeThickness: 2});
        this.backText.setOrigin(0.5);
        this.backText.setVisible(false);

        this.buttonFromCreditsToMain = new Button(this, 1920/2, 1080 - 130, "button_shadow",
            "button_bg", "button_fg", "button_back", 1, ()=>{
                this.fromCreditsToMain();
            });
        this.buttonFromCreditsToMain.setInvisible();
    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;

            this.buttonStart.updateStep();
            this.buttonTutorial.updateStep();
            this.buttonCredits.updateStep();
            this.buttonSP.updateStep();
            this.buttonMP.updateStep();
            this.buttonP1.updateStep();
            this.buttonP2.updateStep();
            this.buttonReturnMain.updateStep();
            this.buttonReturnMode.updateStep();
            this.buttonFromCreditsToMain.updateStep();

        }
    }

    private changeToMode(): void{
        this.titleText.setVisible(false);
        this.buttonTutorial.removeInteractive();
        this.buttonTutorial.setInvisible();
        this.tutorialText.setVisible(false);
        this.buttonStart.removeInteractive();
        this.buttonStart.setInvisible();
        this.startText.setVisible(false);
        this.buttonCredits.removeInteractive();
        this.buttonCredits.setInvisible();
        this.settingsText.setVisible(false);
        this.buttonSP.restoreInteractive();
        this.buttonMP.restoreInteractive();
        this.buttonSP.setVisible();
        this.buttonMP.setVisible();
        this.chooseModeText.setVisible(true);
        this.singleText.setVisible(true);
        this.multiText.setVisible(true);
        this.buttonReturnMain.setVisible();
        this.buttonReturnMain.restoreInteractive();
        this.backText.setVisible(true);
    }

    private changeToPlayer(): void{
        this.chooseModeText.setVisible(false);
        this.singleText.setVisible(false);
        this.multiText.setVisible(false);
        this.buttonSP.removeInteractive();
        this.buttonMP.removeInteractive();
        this.buttonSP.setInvisible();
        this.buttonMP.setInvisible();
        this.buttonReturnMain.setInvisible();
        this.buttonReturnMain.removeInteractive();

        this.olafText.setVisible(true);
        this.holgerText.setVisible(true);
        this.choosePlayerText.setVisible(true);
        this.buttonP1.restoreInteractive();
        this.buttonP2.restoreInteractive();
        this.buttonP1.setVisible();
        this.buttonP2.setVisible();
        this.buttonReturnMode.setVisible();
        this.buttonReturnMode.restoreInteractive();
    }

    private returnToMain(): void{
        this.titleText.setVisible(true);
        this.buttonTutorial.restoreInteractive();
        this.buttonTutorial.setVisible();
        this.tutorialText.setVisible(true);
        this.buttonStart.restoreInteractive();
        this.buttonStart.setVisible();
        this.startText.setVisible(true);
        this.buttonCredits.restoreInteractive();
        this.buttonCredits.setVisible();
        this.settingsText.setVisible(true);
        this.buttonSP.removeInteractive();
        this.buttonMP.removeInteractive();
        this.buttonSP.setInvisible();
        this.buttonMP.setInvisible();
        this.chooseModeText.setVisible(false);
        this.singleText.setVisible(false);
        this.multiText.setVisible(false);
        this.backText.setVisible(false);
        this.buttonReturnMain.setInvisible();
        this.buttonReturnMain.removeInteractive();
    }

    private returnToMode(): void{
        this.chooseModeText.setVisible(true);
        this.singleText.setVisible(true);
        this.multiText.setVisible(true);
        this.buttonSP.restoreInteractive();
        this.buttonMP.restoreInteractive();
        this.buttonSP.setVisible();
        this.buttonMP.setVisible();
        this.buttonReturnMode.setInvisible();
        this.buttonReturnMode.removeInteractive();

        this.olafText.setVisible(false);
        this.holgerText.setVisible(false);
        this.choosePlayerText.setVisible(false);
        this.buttonP1.removeInteractive();
        this.buttonP2.removeInteractive();
        this.buttonP1.setInvisible();
        this.buttonP2.setInvisible();
        this.buttonReturnMain.setVisible();
        this.buttonReturnMain.restoreInteractive();
    }

    private changeToCredits():void{
        this.buttonTutorial.setInvisible();
        this.buttonTutorial.removeInteractive();
        this.tutorialText.setVisible(false);
        this.buttonStart.setInvisible();
        this.buttonStart.removeInteractive();
        this.startText.setVisible(false);
        this.titleText.setVisible(false);
        this.buttonCredits.setInvisible();
        this.buttonCredits.removeInteractive();
        this.settingsText.setVisible(false);

        this.buttonFromCreditsToMain.setVisible();
        this.buttonFromCreditsToMain.restoreInteractive();
        this.backText.setVisible(true);
        this.creditsText.setVisible(true);
        this.creditsText2.setVisible(true);
        this.creditsHeader.setVisible(true);
    }

    private fromCreditsToMain():void{
        this.creditsText.setVisible(false);
        this.creditsText2.setVisible(false);
        this.creditsHeader.setVisible(false);
        this.buttonFromCreditsToMain.setInvisible();
        this.buttonFromCreditsToMain.removeInteractive();
        this.backText.setVisible(false);

        this.buttonTutorial.setVisible();
        this.buttonTutorial.restoreInteractive();
        this.tutorialText.setVisible(true);
        this.buttonStart.setVisible();
        this.buttonStart.restoreInteractive();
        this.startText.setVisible(true);
        this.titleText.setVisible(true);
        this.buttonCredits.setVisible();
        this.buttonCredits.restoreInteractive();
        this.settingsText.setVisible(true);
    }
}