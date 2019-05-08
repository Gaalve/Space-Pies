import {Weapon} from "./weapon";
import {Drone} from "./drone";

export class PWeapon extends Weapon{

	public constructor(scene :Phaser.Scene, drone : Drone){
		if(drone.getPlayer().getNameIdentifier() == "P1") {
			super(scene, drone, "ssr_weap_pro", "projectile");
		}else{
			super(scene, drone, "ssb_weap_pro", "projectile");
		}
	}
}