import {Drone} from "./drone";
import {WeaponType} from "./weapon-type";
import {Bullet} from "./bullet";


export class Weapon extends Phaser.GameObjects.Sprite{

	private wClass : string;					//projectile or laser
	private drone : Drone;						//which drone the weapon belongs to
    private wNr : number;
    private piTerm : string;
    private bullet: Bullet;
    private weaponType: WeaponType;
	private isFirst: boolean;

	public constructor(scene : Phaser.Scene, drone : Drone, type: WeaponType, isFirst: boolean, wNr: number) {
        super(scene, drone.x, drone.y, Weapon.getWeaponTex(isFirst, type));
        this.weaponType = type;
        this.isFirst = isFirst;
		if (drone.getPlayer().getNameIdentifier() == "P1") {
            this.setX(drone.x + 70);
        }else{
            this.setX(drone.x - 70);
        }
        this.setVisible(false);
        scene.add.existing(this);
		this.wClass = Weapon.getWeaponClass(type);
		this.drone = drone;
		this.wNr = wNr;

		if(wNr == 1){
		    this.setY(drone.y - 30);
        }else if(wNr == 2){
		    this.setY(drone.y + 30);
        }
		this.setDepth(0);

		//reposition weapons on ship
		if(this.drone.getIndex() == 0) {
		    this.setDepth(4);
			this.repositionWeapons();
		}
		this.bullet = null;
		this.scene.time.delayedCall(Math.random()*4000 + 2000, this.createBullet, [], this);
	}



	/**
	graphical Repositioning of Weapons on ships
	 */
	repositionWeapons() : void{
		if(this.drone.getPlayer().isFirstPlayer()){
			if(this.wNr == 1){
				this.setX(this.x - 15);
				this.setY(this.y + 180);
			}else if(this.wNr == 2){
				this.setX(this.x - 15);
				this.setY(this.y - 180);
			}else{
				this.setX(this.x + 65)
			}
		}else{
			if(this.wNr == 1){
				this.setX(this.x + 25);
				this.setY(this.y + 140);
			}else if(this.wNr == 2){
				this.setX(this.x + 25);
				this.setY(this.y - 140);
			}else{
				this.setX(this.x - 50)
			}
		}
	}

	public setWeapon(type: WeaponType): void{
		this.wClass = Weapon.getWeaponClass(type);
		this.setTexture(Weapon.getWeaponTex(this.isFirst, type));
		this.createPiTerm();
	}


	private static getWeaponClass(type: WeaponType) : string{
		switch (type) {
			case WeaponType.LASER_ARMOR: return "armor";
			case WeaponType.PROJECTILE_SHIELD: return "shield";
			case WeaponType.ROCKET: return "rocket"
		}
	}

	private static getWeaponTex(isFirstPlayer: boolean, type: WeaponType) : string{
		if(isFirstPlayer)
			switch (type) {
				case WeaponType.LASER_ARMOR: return "ssr_weap_las";
				case WeaponType.PROJECTILE_SHIELD: return "ssr_weap_pro";
				case WeaponType.ROCKET: return "ssr_weap_rock"
			}
		else
			switch (type) {
				case WeaponType.LASER_ARMOR: return "ssb_weap_las";
				case WeaponType.PROJECTILE_SHIELD: return "ssb_weap_pro";
				case WeaponType.ROCKET: return "ssb_weap_rock"
			}
	}

	/**
	Pi Term, that represents the weapon in pi calculus. Will be either shieldPX<*> or armorPX<*> while X is the
	number of the opposing player
	 */
    createPiTerm() : void{
    	if(this.drone.getPlayer().getNameIdentifier() == "P1") {
			this.piTerm = this.wClass + "P2";
		}else{
    		this.piTerm = this.wClass + "P1";
		}
    }

    getPiTerm() : string{
	    return this.piTerm;
    }

    destroy(fromScene?: boolean): void {
    	super.destroy(fromScene);
    	if(this.bullet) this.bullet.destroy();
	}

	public update(delta: number): void {
    	if(this.bullet) {
			this.bullet.update(delta);
			if(this.bullet.checkHit() || this.bullet.checkBounds()) this.removeBullet();
		}
	}

	public createBullet(): void{
    	this.removeBullet();
    	this.bullet = new Bullet(this.scene, this.x, this.y, false, this.weaponType, false) //TODO
	}

	private removeBullet(): void{
    	if(!this.bullet) return;
    	this.bullet.destroy();
    	this.bullet = null;
	}
}