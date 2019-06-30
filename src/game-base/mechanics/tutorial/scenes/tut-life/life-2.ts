import Text = Phaser.GameObjects.Text;
import {TutSubScene} from "../../tut-sub-scene";
import {ButtonWithText} from "../scene-mechanics/button-with-text";
import {TutRedShip} from "../scene-mechanics/tut-red-ship";
import {TutDrone} from "../scene-mechanics/tut-drone";
import {BulletInfo} from "../../../weapon/bulletInfo";
import {TutHealth} from "../scene-mechanics/tut-health";
import {TutAnimationContainer} from "../scene-mechanics/tut-animation-container";
import {HealthType} from "../../../health/health-type";
import {TutHealthbar} from "../scene-mechanics/tut-healthbar";
import {LifePrep} from "./life-prep";
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;


/***
 * Disclaimer:
 *
 * The life tutorial should show the player the different HitZones and their effect on the life of ship.
 *
 *
 * This scene will provide the following objects:
 * + blend in animation (dust-animation)
 * + Red - Ship with projectile weapon
 * + Blue - Drone with laser weapon
 * + Red - Life with all being laser shields
 * + Blue - Life with all being laser shields
 */

export class Life2 extends TutSubScene{
    tutHeadline: Text;
    red: TutRedShip;
    redHealth: TutHealth;
    blue: TutDrone;
    blueHealth: TutHealth;
    animationContainer: TutAnimationContainer;

    tutText: Text;
    tutArrow: Sprite;

    lifePrep: LifePrep;

    continueButton: ButtonWithText;

    constructor(scene: Scene, subScene: LifePrep) {
        super(scene, 4, 1, 1);

        this.lifePrep = subScene;

        let str =
            "This is your LifeBar.\n" +
            "Your ship has 4 Life Points.\n" +
            "If one of your HitZones gets destroyed,\n" +
            "you will lose one Life Point. If you lose all\n" +
            "Life Points, your ship will explode and you lose the game.";

        this.tutText = new Text(this.scene, 270, 70, str, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24, fontStyle: 'bold', strokeThickness: 4, stroke: "#000"});
        this.tutText.setOrigin(0, 0);

        this.tutText.setVisible(false);
        this.tutArrow = scene.add.sprite(220, 120, "red_arrow");
        this.tutArrow.setVisible(false);
        this.tutArrow.setScale(1.5);
        this.tutText.setDepth(10);
        this.tutArrow.setDepth(10);
        this.blockMainScene = true;

    }

    subIntro(delta: number): void {
        this.tutArrow.setAlpha((delta % 0.2) < 0.1 ? 0 : 1);
        this.tutText.setAlpha(0);
    }

    subScene(delta: number): void {
        this.tutText.setAlpha(delta);
        this.tutArrow.setAlpha(1);
        this.continueButton.setVisible(true);
    }

    subOutro(delta: number): void {
        this.tutText.setAlpha(1);
    }

    destroy(): void {
        this.tutArrow.destroy();
        this.tutText.destroy();
        this.continueButton.destroy();
    }

    launch(): void {
        this.tutHeadline = this.lifePrep.tutHeadline;
        this.red = this.lifePrep.red;
        this.blue = this.lifePrep.blue;
        this.redHealth = this.lifePrep.redHealth;
        this.blueHealth = this.lifePrep.blueHealth;
        this.animationContainer = this.lifePrep.animationContainer;
        this.scene.add.existing(this.tutText);
        let block = false;
        this.continueButton = new ButtonWithText(this.scene, "blue_arrow", "Continue", ()=>{if(!block){
            this.blockMainScene = false; this.scene.time.delayedCall(2000, ()=>block = false, [], this); block = true;
        }}, 1920/2, 1080/2 + 400);
        this.continueButton.setVisible(false);

        this.tutArrow.setVisible(true);
        this.tutText.setVisible(true);
        this.tutText.setAlpha(0);
        this.tutArrow.setAlpha(0);
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue.update(delta*1000);
        this.continueButton.update(delta);
    }

}