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
		this.setScale(0.8);

		if(wNr == 1){
		    this.setY(drone.getPositionY() + 40);
        }else if(wNr == 2){
		    this.setY(drone.getPositionY() - 40);
        }

		//reposition weapons on ship
		if(this.drone.getIndex() == 0) {
			this.repositionWeapons();
		}
	}

	/*
	graphical Repositioning of Weapons on ships
	 */
	repositionWeapons() : void{
		if(this.drone.getPlayer().getNameIdentifier() == "P1"){
			if(this.wNr == 1){
				this.setX(this.x - 55);
				this.setY(this.y + 180);
			}else if(this.wNr == 2){
				this.setX(this.x - 55);
				this.setY(this.y - 180);
			}else{
				this.setX(this.x + 35)
			}
		}else{
			if(this.wNr == 1){
				this.setX(this.x + 80);
				this.setY(this.y + 130);
			}else if(this.wNr == 2){
				this.setX(this.x + 80);
				this.setY(this.y - 130);
			}else{
				this.setX(this.x - 30)
			}
		}

	}

	getWeaponNr() : number{
		return this.wNr;
	}
}