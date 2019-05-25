import {Weapon} from "./weapon";
import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";

export class PWeapon extends Weapon{

	public constructor(scene :Phaser.Scene, drone : Drone, wNr : number){
		super(scene, drone, "ssr_weap_pro", "armor", wNr);

		if(drone.getPlayer().getNameIdentifier() == "P2"){
			this.setTexture('atlas', "ssb_weap_pro");
		}

		scene.add.existing(this);
	}
}