import {Player} from "./player";
import {Weapon} from "./weapon";
import {WeaponType} from "./weapon/weapon-type";
import {BulletInfo} from "./weapon/bulletInfo";
import {ScenePiAnimation} from "../scenes/ScenePiAnimation";
import {AnimationUtilities} from "./animation/AnimationUtilites";
import {Animation} from "./animation/Animation";

export class Drone extends Phaser.GameObjects.Sprite{

	private player : Player;
	private weapons : [Weapon, Weapon, Weapon];
	private index : number;
	private piTerm : string;
	private simplePi : string;
	public onScreenText : Phaser.GameObjects.Text;
	private activatedWeapons: integer;

	public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, index : number){
		super(scene, x, y, "ssr_wmod");
	    if(player.getNameIdentifier() == "P2"){
	    	this.setTexture("ssb_wmod");
		}
	    //reposition external drones
	    if(index == 1){
	    	if(player.getNameIdentifier() == "P1"){
				this.setPosition(x + 300, y - 300);
			}else{
				this.setPosition(x - 300, y - 300);
			}
		}else if(index == 2){
			if(player.getNameIdentifier() == "P1"){
				this.setPosition(x + 300, y + 300);
			}else{
				this.setPosition(x - 300, y + 300);
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

		this.buildPiTerm();
	    this.activateOnScreenText();
	    this.buildWeaponPi(parseInt(player.getNameIdentifier().charAt(1)), index);

    }

    private animateIfNotMissed(weaponNr: number, bulletInfo: BulletInfo)
	{
		var animationScene = <ScenePiAnimation> this.scene.scene.get("AnimationScene");
		if (this.getWeapons()[weaponNr-1].weaponType == WeaponType.NONE || typeof(bulletInfo) != 'undefined' && bulletInfo.miss)
			switch(weaponNr)
			{
				case 1:
				{
					animationScene.weapon1Missed = true;
					return;
				}
				case 2:
				{
					animationScene.weapon2Missed = true;
					return;
				}
				case 3:
				{
					animationScene.weapon3Missed = true;
					animationScene.allWeaponsFired = true;
					return;
				}

			}

	}

	private animateLockReplication(drone: Drone) {
		let animationScene = <ScenePiAnimation> this.scene.scene.get("AnimationScene");
		let onScreenTextOut = animationScene.add.text(1920/2, 1080, AnimationUtilities.getLockReplicationText(), AnimationUtilities.getFontStyle());

		let toX = 1920/2 - onScreenTextOut.width/2;
		let toY = 1080 - 150;
		let animationOut = new Animation("<lock>", animationScene, onScreenTextOut.x, onScreenTextOut.y, toX, toY, onScreenTextOut, 1000);

		animationOut.move = true;
		animationOut.scaleFont = true;
		// animationOut.interpolate = true;
		// animationOut.toColor = AnimationUtilities.getReplicationColor();

		animationScene.addConcurrentAnimation(animationOut, false, false);
	}

	private animatePiCalc(drone: Drone) {
		let animationScene = <ScenePiAnimation> this.scene.scene.get("AnimationScene");
		let onScreenTexts = AnimationUtilities.popAllSymbols(drone.onScreenText, animationScene);
		drone.onScreenText.setVisible(false);
		let totalWidth = AnimationUtilities.calculateWidth(onScreenTexts)
		let currentFontSize = parseInt(onScreenTexts[0].style.fontSize.substr(0,2));
		let fontDelta = Math.abs(50 - currentFontSize);
		let fontScaleFactor = 50 / currentFontSize;
		totalWidth += (fontDelta * 2.8);
		let toX = 0;
		for (let i = 0 ; i < onScreenTexts.length; i++)
		{
			let textObject = onScreenTexts[i];
			toX = i == 0 ? 1920/2 - (totalWidth/2) : toX += (onScreenTexts[i-1].displayWidth * fontScaleFactor);
			let toY = 1080/1.3;
			let id = textObject.text.indexOf("lock") >= 0 ? "(lock)" : "weapon";
			if (textObject.text == "0")
				id = "0";
			let animation = new Animation(id, animationScene, textObject.x, textObject.y, toX, toY, textObject, 1000);
			animation.rotate = true;
			animation.move = true;
			animation.scaleFont = true;
			animation.interpolate = true;
			if (i != 0 && i != onScreenTexts.length - 1)
			{
				if (i == 1)
					animation.weaponNumber = 1;
				else if (i == 2)
					animation.weaponNumber = 2;
				else if (i == 3)
					animation.weaponNumber = 3;
				animation.weaponType = animation.id == "weapon" ? textObject.text.substr(0,2) : null;
			}

			animation.toColor = AnimationUtilities.getPlayerColor(drone.getPlayer());
			animationScene.addConcurrentAnimation(animation, false, false);
			// if (drone.getIndex() == 0) animationScene.addConcurrentAnimation(animation, true, false);
			// if (drone.getIndex() == 1) animationScene.addToNewBatch(animation, true, false);
			// if (drone.getIndex() == 2) animationScene.addToNewBatch(animation, true, false);
		}

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
	activateOnScreenText() : void{
		if(this.index != 0) {
			this.onScreenText = this.scene.add.text(this.x - 30, this.y + 60, this.simplePi, {
				fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
			});
		}else {
			if (this.player.getNameIdentifier() == "P1") {
				this.onScreenText = this.scene.add.text(this.x - 270, this.y + 100, this.simplePi, {
					fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
				});
			} else {
				this.onScreenText = this.scene.add.text(this.x + 235, this.y + 100, this.simplePi, {
					fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
				});

			}
			this.onScreenText.setAngle(270);
		}
		this.onScreenText.setDisplayOrigin(0.5);
	}

	/**
	refreshes the displayed Pi Term, if any changes (add Weapons) where made
	 */
	refreshOnScreenText() : void{
		this.onScreenText.setText(this.simplePi);
		this.onScreenText.setVisible(true);
		//this.onScreenText.setDisplayOrigin(0.5);
	}

    public update(delta: number): void {
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
		let sum = system.add.sum([system.add.channelInCB("lock" + p + d,"", ()=>
		{
			this.animateLockReplication(droneRef);
			this.animatePiCalc(droneRef);
		}).
		channelOutCB("w1","", (_, at) => {
			this.animateIfNotMissed(1,at)
			droneRef.getWeapons()[0].createBullet(at)

		}).        //function for weapon animation
		channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
		channelOut("wait","").channelOut("wait","").
		channelOutCB("w2", "", (_, at) => {
			this.animateIfNotMissed(2,at)
			droneRef.getWeapons()[1].createBullet(at)
		}).
		channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
		channelOut("wait","").channelOut("wait","").
		channelOutCB("w3", "", (_, at) => {
			this.animateIfNotMissed(3,at)
			droneRef.getWeapons()[2].createBullet(at)
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

}