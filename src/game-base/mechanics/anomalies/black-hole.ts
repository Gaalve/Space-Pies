import {Player} from "../player";
import {Anomaly} from "./anomaly";


export class BlackHole extends Anomaly {

    public constructor(scene : Phaser.Scene, player: Player) {
        super(scene, player, 960, 500, "black_hole", "hole");

        this.scaleUp = 1;
        this.scaleX = 0.0;
        this.scaleY = 0.0;
    }

    public update(): void {

        if(this.scaleUp == -2 && this.scaleX < 0.4) this.scaleUp = 0;
        if(this.scaleUp == -1 && this.scaleX < 0.7) this.scaleUp = 0;

        if(this.scaleUp == 1 && this.scaleX > 1.0){
            this.scaleUp = 0;
        }

        if(this.scaleX > -0.005){
            this.scaleX += 0.01 * this.scaleUp;
            this.scaleY += 0.01 * this.scaleUp;
        }
        else{
            this.destroy()
        }

    }
}