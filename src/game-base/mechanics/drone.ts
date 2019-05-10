import {Player} from "./player";
import {Weapon} from "./weapon";
import {PWeapon} from "./projectileweapon";
import {LWeapon} from "./laserweapon";
import {PiSystem} from "./picalc/pi-system";


export class Drone extends Phaser.GameObjects.Sprite{


	private player : Player;
	private weapons : Weapon[];
	private index : number;


	public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, index : number){
	    if(player.getNameIdentifier() == "P1") {
            super(scene, x, y, "ssr_wmod");
        }else{
	        super(scene, x, y, "ssb_wmod");
        }
	    this.weapons = new Array();
	    this.player = player;
	    this.index = index;
	    scene.add.existing(this);
    }

    getPlayer() : Player{
	    return this.player;
    }

    addWeapon(weapon : string) : void{
	    if(weapon == "l"){
	        this.weapons.push(new LWeapon(this.scene, this, this.weapons.length));

        }else if(weapon == "p") {
            this.weapons.push(new PWeapon(this.scene, this, this.weapons.length));
        }
    }

    getWeapons() : number{
	    return this.weapons.length;
    }

    getIndex() : number{
		return this.index;
	}

}