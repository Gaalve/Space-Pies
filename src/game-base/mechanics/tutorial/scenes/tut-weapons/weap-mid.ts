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

export class WeapMid extends TutSubScene{
    tutHeadline: Text;
    red: TutRedShip;
    redHealth: TutHealth;
    blue: TutDrone;
    blueHealth: TutHealth;
    animationContainer: TutAnimationContainer;

    weapPrep: WeapPrep;

    constructor(scene: Scene, subScene: WeapPrep) {
        super(scene, 1, 6, 1);

        this.weapPrep = subScene;
    }

    subIntro(delta: number): void {
    }

    subScene(delta: number): void {
    }

    subOutro(delta: number): void {
    }

    destroy(): void {
    }

    launch(): void {
        this.tutHeadline = this.weapPrep.tutHeadline;
        this.red = this.weapPrep.red;
        this.blue = this.weapPrep.blue;
        this.redHealth = this.weapPrep.redHealth;
        this.blueHealth = this.weapPrep.blueHealth;
        this.animationContainer = this.weapPrep.animationContainer;
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue.update(delta*1000);
    }

}