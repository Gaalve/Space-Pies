import {Player} from "../player";


export class SunEruption extends Phaser.GameObjects.Sprite {

    private player: Player;
    public scaleUp: number;

    public constructor(scene : Phaser.Scene, player: Player) {
        super(scene, 960, -540, "sun_erupt");
        scene.add.existing(this);
        this.player = player;
        this.scaleX = 1.2;
        this.scaleY = 0.2;
    }

}