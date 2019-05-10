import {Drone} from "./drone";


export class Weapon extends Phaser.GameObjects.Sprite{

	private wClass : string;					//projectile or laser
	private drone : Drone;						//which drone the weapon belongs to
    private wNr : number;

	protected constructor(scene : Phaser.Scene, drone : Drone, texture : string, wClass : string, wNr : number) {
        if (drone.getPlayer().getNameIdentifier() == "P1") {
            super(scene, drone.getPositionX() + 100, drone.getPositionY(), texture);
        }else{
            super(scene, drone.getPositionX() - 100, drone.getPositionY(), texture);
        }
		this.wClass = wClass;
		this.drone = drone;
		this.wNr = wNr;

		if(wNr == 1){
		    this.setY(drone.getPositionY() + 50);
        }else if(wNr == 2){
		    this.setY(drone.getPositionY() - 50);
        }
	}
}