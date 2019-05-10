import {Weapon} from "./weapon";
import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";

export class LWeapon extends Weapon{

	public constructor(scene :Phaser.Scene, drone : Drone, wNr : number){
		if(drone.getPlayer().getNameIdentifier() == "P1"){
			super(scene, drone, "ssr_weap_las", "laser", wNr);
		}else{
			super(scene, drone, "ssb_weap_las", "laser", wNr);
		}

		scene.add.existing(this);
	}

}