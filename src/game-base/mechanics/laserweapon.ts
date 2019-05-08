import {Weapon} from "./weapon";
import {Drone} from "./drone";

export class LWeapon extends Weapon{

	public constructor(scene :Phaser.Scene, drone : Drone){
		if(drone.getPlayer().getNameIdentifier() == "P1"){
			super(scene, drone, "ssr_weap_las", "laser");
		}else{
			super(scene, drone, "ssb_weap_las", "laser");
		}
	}

}