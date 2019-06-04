import {Player} from "../player";

export class WormHole extends Phaser.GameObjects.Sprite {

    private player: Player;
    public scaleUp: number;

    public constructor(scene : Phaser.Scene, player: Player) {
        super(scene, 960, 540, "worm_hole");
        scene.add.existing(this);
        this.player = player;
        this.scaleUp = 1;
        this.scaleX = 0.0;
        this.scaleY = 0.0;
    }

}