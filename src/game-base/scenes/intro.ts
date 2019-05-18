import {Space} from "../mechanics/space/space";
import {SubSceneManager} from "../mechanics/intro/sub-scene-manager";

export class Intro extends Phaser.Scene {

    private mgr: SubSceneManager;

    constructor() {
        super({
            key: "Intro",
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
        this.mgr = new SubSceneManager(this);
    }


    update(time: number, delta: number): void {
        this.mgr.update(delta/1000);
    }
}
