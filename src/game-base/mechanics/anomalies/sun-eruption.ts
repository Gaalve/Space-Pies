import {Player} from "../player";
import {Anomaly} from "./anomaly";


export class SunEruption extends Anomaly {

    public direction: number;

    public constructor(scene : Phaser.Scene, player: Player) {
        super(scene, player, 960 + (player.isFirstPlayer() ? +500 : -500), -800, "sun_erupt", "eruption");
        this.direction = player.isFirstPlayer() ? -1 : 1;
        this.setOrigin(0.5, 0.5);
        this.setAngle(-this.direction * 45);
        this.scene.time.delayedCall(3000, () => {this.destroy()},[],this);
    }

    public update(delta: number): void {
        this.y += 25 * delta/16;
        this.x += 25 * delta/16 * this.direction;
    }
}