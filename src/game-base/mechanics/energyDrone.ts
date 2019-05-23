import {Player} from "./player";


export class EnergyDrone extends Phaser.GameObjects.Sprite{

    private player : Player;
    private index : number;
    private piTerm : string;
    public onScreenText : Phaser.GameObjects.Text;

    public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, index : number){
        super(scene, x, y, "ssr_solar_drone");
        if(player.getNameIdentifier() == "P2"){
            this.setTexture("ssb_solar_drone");
        }
        //reposition external drones
        if(index == 1){
            if(player.getNameIdentifier() == "P1"){
                this.setPosition(x + 100, y - 400);
            }else{
                this.setPosition(x - 150, y - 400);
            }
        }else if(index == 2){
            if(player.getNameIdentifier() == "P1"){
                this.setPosition(x + 100, y + 400);
            }else{
                this.setPosition(x - 150, y + 400);
            }
        }

        this.player = player;
        this.index = index;
        this.setVisible(false);
        scene.add.existing(this);


        this.buildPiTerm();

    }

    getPlayer() : Player{
        return this.player;
    }




    /**
     get number of solar drone (0: ship, 1: upper weapondrone, 2: lower weapondrone)
     */
    getIndex() : number{
        return this.index;
    }

    /**
     build pi Term that represents the solar drone and will be displayed on Screen
     */
    buildPiTerm() : void {
        if(this.visible || this.index == 0) {
            this.piTerm = "renergy" + this.player.getNameIdentifier().charAt(1);
        }
    }

    getPiTerm() : string{
        return this.piTerm
    }

    toString() : string{
        return this.piTerm + "<*>.0";
    }



}