import {Player} from "./player";
import {Weapon} from "./weapon";
import {PWeapon} from "./projectileweapon";
import {LWeapon} from "./laserweapon";
import {PiSystem} from "./picalc/pi-system";


export class Drone extends Phaser.GameObjects.Sprite{

	private player : Player;
	private weapons : [Weapon, Weapon, Weapon];
	private index : number;
	private piTerm : string;
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

	    this.weapons = [new Weapon(scene, this, "ssr_weap_las", "shield", 0),
						new Weapon(scene, this, "ssr_weap_las", "shield", 1),
						new Weapon(scene, this, "ssr_weap_las", "shield", 2)];

		this.buildPiTerm();
	    this.activateOnScreenText();

    }

    getPlayer() : Player{
	    return this.player;
    }

    /**
    add a weapon to the drone (has to be done via pi calculus)
     */
    addWeapon(weapon : string) : void{
    	let w = this.weapons[this.getNrWeapons()];
	    if(weapon == "l"){
			w.setWeaponClass("shield");
			if(this.player.getNameIdentifier() == "P1"){
				w.setTexture("ssr_weap_las");
			}else{
				w.setTexture("ssb_weap_las");
			}
        }else if(weapon == "p") {
			w.setWeaponClass("armor");
			if(this.player.getNameIdentifier() == "P1"){
				w.setTexture("ssr_weap_pro");
			}else{
				w.setTexture("ssb_weap_pro");
			}
        }
	    w.setVisible(true);
	    this.buildPiTerm();
	    this.refreshOnScreenText();
		this.activatedWeapons = this.activatedWeapons + 1;
		if(this.activatedWeapons < 3){
			this.piTermWExtensions();
		}
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
    get number of drone (0: ship, 1 + 2: external drones
     */
    getIndex() : number{
		return this.index;
	}

	/**
	build pi Term that represents the drone and will be displayed on Screen
	 */
	buildPiTerm() : void {
		if(this.visible || this.index == 0) {
			this.piTerm = "lock(*).";

			for (let w of this.weapons) {
				if (w.visible) {
					this.piTerm = this.piTerm + w.getPiTerm() + "<*>.";
				}
			}
			this.piTerm = this.piTerm + "0";
		}
	}

	/**
	first activation of displayed text for pi representation of drones
	 */
	activateOnScreenText() : void{
		if(this.index != 0) {
			this.onScreenText = this.scene.add.text(this.x - 30, this.y + 50, this.piTerm, {
				fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 1
			});
		}else {
			if (this.player.getNameIdentifier() == "P1") {
				this.onScreenText = this.scene.add.text(this.x - 270, this.y + 100, this.piTerm, {
					fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 1
				});
			} else {
				this.onScreenText = this.scene.add.text(this.x + 235, this.y + 100, this.piTerm, {
					fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 1
				});

			}
			this.onScreenText.setAngle(270);
		}
		this.onScreenText.setOrigin(0.5);
	}

	/**
	refreshes the displayed Pi Term, if any changes (add Weapons) where made
	 */
	refreshOnScreenText() : void{
		this.onScreenText.setText(this.piTerm);
		this.onScreenText.setOrigin(0.5);
	}

	/**
	add Pi sum with channels In wextXYl und wextXYp to add either laser or projectile weapon
	(X: playernumber, Y: dronenumber)
	 */
	piTermWExtensions() : void{
		let p = this.player.getNameIdentifier().charAt(1);
		let w = this.index.toString();
		let channel_l : string = "wext" + p + w + "l";
		let channel_p : string = "wext" + p + w + "p";

		this.player.getSystem().pushSymbol(this.player.getSystem().add.sum([
			this.player.getSystem().add.channelIn(channel_l, "*").process("aWl", () => {
				this.addWeapon("l");
			}),
			this.player.getSystem().add.channelIn(channel_p, "*").process("aWp", () => {
				this.addWeapon("p");
			})
		]))
	}
}