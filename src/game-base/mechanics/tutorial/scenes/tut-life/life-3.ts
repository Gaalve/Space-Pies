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

export class Life3 extends TutSubScene{
    tutHeadline: Text;
    button: ButtonWithText;
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
            "Now kill the enemy drone by destroying all HitZones.";

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

        let block = false;
        this.button = new ButtonWithText(scene, "sym_zone", "Shoot Projectile", ()=>{if(!block){
            this.shootP(); this.scene.time.delayedCall(1500, ()=>block = false, [], this); block = true;
        }}, 1920/2, 1080/2 + 400);
        this.button.setVisible(false);
    }

    subIntro(delta: number): void {
        // this.tutArrow.setAlpha((delta % 0.2) < 0.1 ? 0 : 1);
        this.tutText.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.tutText.setAlpha(1);
        // this.tutArrow.setAlpha(1);
        // this.continueButton.setVisible(true);
    }

    subOutro(delta: number): void {
        this.button.setVisible(true);
        // this.tutText.setAlpha(1);
    }

    destroy(): void {
        this.tutArrow.destroy();
        this.tutText.destroy();
        this.continueButton.destroy();
        this.button.setVisible(false);
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
        this.button.update(delta);
        this.blue.update(delta*1000);
        this.continueButton.update(delta);
    }


    private shootP(): void{
        this.red.drone.getWeapons()[0].createBullet(new BulletInfo(
            false, this.blue.x - 20, this.blue.y
        ));
        let activeHealth: TutHealthbar[] = [];
        if (this.blueHealth.zone1Bar.bars.length > 0) activeHealth.push(this.blueHealth.zone1Bar);
        if (this.blueHealth.zone2Bar.bars.length > 0) activeHealth.push(this.blueHealth.zone2Bar);
        if (this.blueHealth.zone3Bar.bars.length > 0) activeHealth.push(this.blueHealth.zone3Bar);
        if (this.blueHealth.zone4Bar.bars.length > 0) activeHealth.push(this.blueHealth.zone4Bar);
        if(activeHealth.length > 0){
            activeHealth[Math.floor(activeHealth.length * Math.random())].destroyBar();
            this.blueHealth.shipBar.destroyBar();
            if (activeHealth.length == 1){
                this.scene.time.delayedCall(280, ()=>{this.blue.explode()}, [], this);
                this.scene.time.delayedCall(2500, ()=>{this.blockMainScene = false;}, [], this)
            }
        }
    }

}