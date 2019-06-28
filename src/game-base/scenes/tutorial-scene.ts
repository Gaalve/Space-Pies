import Text = Phaser.GameObjects.Text;
import {TutSubSceneManager} from "../mechanics/tutorial/tut-sub-scene-manager";

export class TutorialScene extends Phaser.Scene {
    private mgr : TutSubSceneManager;
    constructor() {
        super({
            key: "TutorialScene",
            active: false
        })
    }

    preload(): void {
    }


    create(): void {
        this.mgr = new TutSubSceneManager(this);
    }


    update(time: number, delta: number): void {
        this.mgr.update(delta/1000);
    }
}
