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
import {HealthType} from "../../../health/health-type";


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

export class Weap6 extends TutSubScene{
    tutHeadline: Text;
    red: TutRedShip;
    redHealth: TutHealth;

    blue1: TutDrone;
    blue2: TutDrone;
    blue3: TutDrone;
    blue4: TutDrone;

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

    shop: TutShop;


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

        this.blockMainScene = true;

        let weapRow = new TutShopRowHigh(scene, [
            new ButtonWithTextCD(scene, "ssb_weap_las", "Laser", ()=>this.buyWeapon(WeaponType.LASER_ARMOR),0,0),
            new ButtonWithTextCD(scene, "ssb_weap_pro", "Projectile", ()=>this.buyWeapon(WeaponType.PROJECTILE_SHIELD),0,0),
            new ButtonWithTextCD(scene, "ssb_weap_rock", "Rocket", ()=>this.buyWeapon(WeaponType.ROCKET),0,0)
        ]);

        let shieRow = new TutShopRowHigh(scene, [
            new ButtonWithTextCD(scene, "button_shield", "Laser Shield", ()=>this.buyShield(HealthType.ShieldBar),0,0),
            new ButtonWithTextCD(scene, "button_armor", "Armor Shield", ()=>this.buyShield(HealthType.ArmorBar),0,0),
            new ButtonWithTextCD(scene, "button_rocket", "Hyper Shield", ()=>this.buyShield(HealthType.RocketBar),0,0)
        ]);

        let endTurn = ()=>this.endRound();

        this.shop = new class extends TutShop {
            public constructor(){
                super(scene, [
                    new ButtonWithTextCD(scene, "button_regen", "Shields", ()=>shieRow.setVisible(true), 0,0),
                    new ButtonWithTextCD(scene, "button_wext", "Weapons", ()=>weapRow.setVisible(true), 0,0),
                    new ButtonWithTextCD(scene, "button_skip", "End Turn", ()=>endTurn(), 0,0)
                ], [weapRow, shieRow]);
            }
        };

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
    }

    launch(): void {
        this.tutHeadline = this.weapPrep.tutHeadline;
        this.red = this.weapPrep.red;
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

        this.blue1 = new TutDrone(this.scene, 1300,540, 1, false);
        this.blue2 = new TutDrone(this.scene, 1600,540, 2, false);
        this.blue3 = new TutDrone(this.scene, 1600,740, 3, false);
        this.blue4 = new TutDrone(this.scene, 1600,340, 3, false);

        this.blue1.create();
        this.blue2.create();
        this.blue3.create();
        this.blue4.create();

        this.blue1.addWeapon("arm");
        this.blue1.addWeapon("shi");
        this.blue1.addWeapon("shi");

        this.blue2.addWeapon("shi");
        this.blue2.addWeapon("arm");
        this.blue2.addWeapon("arm");

        this.blue3.addWeapon("arm");
        this.blue3.addWeapon("shi");
        this.blue3.addWeapon("shi");

        this.blue4.addWeapon("shi");
        this.blue4.addWeapon("arm");
        this.blue4.addWeapon("arm");

        this.animationContainer.dustAnimation.at(this.blue1.x, this.blue1.y,80, 200);
        this.animationContainer.dustAnimation.at(this.blue2.x, this.blue2.y,80, 200);
        this.animationContainer.dustAnimation.at(this.blue3.x, this.blue3.y,80, 200);
        this.animationContainer.dustAnimation.at(this.blue4.x, this.blue4.y,80, 200);

        this.red.drone.deleteWeapons();
        this.shop.setVisible(true);
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue1.update(delta * 1000);
        this.blue2.update(delta * 1000);
        this.blue3.update(delta * 1000);
        this.blue4.update(delta * 1000);
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

    private buyShield(type: HealthType): void{
        if (this.red.drone.getNrWeapons() == 3) return;
        switch (type){
            case HealthType.HitZoneBar:
                break;
            case HealthType.ShieldBar:
                break;
            case HealthType.ArmorBar:
                break;
            case HealthType.AdaptiveBar:
                break;
            case HealthType.AdaptiveBar2:
                break;
            case HealthType.NanoBar:
                break;
            case HealthType.RocketBar:
                break;
            case HealthType.ArmorBarSmall:
                break;
            case HealthType.ShieldBarSmall:
                break;
        }
    }

    private endRound(): void{
        this.shop.setVisible(false);
        this.scene.time.delayedCall(200, ()=>this.shootP(), [], this);
        this.scene.time.delayedCall(2800, ()=>{
            if (this.blueHealth.shipBar.bars.length > 0) this.shootE();
        }, [], this);
        this.scene.time.delayedCall(11400, ()=>{
            if (this.blueHealth.shipBar.bars.length == 0) this.blockMainScene = false;
            else this.shop.setVisible(true)}, [], this);
    }


    private shootE(): void{
        WeapUtils.shoot(this.scene, this.blue1, this.redHealth, this.red.x, this.red.y);
        this.scene.time.delayedCall(2500,()=>WeapUtils.shoot(this.scene, this.blue2, this.redHealth, this.red.x, this.red.y), [], this);
        this.scene.time.delayedCall(5000,()=>WeapUtils.shoot(this.scene, this.blue3, this.redHealth, this.red.x, this.red.y), [], this);
        this.scene.time.delayedCall(7500,()=>WeapUtils.shoot(this.scene, this.blue4, this.redHealth, this.red.x, this.red.y), [], this);
    }

    private shootP(): void{
        WeapUtils.shoot(this.scene, this.red.drone, this.blueHealth, this.blue1.x, this.blue1.y);
    }

}