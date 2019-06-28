import {MotorFlame} from "../../../ship/motor-flame";
import {WeaponType} from "../../../weapon/weapon-type";
import {TutWeapon} from "./tut-weapon";
import {BulletInfo} from "../../../weapon/bulletInfo";
import {Infobox} from "../../../Infobox";
import {PiAnimAlignment} from "../../../pianim/pi-anim-alignment";

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
        this.onScreenText.setText(this.simplePi);
        // this.onScreenText.setText(this.simplePi);

        let infobox = <Infobox> this.scene.data.get("infoboxx");
        // let splitTerm = this.simplePi.split(".");
        // let equippedWeapons = "";
        // for (let i = 0; i < splitTerm.length; i++)
        // 	if (i != 0 && i != splitTerm.length-1)
        // 		equippedWeapons += splitTerm[i] + ", ";
        // equippedWeapons = equippedWeapons ? equippedWeapons.substr(0, equippedWeapons.length-2) : "none yet";


        // let tooltipInfo =
        // 	"[" + this.getPlayer().getNameIdentifier() + "] This is the pi-term of this drone. \n"
        // 	+ "     <> : output channel (resolves with corresponding () - channel)\n"
        // 	+ "     () : input channel (waits for incoming <> - channel)\n"
        // 	+ "     0 : null process (resolves itself) \n\n"
        // 	+ "current term:         " + this.simplePi + "\n"
        // 	+ "currently active:     " + this.simplePi.split(".")[0] + "\n"
        // 	+ "will be resolved by:  " + Infobox.getOppositeTerm(this.simplePi.split(".")[0], this.player.getNameIdentifier()) + "\n\n"
        // 	+ "The enclosing \"lock()\" - channel is literally a weapon lock. \n"
        // 	+ "As soon as you hit attack, a replication \"!(lock<>)\" will be pushed into \nthe pi-system, which continiously emits \"lock<>\" - terms.\n"
        // 	+ "Then, all equipped weapons (" + equippedWeapons + ") will fire in sequential order.\n"

        // infobox.addTooltipInfo(this.onScreenText, tooltipInfo);

        this.index > 1 ? infobox.addTooltipInfo(this, "[" + this.isP1 ? "P1" : "P2" +
            "] Extension Drone " + this.index + ":\n     It will fire after the previous drone has fired.") : null;
        this.index == 1 ? infobox.addTooltipInfo(this, "[" +
        this.isP1 ? "P1" : "P2" + "] Extension Drone " + this.index + ":\n " +
            "    It will fire after the space ship has fired.") : null;


        this.index == 0 ? this.isP1 ? this.scene.data.get("redship").setOnScreenText(this.onScreenText) :this.scene.data.get("blueship").setOnScreenText(this.onScreenText) : null;

    }

    public updatePiAnimSeq(): void{
    //     this.piSeq.show();
    //
    //     this.piSeq.clearSequence(this.posX, this.posY + 80, 'lock'+this.player.getNameIdentifier().toLowerCase()+'()',
    //         PiAnimAlignment.CENTER);
    //     if (this.weapons[0].canShoot()) this.piSeq.addSymbol(this.weapons[0].getSimplePi()+'<>');
    //     if (this.weapons[1].canShoot()) this.piSeq.addSymbol(this.weapons[1].getSimplePi()+'<>');
    //     if (this.weapons[2].canShoot()) this.piSeq.addSymbol(this.weapons[2].getSimplePi()+'<>');
    //     this.piSeq.addSymbol('Weapon'+this.player.getNameIdentifier()+'N'+(this.index + 1));
    }

    private resolveAndClearPiAnimSeq(): void{
        // let other = this.piSeq.resolveAllAndClearSequence(this.x, this.y + 80, 'lock'+this.player.getNameIdentifier().toLowerCase()+'()',
        //     PiAnimAlignment.CENTER);
        // if (this.weapons[0].canShoot()) other.addSymbol(this.weapons[0].getSimplePi()+'<>');
        // if (this.weapons[1].canShoot()) other.addSymbol(this.weapons[1].getSimplePi()+'<>');
        // if (this.weapons[2].canShoot()) other.addSymbol(this.weapons[2].getSimplePi()+'<>');
        // other.addSymbol('Weapon'+this.player.getNameIdentifier()+'N'+(this.index + 1));
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
        // let p = player.toString();
        // let d = drone.toString();
        // // let system = this.player.getSystem(); //TODO
        //
        // let system;
        //
        // let weapon = system.add.term("Weapon" + p + d, undefined);
        // let droneRef: TutDrone = this;
        // let sum = system.add.sum([system.add.channelInCB("lock" + p + d,"", ()=>{
        //     // this.piSeq.resolveSymbol();
        // }).
        // channelOutCB("w1","", (_, at) => {
        //     droneRef.getWeapons()[0].createBullet(at);
        //     // if (this.weapons[0].canShoot()) this.piSeq.resolveSymbol();
        // }).        //function for weapon animation
        // channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
        // channelOut("wait","").channelOut("wait","").
        // channelOutCB("w2", "", (_, at) => {
        //     // droneRef.getWeapons()[1].createBullet(at); if (this.weapons[1].canShoot()) this.piSeq.resolveSymbol();
        // }).
        // channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
        // channelOut("wait","").channelOut("wait","").
        // channelOutCB("w3", "", (_, at) => {
        //     // droneRef.getWeapons()[2].createBullet(at); this.resolveAndClearPiAnimSeq();
        // }).
        // next(weapon),
        //     system.add.channelInCB("wext" + p + d + "0", "w1", (wClass) => {
        //         this.addWeapon(wClass);
        //     }).
        //     next(weapon),
        //     system.add.channelInCB("wext" + p + d + "1", "w2", (wClass) => {
        //         this.addWeapon(wClass);
        //     }).
        //     next(weapon),
        //     system.add.channelInCB("wext" + p + d + "2", "w3", (wClass) => {
        //         this.addWeapon(wClass);
        //     }).
        //     next(weapon)]);
        // weapon.symbol = sum;
        //
        // system.pushSymbol(system.add.channelInCB("wmod" + p + d, "", () => {
        //     // this.player.createDrone(drone);  //TODO
        //     if(this.scene.scene.get("MainScene").data.get("mode") == "1" && this.isP1){
        //         this.scene.scene.get("MainScene").events.emit("unlockW");
        //     }
        //     else if(this.scene.scene.get("MainScene").data.get("mode") == "2" && !this.isP1){
        //         this.scene.scene.get("MainScene").events.emit("unlockW");
        //
        //     }
        //     else if(this.scene.scene.get("MainScene").data.get("mode") == "0"){
        //         this.scene.scene.get("MainScene").events.emit("unlockW");
        //
        //     }
        //
        //         //button.restoreInteractive();
        //
        // }).
        // channelOut("newlock" + p + d, "lock" + p + d).
        // next(weapon));
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



}