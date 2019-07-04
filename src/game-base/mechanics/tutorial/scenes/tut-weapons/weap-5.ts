import Text = Phaser.GameObjects.Text;
import Scene = Phaser.Scene;
import Sprite = Phaser.GameObjects.Sprite;
import {TutSubScene} from "../../tut-sub-scene";
import {TutRedShip} from "../scene-mechanics/tut-red-ship";
import {TutDrone} from "../scene-mechanics/tut-drone";
import {TutHealth} from "../scene-mechanics/tut-health";
import {TutAnimationContainer} from "../scene-mechanics/tut-animation-container";
import {WeapPrep} from "./weap-prep";
import {WeapUtils} from "./weap-utils";
import {TutShop} from "../scene-mechanics/tut-shop";
import {TutShopRowHigh} from "../scene-mechanics/tut-shop-row-high";
import {ButtonWithTextCD} from "../scene-mechanics/button-with-text-cd";
import {WeaponType} from "../../../weapon/weapon-type";


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

export class Weap5 extends TutSubScene{
    tutHeadline: Text;
    red: TutRedShip;
    redHealth: TutHealth;
    blue: TutDrone;
    blueHealth: TutHealth;
    animationContainer: TutAnimationContainer;

    tutText: Text;

    hintText: Text;

    weapL: Sprite;
    weapP: Sprite;
    weapR: Sprite;

    shiL: Sprite;
    shiA: Sprite;
    shiH1: Sprite;
    shiH2: Sprite;

    none: Text;



    weapPrep: WeapPrep;


    constructor(scene: Scene, subScene: WeapPrep) {
        super(scene, 1, 6, 1);

        this.weapPrep = subScene;

        let str =
            "Now try to defeat this powerful enemy.\nYou will regenerate 30 Energy per turn.";

        this.tutText = new Text(this.scene, 1920/2, 180, str, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 38, fontStyle: 'bold', strokeThickness: 4, stroke: "#000", align: "center"});

        str =
            "Weapon:\n" +
            "Blocked by:";

        this.hintText = new Text(this.scene, 530, 300, str, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 38, fontStyle: 'bold', strokeThickness: 4, stroke: "#000", align: "right"});


        str =
            "None";

        this.none = new Text(this.scene, 1200, 370, str, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24, fontStyle: 'bold', strokeThickness: 4, stroke: "#000", align: "right"});

        this.none.setOrigin(0.5, 0.5);

        this.tutText.setOrigin(0.5, 0.5);
        this.tutText.setVisible(false);


    }

    subIntro(delta: number): void {

        this.tutText.setAlpha(delta);
        this.hintText.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.tutText.setAlpha(1);
        this.hintText.setAlpha(1);

    }

    subOutro(delta: number): void {
    }

    destroy(): void {
        this.tutText.destroy();
        this.hintText.destroy();

        this.weapL.destroy();
        this.weapP.destroy();
        this.weapR.destroy();

        this.shiL.destroy();
        this.shiA.destroy();
        this.shiH2.destroy();
        this.shiH1.destroy();

        this.none.destroy();
    }

    launch(): void {
        this.tutHeadline = this.weapPrep.tutHeadline;
        this.red = this.weapPrep.red;
        this.blue = this.weapPrep.blue;
        this.redHealth = this.weapPrep.redHealth;
        this.blueHealth = this.weapPrep.blueHealth;
        this.animationContainer = this.weapPrep.animationContainer;

        this.scene.add.existing(this.tutText);
        this.tutText.setVisible(true);
        this.tutText.setAlpha(0);

        this.scene.add.existing(this.hintText);
        this.hintText.setVisible(true);
        this.hintText.setAlpha(0);

        this.scene.add.existing(this.none);
        this.none.setVisible(true);
        this.none.setAlpha(1);

        this.weapL = this.scene.add.sprite(800,330, "ssr_weap_las");
        this.weapP = this.scene.add.sprite(1000,330, "ssr_weap_pro");
        this.weapR = this.scene.add.sprite(1200,330, "ssr_weap_rock");

        this.shiL = this.scene.add.sprite(800, 370, "laser_shield");
        this.shiA = this.scene.add.sprite(1000, 370, "armor_shield");
        this.shiH1 = this.scene.add.sprite(820, 370, "rocket_shield");
        this.shiH2 = this.scene.add.sprite(1020, 370, "rocket_shield");
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue.update(delta*1000);
    }

}