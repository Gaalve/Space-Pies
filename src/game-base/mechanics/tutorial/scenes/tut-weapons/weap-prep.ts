import Text = Phaser.GameObjects.Text;
import {TutSubScene} from "../../tut-sub-scene";
import {TutRedShip} from "../scene-mechanics/tut-red-ship";
import {TutDrone} from "../scene-mechanics/tut-drone";
import {TutHealth} from "../scene-mechanics/tut-health";
import {TutAnimationContainer} from "../scene-mechanics/tut-animation-container";
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

export class WeapPrep extends TutSubScene{
    tutHeadline: Text;
    red: TutRedShip;
    redHealth: TutHealth;
    blue: TutDrone;
    blueHealth: TutHealth;
    animationContainer: TutAnimationContainer;


    constructor(scene: Phaser.Scene) {
        super(scene, 1, 0, 1);
        this.tutHeadline = new Text(this.scene, 1920/2, 1080/2 - 450, "#Weapons and Shields", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 64, fontStyle: 'bold', strokeThickness: 2});
        this.tutHeadline.setShadow(0,6,'#000', 10);
        this.tutHeadline.setOrigin(0.5, 0.5);
        this.tutHeadline.setDepth(1);
        this.animationContainer = scene.data.get("animCont");
    }

    subIntro(delta: number): void {
        this.tutHeadline.setAlpha(delta);
    }

    subScene(delta: number): void {
        this.tutHeadline.setAlpha( 1 );
    }

    subOutro(delta: number): void {
    }

    destroy(): void {
    }

    launch(): void {
        this.red = new TutRedShip(this.scene, 250, 1080/2);
        this.blue = new TutDrone(this.scene, 1700, 1080/2, 1,false);
        this.blue.addWeapon("arm"); //arm shi roc
        this.red.drone.addWeapon("shi");
        this.blue.create();
        // this.button.setVisible(true);
        this.scene.add.existing(this.tutHeadline);
        this.tutHeadline.setAlpha(0);
        this.redHealth = new TutHealth(this.scene, "P1", 1);

        this.redHealth.zone1Bar.addBar(HealthType.ShieldBar);
        this.redHealth.zone1Bar.addBar(HealthType.ShieldBar);
        this.redHealth.zone1Bar.addBar(HealthType.ShieldBar);
        this.redHealth.zone1Bar.addBar(HealthType.ShieldBar);

        this.redHealth.zone2Bar.addBar(HealthType.ShieldBar);
        this.redHealth.zone3Bar.addBar(HealthType.ShieldBar);
        this.redHealth.zone4Bar.addBar(HealthType.ShieldBar);

        this.redHealth.zone3Bar.destroyBar();
        this.redHealth.zone2Bar.destroyBar();
        this.redHealth.zone4Bar.destroyBar();

        this.redHealth.shipBar.destroyBar();
        this.redHealth.shipBar.destroyBar();
        this.redHealth.shipBar.destroyBar();

        this.blueHealth = new TutHealth(this.scene, "P2", -1);

        this.blueHealth.zone1Bar.addBar(HealthType.ArmorBar);
        this.blueHealth.zone1Bar.addBar(HealthType.ArmorBar);


        this.blueHealth.zone2Bar.addBar(HealthType.ShieldBar);
        this.blueHealth.zone3Bar.addBar(HealthType.ShieldBar);
        this.blueHealth.zone4Bar.addBar(HealthType.ShieldBar);

        this.blueHealth.zone3Bar.destroyBar();
        this.blueHealth.zone2Bar.destroyBar();
        this.blueHealth.zone4Bar.destroyBar();

        this.blueHealth.shipBar.destroyBar();
        this.blueHealth.shipBar.destroyBar();
        this.blueHealth.shipBar.destroyBar();


        this.animationContainer.dustAnimation.at(this.red.x, this.red.y,250, 800);
        this.animationContainer.dustAnimation.at(this.blue.x, this.blue.y,80, 200);
    }

    update(delta: number): void {
        this.red.update(delta*1000);
        this.blue.update(delta*1000);
    }


}