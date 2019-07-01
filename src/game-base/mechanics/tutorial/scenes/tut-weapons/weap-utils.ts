import {TutDrone} from "../scene-mechanics/tut-drone";
import {TutHealth} from "../scene-mechanics/tut-health";
import {TutWeapon} from "../scene-mechanics/tut-weapon";
import {WeaponType} from "../../../weapon/weapon-type";
import {TutHealthbar} from "../scene-mechanics/tut-healthbar";
import {HealthType} from "../../../health/health-type";
import Scene = Phaser.Scene;
import {BulletInfo} from "../../../weapon/bulletInfo";


export class WeapUtils {


    static shoot(scene: Scene, yourDrone: TutDrone, enemyHealth: TutHealth, enemyX: number, enemyY: number){
        scene.time.delayedCall(0, WeapUtils.shootWeapon, [scene, yourDrone.getWeapons()[0], enemyHealth, enemyX, enemyY], this);
        scene.time.delayedCall(150, WeapUtils.shootWeapon, [scene, yourDrone.getWeapons()[1], enemyHealth, enemyX, enemyY], this);
        scene.time.delayedCall(300, WeapUtils.shootWeapon, [scene, yourDrone.getWeapons()[2], enemyHealth, enemyX, enemyY], this);
    }

    private static shootWeapon(scene: Scene, weapon: TutWeapon, enemyHealth: TutHealth, enemyX: number, enemyY: number){
        if (weapon.weaponType == WeaponType.NONE) return;
        let zones = this.getHitableZones(weapon.weaponType, enemyHealth);
        if (zones.length == 0) weapon.createBullet(new BulletInfo(true, 960, 350));
        else {
            let randIdx = Math.floor(Math.random() * zones.length);
            weapon.createBullet(new BulletInfo(false, enemyX, enemyY));
            scene.time.delayedCall(280, zones[randIdx].destroyBar, [], this);
        }
    }

    private static getHitableZones(type: WeaponType, enemyHealth: TutHealth): TutHealthbar[]{
        let zones: TutHealthbar[] = [];

        if (WeapUtils.isHitableZone(type, enemyHealth.zone1Bar)) zones.push(enemyHealth.zone1Bar);
        if (WeapUtils.isHitableZone(type, enemyHealth.zone2Bar)) zones.push(enemyHealth.zone2Bar);
        if (WeapUtils.isHitableZone(type, enemyHealth.zone3Bar)) zones.push(enemyHealth.zone3Bar);
        if (WeapUtils.isHitableZone(type, enemyHealth.zone4Bar)) zones.push(enemyHealth.zone4Bar);

        return zones;
    }

    private static isHitableZone(type: WeaponType, enemyHealthBar: TutHealthbar): boolean{
        if (enemyHealthBar.bars.length == 0) return false;
        let bar = enemyHealthBar.bars[enemyHealthBar.bars.length - 1];
        switch (type) {
            case WeaponType.LASER_ARMOR:
                return bar.type == HealthType.ArmorBar || bar.type == HealthType.NanoBar || bar.type == HealthType.AdaptiveBar2;
            case WeaponType.PROJECTILE_SHIELD:
                return bar.type == HealthType.ShieldBar || bar.type == HealthType.NanoBar || bar.type == HealthType.AdaptiveBar2;
            case WeaponType.ROCKET:
                return bar.type == HealthType.RocketBar ||bar.type == HealthType.ArmorBar || bar.type == HealthType.ShieldBar ||
                    bar.type == HealthType.NanoBar || bar.type == HealthType.AdaptiveBar2;
            case WeaponType.NONE:
                return false;
        }
        return false;
    }
}