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

export class Weap4 extends TutSubScene{
    tutHeadline: Text;
    red: TutRedShip;
    redHealth: TutHealth;
    blue: TutDrone;
    blueHealth: TutHealth;
    animationContainer: TutAnimationContainer;

    tutText: Text;
    tutArrow: Sprite;

    weapPrep: WeapPrep;

    shop: TutShop;

    constructor(scene: Scene, subScene: WeapPrep) {
        super(scene, 1, 6, 1);

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


        let weapRow = new TutShopRowHigh(scene, [
            new ButtonWithTextCD(scene, "ssb_weap_las", "Laser", ()=>this.buyWeapon(WeaponType.LASER_ARMOR),0,0)
        ]);

        let endTurn = ()=>this.endRound();

        this.shop = new class extends TutShop {
            public constructor(){
                super(scene, [
                    new ButtonWithTextCD(scene, "button_wext", "Weapons", ()=>weapRow.setVisible(true), 0,0),
                    new ButtonWithTextCD(scene, "button_skip", "End Turn", ()=>endTurn(), 0,0)
                ], [weapRow]);
            }
        };
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
    }

    destroy(): void {
        this.tutArrow.destroy();
        this.tutText.destroy();
        this.blue.explode();
    }

    launch(): void {
        this.tutHeadline = this.weapPrep.tutHeadline;
        this.red = this.weapPrep.red;
        this.blue = this.weapPrep.blue;
        this.redHealth = this.weapPrep.redHealth;
        this.blueHealth = this.weapPrep.blueHealth;
        this.animationContainer = this.weapPrep.animationContainer;
        this.scene.add.existing(this.tutText);

        this.tutArrow.setVisible(true);
        this.tutText.setVisible(true);
        this.tutText.setAlpha(0);
        this.tutArrow.setAlpha(0);
        this.shop.setVisible(true);
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue.update(delta*1000);
        this.shop.update(delta);
    }


    private buyWeapon(type: WeaponType): void{
        if (this.red.drone.getNrWeapons() == 3) return;
        switch (type){
            case WeaponType.LASER_ARMOR:
                this.red.drone.addWeapon("arm");
                break;
            case WeaponType.PROJECTILE_SHIELD:
                this.red.drone.addWeapon("shi");
                break;
            case WeaponType.ROCKET:
                this.red.drone.addWeapon("roc");
                break;
            case WeaponType.NONE:
                break;
        }
    }

    private endRound(): void{
        this.shop.setVisible(false);
        this.scene.time.delayedCall(200, ()=>this.shootP(), [], this);
        this.scene.time.delayedCall(2800, ()=>{
            if (this.blueHealth.shipBar.bars.length > 0) this.shootE();
        }, [], this);
        this.scene.time.delayedCall(5400, ()=>{
            if (this.blueHealth.shipBar.bars.length == 0) this.blockMainScene = false;
            else this.shop.setVisible(true)}, [], this);
    }


    private shootE(): void{
        WeapUtils.shoot(this.scene, this.blue, this.redHealth, this.red.x, this.red.y);
    }

    private shootP(): void{
        WeapUtils.shoot(this.scene, this.red.drone, this.blueHealth, this.blue.x, this.blue.y);
    }

}