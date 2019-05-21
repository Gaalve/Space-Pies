import {Drone} from "./drone";


export class Weapon extends Phaser.GameObjects.Sprite{

	private wClass : string;					//projectile or laser
	private drone : Drone;						//which drone the weapon belongs to
    private wNr : number;
    private piTerm : string;

	public constructor(scene : Phaser.Scene, drone : Drone, texture : string, wClass : string, wNr : number) {
        super(scene, drone.x, drone.y, texture);
		if (drone.getPlayer().getNameIdentifier() == "P1") {
            this.setX(drone.x + 90);
        }else{
            this.setX(drone.x - 90);
        }
        this.setVisible(false);
        scene.add.existing(this);
		this.wClass = wClass;
		this.drone = drone;
		this.wNr = wNr;
		this.setScale(0.5);

		if(wNr == 1){
		    this.setY(drone.y + 20);
        }else if(wNr == 2){
		    this.setY(drone.y - 20);
        }
		this.setDepth(-1);

		//reposition weapons on ship
		if(this.drone.getIndex() == 0) {
		    this.setDepth(0);
			this.setScale(0.8);
			this.repositionWeapons();
		}
	}

	/**
	graphical Repositioning of Weapons on ships
	 */
	repositionWeapons() : void{
		if(this.drone.getPlayer().getNameIdentifier() == "P1"){
			if(this.wNr == 1){
				this.setX(this.x - 45);
				this.setY(this.y + 180);
			}else if(this.wNr == 2){
				this.setX(this.x - 45);
				this.setY(this.y - 180);
			}else{
				this.setX(this.x + 35)
			}
		}else{
			if(this.wNr == 1){
				this.setX(this.x + 70);
				this.setY(this.y + 130);
			}else if(this.wNr == 2){
				this.setX(this.x + 70);
				this.setY(this.y - 130);
			}else{
				this.setX(this.x - 30)
			}
		}

	}
	setWeaponClass(wClass : string) : void{
	    this.wClass = wClass;
        this.createPiTerm();
    }

	getWeaponClass() : string{
		return this.wClass;
	}

	/**
	Pi Term, that represents the weapon in pi calculus. Will be either shieldPX<*> or armorPX<*> while X is the
	number of the opposing player
	 */
    createPiTerm() : void{
			this.piTerm = this.drone.getPlayer().getNameIdentifier() == "P1" ? this.wClass + "P2" : this.wClass + "P1";
    }

    getPiTerm() : string{
	    return this.piTerm;
    }

    getX()
	{
		return this.x;
	}

	getY()
	{
		return this.y;
	}
}