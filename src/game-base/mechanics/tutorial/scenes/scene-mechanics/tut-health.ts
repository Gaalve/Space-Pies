import {TutHealthbar} from "./tut-healthbar";
import {HealthbarSprites} from "../../../health/healthbar-sprites";
import {HealthType} from "../../../health/health-type";

export class TutHealth {
    public readonly shipBar: TutHealthbar;
    public readonly zone1Bar: TutHealthbar;
    public readonly zone2Bar: TutHealthbar;
    public readonly zone3Bar: TutHealthbar;
    public readonly zone4Bar: TutHealthbar;

    public constructor(scene: Phaser.Scene, pid: string, direction: 1 | -1){
        this.shipBar = new TutHealthbar(scene, direction, false, 120,
            "CoreExplosion"+pid, pid);
        this.zone1Bar = new TutHealthbar(scene, direction, true, 170,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);
        this.zone2Bar = new TutHealthbar(scene, direction, true, 220,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);
        this.zone3Bar = new TutHealthbar(scene, direction, true, 270,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);
        this.zone4Bar = new TutHealthbar(scene, direction, true, 320,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);

        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);

    }

    public destroy(): void{
        this.shipBar.destroy();
        this.zone1Bar.destroy();
        this.zone2Bar.destroy();
        this.zone3Bar.destroy();
        this.zone4Bar.destroy();
    }
}