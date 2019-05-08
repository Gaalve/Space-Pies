import {Drone} from "./drone";


export class Weapon extends Phaser.GameObjects.Sprite{

	private wClass : string;					//projectile or laser
	private drone : Drone;						//which drone the weapon belongs to

	protected constructor(scene : Phaser.Scene, drone : Drone, texture : string, wClass : string){
		super(scene, drone.getPosition().x, drone.getPosition().y, texture);
		this.wClass = wClass;
		this.drone = drone;
		this.drone.updateWeapons();
	}

}