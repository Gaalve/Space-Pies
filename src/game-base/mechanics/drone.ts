import {Player} from "./player";
import {Weapon} from "./weapon";
import {PWeapon} from "./projectileweapon";
import {LWeapon} from "./laserweapon";
import {PiSystem} from "./picalc/pi-system";


export class Drone extends Phaser.GameObjects.Sprite{

	private player : Player;
	private weapons : Weapon[];
	private index : number;
	private piTerm : string;
	private onScreenText : Phaser.GameObjects.Text;


	public constructor(scene : Phaser.Scene, x : number, y : number, player : Player, index : number){
	    if(player.getNameIdentifier() == "P1") {
            super(scene, x, y, "ssr_wmod");
        }else{
	        super(scene, x, y, "ssb_wmod");
        }
	    this.weapons = new Array();
	    this.player = player;
	    this.index = index;
	    scene.add.existing(this);
	    this.buildPiTerm();
	    this.activateOnScreenText();
	    if(this.index > 0){
	    	this.pushPiTermsExt();
		}
    }

    getPlayer() : Player{
	    return this.player;
    }

    /**
    add a weapon to the drone (has to be done via pi calculus)
     */
    addWeapon(weapon : string) : void{
	    if(weapon == "l"){
	        this.weapons.push(new LWeapon(this.scene, this, this.weapons.length));

        }else if(weapon == "p") {
            this.weapons.push(new PWeapon(this.scene, this, this.weapons.length));
        }
	    this.buildPiTerm();
	    this.refreshOnScreenText();
    }

    /**
    get number of installed weapons
     */
    getNrWeapons() : number{
	    return this.weapons.length;
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

		this.piTerm = "lock(*).";

		for (let w of this.weapons) {
			this.piTerm = this.piTerm + w.getPiTerm() + "<*>.";
		}
		this.piTerm = this.piTerm + "0";
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
	}

	/**
	refreshes the displayed Pi Term, if any changes (add Weapons) where made
	 */
	refreshOnScreenText() : void{
		this.onScreenText.setText(this.piTerm);
	}

	/**
	add Pi sum with channels In wextXYl und wextXYp to add either laser or projectile weapon
	(X: playernumber, Y: dronenumber)
	 */
	pushPiTermsExt() : void{
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