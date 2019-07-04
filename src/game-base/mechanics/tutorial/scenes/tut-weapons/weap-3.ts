import Text = Phaser.GameObjects.Text;
import {TutSubScene} from "../../tut-sub-scene";
import {ButtonWithText} from "../scene-mechanics/button-with-text";
import {TutRedShip} from "../scene-mechanics/tut-red-ship";
import {TutDrone} from "../scene-mechanics/tut-drone";
import {BulletInfo} from "../../../weapon/bulletInfo";
import {TutHealth} from "../scene-mechanics/tut-health";
import {TutAnimationContainer} from "../scene-mechanics/tut-animation-container";
import {TutHealthbar} from "../scene-mechanics/tut-healthbar";
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import {WeapPrep} from "./weap-prep";
import {WeapUtils} from "./weap-utils";


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

export class Weap3 extends TutSubScene{
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
        super(scene, 1, 1, 5);

        this.weapPrep = subScene;

        let str =
            "You can not hit your enemy.\n\n" +
            "But your enemy can also not hit you!";

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
        // this.tutArrow.setAlpha((delta % 0.2) < 0.1 ? 0 : 1);
        this.tutText.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.tutText.setAlpha(1);
        // this.tutArrow.setAlpha(1);

    }

    subOutro(delta: number): void {
        this.continueButton.setVisible(true);
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

        let sCounter = 0;
        this.shootE(sCounter);
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue.update(delta*1000);
        this.continueButton.update(delta);
    }


    private shootE(counter: number): void{
        if (counter > 3)return;
        WeapUtils.shoot(this.scene, this.blue, this.redHealth, this.blue.x, this.blue.y);
        this.scene.time.delayedCall(1800, this.shootE, [++counter], this);
    }


}