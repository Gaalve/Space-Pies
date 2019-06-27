import {Player} from "../player";
import {Anomaly} from "./anomaly";
import {Infobox} from "../Infobox";


export class BlackHole extends Anomaly {

    private size: number;
    private counter: number;
    private activated: boolean;
    private readonly maxCounter: number;
    private sinCounter: number;
    private infobox: Infobox;


    public constructor(scene : Phaser.Scene, player: Player) {
        super(scene, player, 960, 540, "black_hole", "hole");

        this.scaleUp = 1;
        this.scaleX = 0.0;
        this.scaleY = 0.0;
        this.size = 10;
        this.counter = 0;
        this.activated = false;
        this.maxCounter = 500;
        this.sinCounter = 0;

        this.infobox = <Infobox> this.scene.data.get("infoboxx");
        this.infobox.addTooltipInfo(this,
            "Black Hole:\n" +
            " This hole may suck in projectiles from each of you."
        );
    }

    public update(delta: number): void {
        this.counter += delta;
        this.sinCounter += delta/1500;
        this.sinCounter %= 2 * Math.PI;

        this.setScale(this.scaleX + Math.sin(this.sinCounter)/15);
        this.setAlpha(0.95 + Math.sin(-this.sinCounter)/20 );

        this.player.blackholeParticles.at(this.scaleX, 2);
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
            if (this.size == 0) {
                this.infobox = undefined;
                this.destroy();
            }
        }

    }

    public reduce(): void{
        this.size--;
        this.counter = 0;
    }
}