import {PiCalcTests} from "../tests/pi-calc-tests";
import {TestEnvironment} from "../tests/test-environment";
import {Space} from "../mechanics/space/space";

export class Background extends Phaser.Scene {

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private space: Space;

    constructor() {
        super({
            key: "Background",
            active: true
        })
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )

    }

    create(): void {
        this.space = new Space(this);
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.space.updateStep();
        }
    }
}
