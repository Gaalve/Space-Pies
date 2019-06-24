import {Drone} from "./drone";
import {WeaponType} from "./weapon/weapon-type";
import {Bullet} from "./weapon/bullet";
import {Player} from "./player";
import {HitMissNotification} from "./weapon/hit-miss-notification";
import {BulletInfo} from "./weapon/bulletInfo";
import {Infobox} from "./Infobox";


export class Weapon extends Phaser.GameObjects.Sprite{

	private wClass : string;					//projectile or laser
	private drone : Drone;						//which drone the weapon belongs to
    private wNr : number;
    private piTerm : string;
    private notification: HitMissNotification;
    private bullet: Bullet;
    private weaponType: WeaponType;
	private isFirst: boolean;
	private player: Player;
    private simplePi : string;

	public constructor(scene : Phaser.Scene, drone : Drone, type: WeaponType, player: Player, wNr: number) {
        super(scene, drone.x, drone.y, Weapon.getWeaponTex(player.isFirstPlayer(), type));
        this.weaponType = type;
        this.isFirst = player.isFirstPlayer();
        this.player = player;
		if (drone.getPlayer().getNameIdentifier() == "P1") {
            this.setX(drone.x + 70);
        }else{
            this.setX(drone.x - 70);
        }
        this.setVisible(false);
        scene.add.existing(this);
		this.wClass = Weapon.getWeaponClass(type);
		this.simplePi = this.wClass.charAt(0);
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
		this.notification = null;
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
		this.weaponType = type;
		this.setTexture(Weapon.getWeaponTex(this.isFirst, type));
        this.simplePi = this.wClass.charAt(0);
		this.createPiTerm();
	}

	public getWeapon() : string {
		return Weapon.getWeaponClass(this.weaponType);
	}

	private static getWeaponClass(type: WeaponType) : string{
		switch (type) {
			case WeaponType.LASER_ARMOR: return "armor";
			case WeaponType.PROJECTILE_SHIELD: return "shield";
			case WeaponType.ROCKET: return "rocket";
            case WeaponType.NONE: return "???";
		}
	}

	private static getWeaponTex(isFirstPlayer: boolean, type: WeaponType) : string{
		if(isFirstPlayer)
			switch (type) {
				case WeaponType.LASER_ARMOR: return "ssr_weap_las";
				case WeaponType.PROJECTILE_SHIELD: return "ssr_weap_pro";
				case WeaponType.ROCKET: return "ssr_weap_rock";
				case WeaponType.NONE: return "ssb_weap_las"; // wrong model is intended!
			}
		else
			switch (type) {
				case WeaponType.LASER_ARMOR: return "ssb_weap_las";
				case WeaponType.PROJECTILE_SHIELD: return "ssb_weap_pro";
				case WeaponType.ROCKET: return "ssb_weap_rock";
                case WeaponType.NONE: return "ssr_weap_las"; // wrong model is intended!
			}
	}

	/**
	Pi Term, that represents the weapon in pi calculus. Will be either shieldPX<*> or armorPX<*> while X is the
	number of the opposing player
	 */
    createPiTerm() : void{
    	if(this.drone.getPlayer().getNameIdentifier() == "P1") {
			this.piTerm = this.wClass + "p2";
			this.simplePi = this.simplePi + "p2";
		}else{
    		this.piTerm = this.wClass + "p1";
    		this.simplePi = this.simplePi + "p1";
		}
		let infobox = <Infobox> this.scene.data.get("infoboxx");
		infobox.addTooltipInfo(this, "[" + this.player.getNameIdentifier() + "] Weapon Type:    " + this.simplePi + "<>           (" + Infobox.weaponTypeToString(this.weaponType) + ")\n     destroys:       " + Infobox.weaponTypeTargetsPiTerm(this.weaponType, this.player) + "    (" + Infobox.weaponTypeTargetsToString(this.weaponType) + ")");

    }

    getPiTerm() : string{
	    return this.piTerm;
    }

    getSimplePi() : string{
    	return this.simplePi;
	}

    destroy(fromScene?: boolean): void {
    	super.destroy(fromScene);
    	if(this.bullet) this.bullet.destroy();
	}

	public update(delta: number): void {
    	if(this.bullet) {
			this.bullet.update(delta);
			if(this.bullet.hasHit() || this.bullet.isOutOfBounds()) this.removeBullet();
		}
    	if(this.notification){
    		this.notification.update(delta);
    		if (this.notification.shouldRemove()) this.removeNotification();
		}
	}

	public createBullet(info?: BulletInfo): void{
        if(this.weaponType == WeaponType.NONE) return;
    	this.removeBullet();
    	let toX = this.isFirst ? 1620 : 300;
    	let toY = 540;
    	let hit: boolean = !info;
    	if(info){
    		toX = info.toX;
    		toY = info.toY;
			hit = !info.miss;
		}
    	this.bullet = new Bullet(this.scene, this.x, this.y, this.isFirst, this.weaponType, hit, this.player, toX, toY);
		this.notification = new HitMissNotification(this.scene, this.x, this.y, hit, this.isFirst);
	}
	private removeBullet(): void{
    	if(!this.bullet) return;
    	this.bullet.destroy();
    	this.bullet = null;
	}

	private removeNotification(): void{
		if(!this.notification) return;
		this.notification.destroy();
		this.notification = null;
	}
}