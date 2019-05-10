import {Player} from "./player";


export class Ship extends Phaser.GameObjects.Sprite{

    private posX : number;
    private posY : number;

    public constructor (scene : Phaser.Scene, x: number, y: number, player : Player){
        if(player.getNameIdentifier() == "P1"){
            super(scene, x, y, "ssr_ship_on");
        }else{
            super(scene, x, y, "ssb_ship_on");
        }

        this.posX = x;
        this.posY = y;

        scene.add.existing(this);
    }

}