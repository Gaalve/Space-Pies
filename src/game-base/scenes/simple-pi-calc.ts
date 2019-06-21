import {PiAnimSystem} from "../mechanics/pianim/pi-anim-system";

export class SimplePiCalc extends Phaser.Scene {

    animSys: PiAnimSystem;

    constructor() {
        super({
            key: "SimplePiCalc",
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
        this.animSys = new PiAnimSystem(this);
        this.scene.launch('MainScene', this.animSys);
    }


    update(time: number, delta: number): void {
        this.animSys.update(delta);
    }

    //TODO: wait for sync?!?
}
