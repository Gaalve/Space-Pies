import {Player} from "./player";

export class Drone extends Phaser.GameObjects.Sprite{

	private position : Phaser.Math.Vector2;
	private readonly player : Player;
	private activatedWeapons : number;


	public constructor(scene : Phaser.Scene, x : number, y : number, player : Player){
	    if(player.getNameIdentifier() == "P1") {
            super(scene, x, y, "ssr_wmod");
        }else{
	        super(scene, x, y, "ssb_wmod");
        }
            this.position.x = x;
            this.position.y = y;
            this.player = player;
            this.activatedWeapons = 0;

            this.setVisible(false);
            this.setState(0);
            scene.add.existing(this);
    }

    activateDrone() : void {
	    this.setVisible(true);                      //TODO: Als Animation einfügen
	    this.setState(1);
    }

    getPosition() : Phaser.Math.Vector2{
	    return this.position;
    }

    getPlayer() : Player{
	    return this.player;
    }

    updateWeapons() : void{
	    if(this.activatedWeapons < 3) {
            this.activatedWeapons++;
        }
    }
}