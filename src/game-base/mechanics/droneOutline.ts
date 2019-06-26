import {Player} from "./player";
import {Drone} from "./drone";

export class droneOut extends Phaser.GameObjects.Sprite{
    private readonly posX: number;
    private readonly posY: number;

    durationX : number;
    durationY : number;
    sinX : number;
    sinY : number;
    public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, drone: Drone){
        super(scene, x, y, "ssr_wmod");
        this.setTintFill(0xaff4444).setScale(1.2,1.1);

        if(player.getNameIdentifier() == "P2"){
            this.setTexture("ssb_wmod");
            this.setTintFill(0xa4444ff).setScale(1.2,1.1);
        }
        this.setVisible(false);
        scene.add.existing(this);
        this.x =  x;
        this.y = y;
        this.posX = x;
        this.posY = y;
        this.durationX = 700 + 600 * Math.random();
        this.durationY = 500 + 300 * Math.random();
        this.sinX = 0;
        this.sinY = 0;
    }

    public update(delta: number): void {


        /*this.sinX += delta/ this.durationX;
        this.sinY += delta/ this.durationY;

        this.sinX %= 2*Math.PI;
        this.sinY %= 2*Math.PI;*/

        //this ? this.moveSin(true,true) : null;

    }

    private setPositionSin(moveX: boolean, moveY: boolean) {
        this.x = moveX ? (this.posX + Math.sin(this.sinX) * 15) : this.posX;
        this.y = moveY ? (this.posY + Math.cos(this.sinY) * 15) : this.posY;

    }
    private moveSin(moveX?: boolean, moveY?: boolean)
    {
        let posX = moveX ? (this.x + Math.sin(this.sinX) * 1) : this.x;
        let posY = moveY ? this.y + Math.cos(this.sinY) * 1 : this.y;

        this.setPosition(posX,posY)
    }
}