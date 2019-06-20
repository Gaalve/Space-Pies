import {Player} from "../player";


export class Anomaly extends Phaser.GameObjects.Sprite {

    private player: Player;
    public scaleUp: number;
    public anomalyType: string;

    public constructor(scene : Phaser.Scene, player: Player, x: number, y: number, sprite: string, type: string) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        this.player = player;
        this.anomalyType = type;
    }

}