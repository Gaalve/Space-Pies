import {Drone} from "./drone";
import {WeaponType} from "./weapon/weapon-type";
import {Bullet} from "./weapon/bullet";
import {Player} from "./player";
import {HitMissNotification} from "./weapon/hit-miss-notification";
import {BulletInfo} from "./weapon/bulletInfo";
import {Infobox} from "./Infobox";
import {BlueShip} from "./ship/blue-ship";
import {RedShip} from "./ship/red-ship";


export class Weapon extends Phaser.GameObjects.Sprite{

    get player(): Player
    {
        return this._player;
    }

    set player(value: Player)
    {
        this._player = value;
    }

    get weaponType(): WeaponType
	{
		return this._weaponType;
	}

	set weaponType(value: WeaponType)
	{
		this._weaponType = value;
	}

	private wClass : string;					//projectile or laser
	private drone : Drone;						//which drone the weapon belongs to
    private wNr : number;
    private piTerm : string;
    private notification: HitMissNotification;
    private bullet: Bullet;
    private _weaponType: WeaponType;
	private isFirst: boolean;
	private _player: Player;
    private simplePi : string;
	posX : number;
	posY : number;
	durationX : number;
	durationY : number;
	sinX : number;
	sinY : number;

	public constructor(scene : Phaser.Scene, drone : Drone, type: WeaponType, player: Player, wNr: number) {
        super(scene, drone.x, drone.y, Weapon.getWeaponTex(player.isFirstPlayer(), type));
        this._weaponType = type;
        this.isFirst = player.isFirstPlayer();
        this._player = player;
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

		this.posX = this.x - drone.x;
		this.posY = this.y - drone.y;
		this.durationX = 900;
		this.durationY = 1000;
		this.sinX = 0;
		this.sinY = 0;

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
		this._weaponType = type;
		this.setTexture(Weapon.getWeaponTex(this.isFirst, type));
        this.simplePi = this.wClass.charAt(0);
		this.createPiTerm();

		// this.drone.getPlayer().isFirstPlayer() ? this.scene.data.get("redship").addWeapon(this) : this.scene.data.get("blueship").addWeapon(this);
	}

	public canShoot() : boolean {
	    return this.weaponType != WeaponType.NONE;
    }

	public getWeapon() : string {
		return Weapon.getWeaponClass(this._weaponType);
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
		infobox.addTooltipInfo(this, "[" + this._player.getNameIdentifier() + "] Weapon Type:    "
			+ this.simplePi + "<>" +
			"    (" + Infobox.weaponTypeToString(this._weaponType) + ")\n" + "     destroys:       " + Infobox.weaponTypeTargetsPiTerm(this._weaponType, this._player) +
			"    (" + Infobox.weaponTypeTargetsToString(this._weaponType) + ")");

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

		//
		// this.sinX += delta/ this.durationX;
		// this.sinY += delta/ this.durationY;
		//
		// this.sinX %= 2*Math.PI;
		// this.sinY %= 2*Math.PI;
		//
		// this.moveSin(false,true)

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
        if(this._weaponType == WeaponType.NONE) return;
    	this.removeBullet();
    	let toX = this.isFirst ? 1620 : 300;
    	let toY = 540;
    	let hit: boolean = !info;
    	if(info){
    		toX = info.toX;
    		toY = info.toY;
			hit = !info.miss;
		}
    	this.bullet = new Bullet(this.scene, this.x, this.y, this.isFirst, this._weaponType, hit, this._player, toX, toY);
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

	private moveSin(moveX?: boolean, moveY?: boolean)
	{
		let posX = moveX ? (this.x + Math.sin(this.sinX) * 1) : this.x;
		let posY = moveY ? this.y + Math.cos(this.sinY) * 1 : this.y;

		this.setPosition(posX,posY)
	}
}