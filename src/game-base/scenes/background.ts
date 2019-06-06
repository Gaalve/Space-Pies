import {Space} from "../mechanics/space/space";

export class Background extends Phaser.Scene {
    //
    // private timeAccumulator = 0.0;
    // private timeUpdateTick = 1000/30;

    private space: Space;

    constructor() {
        super({
            key: "Background",
            active: false
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
        this.scene.launch('StartScene')

    }


    update(time: number, delta: number): void {

        this.space.update(delta/1000);
    }
}
