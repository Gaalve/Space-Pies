import {Player} from "./player";
import {Weapon} from "./weapon";
import {WeaponType} from "./weapon/weapon-type";
import {PiAnimSystem} from "./pianim/pi-anim-system";
import {PiAnimSequence} from "./pianim/pi-anim-sequence";
import {PiAnimAlignment} from "./pianim/pi-anim-alignment";
import {Infobox} from "./Infobox";
import {MainScene} from "../scenes/main-scene";
import {BlueShip} from "./ship/blue-ship";
import {RedShip} from "./ship/red-ship";
import Sprite = Phaser.GameObjects.Sprite;


export class Drone extends Phaser.GameObjects.Sprite{

	private player : Player;
	private weapons : [Weapon, Weapon, Weapon];
	private index : number;
	private piTerm : string;
	private simplePi : string;
	// public onScreenText : Phaser.GameObjects.Text;
	private activatedWeapons: integer;
	x : number;
	y : number;
	durationX : number;
	durationY : number;
	sinX : number;
	sinY : number;

	private animSys: PiAnimSystem;
	private piSeq: PiAnimSequence;

	public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, index : number, animSys: PiAnimSystem){
		super(scene, x, y, "ssr_wmod");
		this.animSys = animSys;
		this.piSeq = animSys.addSequence(x, y+100, 'lock()', PiAnimAlignment.CENTER);
		this.piSeq.addSymbol('0');
		this.piSeq.hide();

	    if(player.getNameIdentifier() == "P2"){
	    	this.setTexture("ssb_wmod");
		}
	    //reposition external drones
	    if(index == 1){
	    	if(player.getNameIdentifier() == "P1"){
				this.setPosition(x += 300, y -= 300);
			}else{
				this.setPosition(x -= 300, y -= 300);
			}
		}else if(index == 2){
			if(player.getNameIdentifier() == "P1"){
				this.setPosition(x += 300, y += 300);
			}else{
				this.setPosition(x -= 300, y += 300);
			}
		}

	    this.player = player;
	    this.index = index;
	    this.setVisible(false);
	    scene.add.existing(this);

	    this.activatedWeapons = 0;
	    this.weapons = [new Weapon(scene, this, WeaponType.NONE, this.player, 0),
						new Weapon(scene, this, WeaponType.NONE, this.player,1),
						new Weapon(scene, this, WeaponType.NONE, this.player,2)];

		this.x =  x;
		this.y = y;
		this.durationX = 1250;
		this.durationY = 750;
		this.sinX = 0;
		this.sinY = 0;

		this.buildPiTerm();
	    // this.activateOnScreenText();
	    this.buildWeaponPi(parseInt(player.getNameIdentifier().charAt(1)), index);

    }

    getPlayer() : Player{
	    return this.player;
    }

    /**
    add a weapon to the drone (has to be done via pi calculus)
     */
    addWeapon(weapon : string) : void{
    	let w = this.weapons[this.getNrWeapons()];
		weapon = weapon.substr(0, 3)
	    if(weapon == "arm"){
			w.setWeapon(WeaponType.LASER_ARMOR);
        }else if(weapon == "shi") {
			w.setWeapon(WeaponType.PROJECTILE_SHIELD);
        }else if(weapon == "roc"){ // TODO: is this right?
			w.setWeapon(WeaponType.ROCKET);
		}

	    w.setVisible(true);
	    this.buildPiTerm();
	    this.refreshOnScreenText();
		this.activatedWeapons = this.activatedWeapons + 1;
    }

    /**
    get number of installed weapons
     */
    getNrWeapons() : number{
	    return this.activatedWeapons;
    }

    /**
    get weapons Array
     */
    getWeapons() : Weapon[]{
    	return this.weapons;
	}

    /**
    get number of weapondrone (0: ship, 1: upper weapondrone, 2: lower weapondrone)
     */
    getIndex() : number{
		return this.index;
	}

	/**
	build pi Term that represents the weapondrone and will be displayed on Screen
	 */
	buildPiTerm() : void {
		if(this.visible || this.index == 0) {
			this.piTerm = "lock().";
			this.simplePi = "lock().";

			for (let w of this.weapons) {
				if (w.visible) {
					this.piTerm = this.piTerm + w.getPiTerm() + "<>.";
					this.simplePi = this.simplePi + w.getSimplePi() + "<>.";
				}
			}
			this.piTerm = this.piTerm + "0";
			this.simplePi = this.simplePi + "0";
		}
	}

	toString() : string{
		return this.simplePi;
	}

	/**
	first activation of displayed text for pi representation of drones
	 */
	// activateOnScreenText() : void{
	// 	if(this.index != 0) {
	// 		this.onScreenText = this.scene.add.text(this.x - 30, this.y + 60, this.simplePi, {
	// 			fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
	// 		});
	// 	}else {
	// 		if (this.player.getNameIdentifier() == "P1") {
	// 			this.onScreenText = this.scene.add.text(this.x - 270, this.y + 100, this.simplePi, {
	// 				fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
	// 			});
	// 		} else {
	// 			this.onScreenText = this.scene.add.text(this.x + 235, this.y + 100, this.simplePi, {
	// 				fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
	// 			});
	//
	// 		}
	// 		this.onScreenText.setAngle(270);
	// 	}
	// 	this.onScreenText.setDisplayOrigin(0.5);
	// }

	/**
	refreshes the displayed Pi Term, if any changes (add Weapons) where made
	 */
	refreshOnScreenText() : void{
		// this.onScreenText.setText(this.simplePi);

		let infobox = <Infobox> this.scene.data.get("infoboxx");
		let splitTerm = this.onScreenText.text.split(".");
		let equippedWeapons = "";
		for (let i = 0; i < splitTerm.length; i++)
			if (i != 0 && i != splitTerm.length-1)
				equippedWeapons += splitTerm[i] + ", ";
		equippedWeapons = equippedWeapons ? equippedWeapons.substr(0, equippedWeapons.length-2) : "none yet";


		let tooltipInfo =
			"[" + this.getPlayer().getNameIdentifier() + "] This is the pi-term of this drone. \n"
			+ "     <> : output channel (resolves with corresponding () - channel)\n"
			+ "     () : input channel (waits for incoming <> - channel)\n"
			+ "     0 : null process (resolves itself) \n\n"
			+ "current term:         " + this.onScreenText.text + "\n"
			+ "currently active:     " + this.onScreenText.text.split(".")[0] + "\n"
			+ "will be resolved by:  " + Infobox.getOppositeTerm(this.onScreenText.text.split(".")[0], this.player.getNameIdentifier()) + "\n\n"
			+ "The enclosing \"lock()\" - channel is literally a weapon lock. \n"
			+ "As soon as you hit attack, a replication \"!(lock<>)\" will be pushed into \nthe pi-system, which continiously emits \"lock<>\" - terms.\n"
			+ "Then, all equipped weapons (" + equippedWeapons + ") will fire in sequential order.\n"

		infobox.addTooltipInfo(this.onScreenText, tooltipInfo);

		this.index != 0 ? infobox.addTooltipInfo(this, "[" + this.player.getNameIdentifier() + "] Extension Drone " + this.index + ":\n     It will fire after the previous drone has fired.") : null;

		this.index == 0 ? this.player.isFirstPlayer() ? this.scene.data.get("redship").setOnScreenText(this.onScreenText) :this.scene.data.get("blueship").setOnScreenText(this.onScreenText) : null;
		this.updatePiAnimSeq();
	}

	private updatePiAnimSeq(): void{
		this.piSeq.show();

		this.piSeq.clearSequence(this.x, this.y + 80, 'lock'+this.player.getNameIdentifier().toLowerCase()+'()',
			PiAnimAlignment.CENTER);
		if (this.weapons[0].canShoot()) this.piSeq.addSymbol(this.weapons[0].getSimplePi()+'<>');
		if (this.weapons[1].canShoot()) this.piSeq.addSymbol(this.weapons[1].getSimplePi()+'<>');
		if (this.weapons[2].canShoot()) this.piSeq.addSymbol(this.weapons[2].getSimplePi()+'<>');
		this.piSeq.addSymbol('Weapon'+this.player.getNameIdentifier()+'N'+(this.index + 1));
	}

	private resolveAndClearPiAnimSeq(): void{
		let other = this.piSeq.resolveAllAndClearSequence(this.x, this.y + 80, 'lock'+this.player.getNameIdentifier().toLowerCase()+'()',
			PiAnimAlignment.CENTER);
		if (this.weapons[0].canShoot()) other.addSymbol(this.weapons[0].getSimplePi()+'<>');
		if (this.weapons[1].canShoot()) other.addSymbol(this.weapons[1].getSimplePi()+'<>');
		if (this.weapons[2].canShoot()) other.addSymbol(this.weapons[2].getSimplePi()+'<>');
		other.addSymbol('Weapon'+this.player.getNameIdentifier()+'N'+(this.index + 1));
	}



    public update(delta: number): void {


		this.sinX += delta/ this.durationX;
		this.sinY += delta/ this.durationY;

		this.sinX %= 2*Math.PI;
		this.sinY %= 2*Math.PI;

		this ? this.setPositionSin(true,true) : null;


		this.weapons[0].update(delta);
        this.weapons[1].update(delta);
        this.weapons[2].update(delta);
    }

	/**
	 * builds weaponmod and weapons in pi calculus
	 * @param player : number of Player 1/2
	 * @param drone : index of weapon mod 0/1/2
	 */
	buildWeaponPi(player : number, drone : number) : void{
		let p = player.toString();
		let d = drone.toString();
		let system = this.player.getSystem();

		let weapon = system.add.term("Weapon" + p + d, undefined);
		let droneRef: Drone = this;
		let sum = system.add.sum([system.add.channelInCB("lock" + p + d,"", ()=>{
			this.piSeq.resolveSymbol();
		}).
		channelOutCB("w1","", (_, at) => {
			droneRef.getWeapons()[0].createBullet(at); if (this.weapons[0].canShoot()) this.piSeq.resolveSymbol();
		}).        //function for weapon animation
		channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
		channelOut("wait","").channelOut("wait","").
		channelOutCB("w2", "", (_, at) => {
			droneRef.getWeapons()[1].createBullet(at); if (this.weapons[1].canShoot()) this.piSeq.resolveSymbol();
		}).
		channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
		channelOut("wait","").channelOut("wait","").
		channelOutCB("w3", "", (_, at) => {
			droneRef.getWeapons()[2].createBullet(at); this.resolveAndClearPiAnimSeq();
		}).
		next(weapon),
			system.add.channelInCB("wext" + p + d + "0", "w1", (wClass) => {
				this.addWeapon(wClass);
			}).
			next(weapon),
			system.add.channelInCB("wext" + p + d + "1", "w2", (wClass) => {
				this.addWeapon(wClass);
			}).
			next(weapon),
			system.add.channelInCB("wext" + p + d + "2", "w3", (wClass) => {
				this.addWeapon(wClass);
			}).
			next(weapon)]);
		weapon.symbol = sum;

		system.pushSymbol(system.add.channelInCB("wmod" + p + d, "", () => {
			this.player.createDrone(drone);
		}).
		channelOut("newlock" + p + d, "lock" + p + d).
		next(weapon));
	}

	private moveSin(fromX: number, toX: number, fromY: number, toY: number, delta: number, sprite: Sprite) {
		sprite.x = fromX + Math.sin(delta * Math.PI / 2) * (toX - fromX);
		sprite.y = fromY + Math.cos(delta * Math.PI / 2) * (toY - fromY);
	}

	private setPositionSin(moveX: boolean, moveY: boolean)
	{
		let posX = moveX ? (this.x + Math.sin(this.sinX) / 2.0) : this.x;
		let posY = moveY ? this.y + Math.cos(this.sinY) / 2.0: this.y;


		if (this.index != 0 && this.weapons)
		{
			for (let i = 0; i < this.weapons.length; i++)
			{
				let weapon = this.weapons[i];
				if (weapon)
				{
					// let posXweapon = moveX && weapon ? (weapon.x + Math.sin(this.sinX) * 25) : weapon ? weapon.x : null;
					// let posYweapon = moveY && weapon ? (weapon.y + Math.cos(this.sinY) * 25) : weapon ? weapon.y : null;
					let offX = this.player.isFirstPlayer() ? 75 : -75;


					i == 0 ?
						weapon.setPosition(this.x + offX, this.y -40)
						:
						i == 1 ?
							weapon.setPosition(this.x + offX, this.y +40	)
							:
							null;
				}
			}
		}

		this.setPosition(posX,posY)
		posX = this.getPlayer().isFirstPlayer() ? posX + this.onScreenText.width/2 :  posX - this.onScreenText.width/2
		this.index != 0 ? this.onScreenText.setPosition(posX, posY + 75) : null;

	}
}