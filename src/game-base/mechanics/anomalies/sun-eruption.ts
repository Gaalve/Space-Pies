import {Anomaly} from "./anomaly";


export class SunEruption extends Anomaly {

    public constructor(scene : Phaser.Scene, player: Player) {
        super(scene, player, 960, -540, "sun_erupt", "eruption");
        this.scaleX = 1.2;
        this.scaleY = 0.2;

        this.scene.time.delayedCall(3000, () => {this.destroy()},[],this);
    }

    public update(): void {
        this.y += 100;
    }
}