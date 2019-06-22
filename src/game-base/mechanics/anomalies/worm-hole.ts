import {Player} from "../player";
import {Anomaly} from "./anomaly";
import {NanoDrone} from "../nanoDrone";

export class WormHole extends Anomaly {

    public drone : NanoDrone;

    public constructor(scene : Phaser.Scene, player: Player, drone: NanoDrone) {
        super(scene, player, 960, -540, "worm_hole", "nanodrone");
        this.drone = drone;

        this.playerX();
        this.playerY();
        this.scaleUp = 1;
        this.scaleX = 0.0;
        this.scaleY = 0.0;
    }

    public update(): void {

        if(this.scaleX > 0.5){
            this.scaleUp = -1;
            this.drone.setVisible(true);
        }

        if(this.scaleX > -0.05){
            this.scaleX += 0.05 * this.scaleUp;
            this.scaleY += 0.05 * this.scaleUp;
        }else {
            this.destroy();
        }


    }

    private playerX() : void {
        if (this.player.getNameIdentifier().charAt(1) == '1') this.x = 200;
        if (this.player.getNameIdentifier().charAt(1) == '2') this.x = 1720;
    }

    private playerY() : void {
        if (this.player.getNameIdentifier().charAt(1) == '1') this.y = 820;
        if (this.player.getNameIdentifier().charAt(1) == '2') this.y = 820;
    }

}