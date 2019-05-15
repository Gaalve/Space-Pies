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
    }

    getPlayer() : Player{
	    return this.player;
    }

    addWeapon(weapon : string) : void{
	    if(weapon == "l"){
	        this.weapons.push(new LWeapon(this.scene, this, this.weapons.length));

        }else if(weapon == "p") {
            this.weapons.push(new PWeapon(this.scene, this, this.weapons.length));
        }
	    this.buildPiTerm();
	    this.refreshOnScreenText();
    }

    getWeapons() : number{
	    return this.weapons.length;
    }

    getIndex() : number{
		return this.index;
	}

	buildPiTerm() : void {
		this.piTerm = null;
		this.piTerm = "lock(*).";

		for (let w of this.weapons) {
			this.piTerm = this.piTerm + w.getPiTerm() + ".";
		}
		this.piTerm = this.piTerm + "0";
	}

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

	refreshOnScreenText() : void{
		this.onScreenText.setText(this.piTerm);
	}

}