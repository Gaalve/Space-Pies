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
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import {WeapPrep} from "./weap-prep";


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

export class Weap1 extends TutSubScene{
    tutHeadline: Text;
    red: TutRedShip;
    redHealth: TutHealth;
    blue: TutDrone;
    blueHealth: TutHealth;
    animationContainer: TutAnimationContainer;

    tutText: Text;
    tutArrow: Sprite;

    weapPrep: WeapPrep;

    continueButton: ButtonWithText;

    constructor(scene: Scene, subScene: WeapPrep) {
        super(scene, 3, 1, 1);

        this.weapPrep = subScene;

        let str =
            "This is one of your Weapons.\n" +
            "It is a Projectile Weapon and can only destroy\n" +
            "Laser Shields, Nano Shields and Adaptive Shields.\n" +
            "Your enemy uses Armor Shields and therefore your weapon\n" +
            "is not able to this shield.";

        this.tutText = new Text(this.scene, 570, 540, str, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24, fontStyle: 'bold', strokeThickness: 4, stroke: "#000"});
        this.tutText.setOrigin(0, 0.5);
        scene.add.existing(this.tutText);
        this.tutText.setVisible(false);
        this.tutArrow = scene.add.sprite(520, 540, "red_arrow");
        this.tutArrow.setVisible(false);
        this.tutArrow.setScale(2);
        this.tutText.setDepth(10);
        this.tutArrow.setDepth(10);
        this.blockMainScene = true;
        this.tutText.setAlpha(0);
        this.tutArrow.setAlpha(0);

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
        this.tutHeadline = this.weapPrep.tutHeadline;
        this.red = this.weapPrep.red;
        this.blue = this.weapPrep.blue;
        this.redHealth = this.weapPrep.redHealth;
        this.blueHealth = this.weapPrep.blueHealth;
        this.animationContainer = this.weapPrep.animationContainer;

        let block = false;
        this.continueButton = new ButtonWithText(this.scene, "blue_arrow", "Continue", ()=>{if(!block){
            this.blockMainScene = false; this.scene.time.delayedCall(2000, ()=>block = false, [], this); block = true;
        }}, 1920/2, 1080/2 + 400);
        this.continueButton.setVisible(false);

        this.tutArrow.setVisible(true);
        this.tutText.setVisible(true);
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue.update(delta*1000);
    }

}