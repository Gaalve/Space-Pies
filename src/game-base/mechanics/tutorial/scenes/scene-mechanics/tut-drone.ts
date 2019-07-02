import {MotorFlame} from "../../../ship/motor-flame";
import {WeaponType} from "../../../weapon/weapon-type";
import {TutWeapon} from "./tut-weapon";
import {TutAnimationContainer} from "./tut-animation-container";

export class TutDrone extends Phaser.GameObjects.Sprite{

    private weapons : [TutWeapon, TutWeapon, TutWeapon];
    private index : number;
    private piTerm : string;
    private simplePi : string;
    public onScreenText : Phaser.GameObjects.Text;
    private activatedWeapons: integer;

    private readonly posX: number;
    private readonly posY: number;

    durationX : number;
    durationY : number;
    sinX : number;
    sinY : number;
	offset: number;

    // private animSys: PiAnimSystem;
    public created: boolean;

    public flame: MotorFlame;
    private flameOffset: number;

    private isP1: boolean;

    public constructor(scene : Phaser.Scene, x : number, y : number, index : number, isP1: boolean){
        super(scene, x, y, "ssr_wmod_off");
        this.isP1 = isP1;
        // this.animSys = animSys;
        // this.piSeq = animSys.addSequence(x, y+100, 'lock()', PiAnimAlignment.CENTER);
        // this.piSeq.addSymbol('0');
        // this.piSeq.hide();
        this.created = false;

        if(!isP1){
            this.setTexture("ssb_wmod_off");
        }
        if(index == 1){
            if(isP1){
                this.offset = -30;
			}else{
                // this.setPosition(x -= 300, y -= 300);
                this.offset = 30;
            }
        }else if(index == 2){
            if(isP1){
                this.offset = -30;
            }else{
				// this.setPosition(x -= 300, y += 200);
				this.offset = 30;
            }
        }

        this.setOrigin(0.5, 0.5);

        this.index = index;
        this.setVisible(false);
        scene.add.existing(this);

        this.activatedWeapons = 0;
        this.weapons = [new TutWeapon(scene, this, WeaponType.NONE, 0, isP1),
            new TutWeapon(scene, this, WeaponType.NONE, 1, isP1),
            new TutWeapon(scene, this, WeaponType.NONE, 2, isP1)];

        this.x =  x;
        this.y = y;
        this.posX = x;
        this.posY = y;
        this.durationX = 700 + 600 * Math.random();
        this.durationY = 500 + 300 * Math.random();
        this.sinX = 0;
        this.sinY = 0;

        this.buildPiTerm();
        this.activateOnScreenText();
        this.buildWeaponPi(isP1 ? 1 : 2, index);

        this.flame = new MotorFlame(scene);
        this.flameOffset = 45;
        if (this.isP1){
            this.flame.flipX();
            this.flameOffset = -48;
        }
        this.flame.tintRed();
        this.flame.setVisible(false);

    }

    public create(): void{
        this.setVisible(true);
        this.flame.setVisible(true);
        this.created = true;
    }

    /**
     add a weapon to the drone (has to be done via pi calculus)
     */
    addWeapon(weapon : string) : void{
        let w = this.weapons[this.getNrWeapons()];
        weapon = weapon.substr(0, 3);
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
        this.updatePiAnimSeq();
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
    getWeapons() : TutWeapon[]{
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
     refreshes the displayed Pi Term, if any changes (add Weapons) where made
     will be called when adding a weapon.. and for some reason every turn.........
     */
    refreshOnScreenText() : void{
    }

    public updatePiAnimSeq(): void{
    }



    public update(delta: number): void {


        this.sinX += delta/ this.durationX;
        this.sinY += delta/ this.durationY;

        this.sinX %= 2*Math.PI;
        this.sinY %= 2*Math.PI;

        this.setPositionSin();


        this.weapons[0].update(delta);
        this.weapons[1].update(delta);
        this.weapons[2].update(delta);
        //this.back.update(delta);
    }

    /**
     * builds weaponmod and weapons in pi calculus
     * @param player : number of Player 1/2
     * @param drone : index of weapon mod 0/1/2
     */
    buildWeaponPi(player : number, drone : number) : void{
    }

    private setPositionSin() {
        this.x =(this.posX + Math.sin(this.sinX) * 15);
        this.y =(this.posY + Math.cos(this.sinY) * 15);


        this.flame.setPosition(this.x + this.flameOffset, this.y);
        this.flame.setScaleSin(0.7, this.sinX*4);

        if (this.index != 0 && this.weapons) {
            this.weapons[0].setPosition(this.x + this.weapons[0].posX, this.y + this.weapons[0].posY);
            this.weapons[1].setPosition(this.x + this.weapons[1].posX, this.y + this.weapons[1].posY);
            this.weapons[2].setPosition(this.x + this.weapons[2].posX, this.y + this.weapons[2].posY);
		}

        let posX = this.isP1 ? this.x + this.onScreenText.width/2 :  this.x - this.onScreenText.width/2;
        this.index != 0 ? this.onScreenText.setPosition(posX, this.y + 75) : null;
    }






    public hidePiSeq(): void{
        // this.piSeq.hide();
    }

    public showPiSeq(): void{
        // if(this.created)
        //     this.piSeq.show();
    }







    /**
     first activation of displayed text for pi representation of drones
     */
    activateOnScreenText() : void{
        let scene = this.scene.scene.get("AnimationScene");
        if(this.index != 0) {
            this.onScreenText = scene.add.text(this.x - 30, this.y + 60, this.simplePi, {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
            });
        }else {
            if (this.isP1) {
                this.onScreenText = scene.add.text(this.x - 270, this.y + 100, this.simplePi, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
                });
            } else {
                this.onScreenText = scene.add.text(this.x + 235, this.y + 100, this.simplePi, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20
                });

            }
            this.onScreenText.setAngle(270);
        }
        this.onScreenText.setDisplayOrigin(0.5);
    this.onScreenText.setDepth(-1);
	}



    public destroyPiCalcTexts(): void{
        this.onScreenText.destroy();
        // this.piSeq.clearSequence(0,0,"");
    }

    public explode(): void{
        let animationContainer: TutAnimationContainer = this.scene.data.get("animCont");
        animationContainer.explosion.explosionAt(this.x, this.y, 0.7, 2.4);
        this.destroy();
        this.flame.setVisible(false);
        for (let w of this.weapons){
            w.destroy();
        }
    }



    public deleteWeapons(): void{
        this.weapons[0].setWeapon(WeaponType.NONE);
        this.weapons[1].setWeapon(WeaponType.NONE);
        this.weapons[2].setWeapon(WeaponType.NONE);
        this.weapons[0].setVisible(false);
        this.weapons[1].setVisible(false);
        this.weapons[2].setVisible(false);
        this.activatedWeapons = 0;
    }

}