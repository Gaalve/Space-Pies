import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {chooseSceneP1} from "./choose-sceneP1";
import {Player} from "../mechanics/player";
import {MainScene} from "./main-scene";

export class ScenePiAnimation extends Phaser.Scene{

    private firstChoose: boolean;
    private system: PiSystem;


    constructor(){
        super({
            key: 'AnimationScene',
            active: false
        });
        this.firstChoose = true;
    }

    preload(): void{
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void{
        this.system = this.scene.get('MainScene').data.get("system");
        const something = this.add.sprite(1920/3, 1080/3, "ssb_weap_rock");
        console.log("ScenePiAnimation ACTIVE!");
    }

    update(time: number, delta: number): void {

    }


}