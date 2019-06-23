import {Player} from "../player";
import {Anomaly} from "./anomaly";


export class BlackHole extends Anomaly {

    private size: number;
    private counter: number;
    private activated: boolean;
    private maxCounter: number;

    public constructor(scene : Phaser.Scene, player: Player) {
        super(scene, player, 960, 500, "black_hole", "hole");

        this.scaleUp = 1;
        this.scaleX = 0.0;
        this.scaleY = 0.0;
        this.size = 10;
        this.counter = 0;
        this.activated = false;
        this.maxCounter = 500;
    }

    public update(delta: number): void {
        this.counter += delta;
        if(this.counter < this.maxCounter){
            if (!this.activated){
                this.setScale(this.counter / this.maxCounter);
            }
            else{
                this.setScale( (1 - this.counter / this.maxCounter) / 10 + this.size / 10);
            }
        }
        else{
            this.activated = true;
            this.counter = this.maxCounter;
            this.setScale(this.size / 10);
        }

    }

    public reduce(): void{
        this.size--;
        this.counter = 0;
    }
}