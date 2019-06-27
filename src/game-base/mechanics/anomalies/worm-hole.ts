import {Player} from "../player";
import {Anomaly} from "./anomaly";
import {NanoDrone} from "../nanoDrone";

export class WormHole extends Anomaly {

    public drone : NanoDrone;
    private counter: number;
    private activated: boolean;
    private maxCounter: number;

    public constructor(scene : Phaser.Scene, player: Player, drone: NanoDrone) {
        super(scene, player, 960, -540, "worm_hole", "nanodrone");
        this.drone = drone;

        this.playerX();
        this.playerY();
        this.scaleUp = 1;
        this.scaleX = 0.0;
        this.scaleY = 0.0;
        this.counter = 0;
        this.activated = false;
        this.maxCounter = 1200;
    }

    public update(delta: number): void {

        this.counter += delta;
        this.setRotation(this.rotation + delta/250);

        if (this.counter < this.maxCounter){
            if (this.activated){
                this.setScale(1 - this.counter / this.maxCounter);
                this.setAlpha(1 - this.counter / this.maxCounter);
            }
            else {
                this.setScale(this.counter / this.maxCounter);
            }
        }
        else {
            if (this.activated){
                this.destroy();
            }
            else{
                this.activated = true;
                this.counter = 0;
                this.setScale(1);
                this.drone.setVisible(true);
                this.drone.exists = true;
                this.drone.refreshInfoBox();
            }
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