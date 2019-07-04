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

export class Life4 extends TutSubScene{
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
        super(scene, 1, 1, 1);

        this.lifePrep = subScene;

        let str =
            "Congratulations.\nYou destroyed the enemy.\n\n" +
            "There are many different shield and weapon types.\n" +
            "In the next part you'll learn more about these.";

        this.tutText = new Text(this.scene, 1920/2, 300, str, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 38, fontStyle: 'bold', strokeThickness: 4, stroke: "#000"});
        this.tutText.setOrigin(0.5, 0.5);

        this.tutText.setVisible(false);
        this.tutArrow = scene.add.sprite(1920/2, 300, "red_arrow");
        this.tutArrow.setVisible(false);
        this.tutArrow.setScale(1.5);
        this.tutText.setDepth(10);
        this.tutArrow.setDepth(10);
        this.blockMainScene = true;
    }

    subIntro(delta: number): void {
        this.tutText.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.tutText.setAlpha(1);
    }

    subOutro(delta: number): void {
        this.continueButton.setVisible(true);
    }

    destroy(): void {
        this.tutArrow.destroy();
        this.tutText.destroy();
        this.continueButton.destroy();

        this.animationContainer.explosion.explosionAt(
            this.red.x, this.red.y, 0.7 * 2, 2.7 * 2
        );

        this.tutHeadline.destroy();
        this.red.destroy();
        this.blue.destroy();
        this.redHealth.destroy();
        this.blueHealth.destroy();
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