import {Player} from "./player";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {BulletInfo} from "./weapon/bulletInfo";
import {Bullet} from "./weapon/bullet";
import {PiAnimSystem} from "./pianim/pi-anim-system";
import {PiAnimSequence} from "./pianim/pi-anim-sequence";
import {WeaponType} from "./weapon/weapon-type";
import Sprite = Phaser.GameObjects.Sprite;
import {BlueShip} from "./ship/blue-ship";
import {RedShip} from "./ship/red-ship";


export class Motor  {

    private player: Player;
    private system: PiSystem;
    private activeMotorsLaserP1: number;
    private activeMotorsProjectileP1: number;
    private activeMotorsRocketP1: number;
    private activeMotorsLaserP2: number;
    private activeMotorsProjectileP2: number;
    private activeMotorsRocketP2: number;
    private piSeqS: PiAnimSequence;
    private piSeqA: PiAnimSequence;
    private piSeqR: PiAnimSequence;
    private blueship : BlueShip;
    //<reference path=" />

    //  private nameIdentifier : string;

    public constructor(scene: Phaser.Scene, player: Player, x: number, y: number, piAnim: PiAnimSystem) {
        this.player = player;
        this.system = this.player.getSystem();
        this.activeMotorsLaserP1 = 0;
        this.activeMotorsProjectileP1 = 0;
        this.activeMotorsRocketP1 = 0;
        this.activeMotorsLaserP2 = 0;
        this.activeMotorsProjectileP2 = 0;
        this.activeMotorsRocketP2 = 0;

        let pid = player.getNameIdentifier().toLowerCase();

        let piX = 50;
        if (!this.player.isFirstPlayer()) piX = 1800;
        this.piSeqS = piAnim.addSequence(piX, 900, '!s'+pid+'()');
        this.piSeqS.addSymbol('0');

        this.piSeqA = piAnim.addSequence(piX, 950, '!a'+pid+'()');
        this.piSeqA.addSymbol('0');

        this.piSeqR = piAnim.addSequence(piX, 1000, '!r'+pid+'()');
        this.piSeqR.addSymbol('0');




        if (this.player.isFirstPlayer()){
            // creating laser motors when bought in shop for p1
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorlaser11', '')
                    .channelOutCB('buildmotorlaser11', '',
                        () => {this.activeMotorsLaserP1 = this.activeMotorsLaserP1 + 1})
                    .channelIn('buymotorlaser12', '', )
                    .channelOutCB('increasesizelaser12', '', () => console.log("test"))
                    .channelOutCB('buildmotorlaser12', '',
                    () => {this.activeMotorsLaserP1 = this.activeMotorsLaserP1 + 1})
                    .channelIn('buymotorlaser13', '')
                    .channelOut('increasesizelaser13', '')
                    .channelOutCB('buildmotorlaser13', '',
                    () => {this.activeMotorsLaserP1 = this.activeMotorsLaserP1 + 1})
                    .nullProcess()
            );

            // creating projectile motors when bought in shop for p1
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorprojectile11', '')
                    .channelOutCB('buildmotorprojectile11', '',
                        () => {this.activeMotorsProjectileP1 = this.activeMotorsProjectileP1 + 1})
                    .channelIn('buymotorprojectile12', '')
                    .channelOut('increasesizeprojectile12', '')
                    .channelOutCB('buildmotorprojectile12', '',
                    () => {this.activeMotorsProjectileP1 = this.activeMotorsProjectileP1 + 1})
                    .channelIn('buymotorprojectile13', '')
                    .channelOut('increasesizeprojectile13', '')
                    .channelOutCB('buildmotorprojectile13', '',
                    () => {this.activeMotorsProjectileP1 = this.activeMotorsProjectileP1 + 1})
                    .nullProcess()
            );

            // creating rocket motors when bought in shop for p1
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorrocket11', '')
                    .channelOutCB('buildmotorrocket11', '',
                        () => {this.activeMotorsRocketP1 = this.activeMotorsRocketP1 + 1})
                    .channelIn('buymotorrocket12', '')
                    .channelOut('increasesizerocket12', '')
                    .channelOutCB('buildmotorrocket12', '',
                        () => this.activeMotorsRocketP1 = this.activeMotorsRocketP1 + 1)
                    .channelIn('buymotorrocket13', '')
                    .channelOut('increasesizerocket13', '')
                    .channelOutCB('buildmotorrocket13', '',
                        () => this.activeMotorsRocketP1 = this.activeMotorsRocketP1 + 1)
                    .nullProcess()
            );
            //
            // Dodge Chance for Player 1
            //


            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorlaser11', '').replication(
                    this.system.add.channelInCB('armorP1', '',
                        ()=>{this.piSeqA.resolveAllAndClearSequence(50, 950, '!a'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorlaser12', '').replication(
                    this.system.add.channelInCB('armorP1', '',
                        ()=>{this.piSeqA.resolveAllAndClearSequence(50, 950, '!a'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorlaser13', '').replication(
                    this.system.add.channelInCB('armorP1', '',
                        ()=>{this.piSeqA.resolveAllAndClearSequence(50, 950, '!a'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorprojectile11', '').replication(
                    this.system.add.channelInCB('shieldP1', '',
                        ()=>{this.piSeqS.resolveAllAndClearSequence(50, 900, '!s'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorprojectile12', '').replication(
                    this.system.add.channelInCB('shieldP1', '',
                        ()=>{this.piSeqS.resolveAllAndClearSequence(50, 900, '!s'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorprojectile13', '').replication(
                    this.system.add.channelInCB('shieldP1', '',
                        ()=>{this.piSeqS.resolveAllAndClearSequence(50, 900, '!s'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket11', '').replication(
                    this.system.add.channelInCB('rocketP1', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket12', '').replication(
                    this.system.add.channelInCB('rocketP1', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket13', '').replication(
                    this.system.add.channelInCB('rocketP1', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        }


        else {


            // creating laser motors when bought in shop for p2
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorlaser21', '').
                channelOutCB('buildmotorlaser21', '', () => this.activeMotorsLaserP2 = this.activeMotorsLaserP2 + 1).
                channelIn('buymotorlaser22', '').
                channelOut('increasesizelaser22', '').
                channelOutCB('buildmotorlaser22', '', () => this.activeMotorsLaserP2 = this.activeMotorsLaserP2 + 1).
                channelIn('buymotorlaser23', '').
                channelOut('increasesizelaser23', '').
                channelOutCB('buildmotorlaser23', '', () => this.activeMotorsLaserP2 = this.activeMotorsLaserP2 + 1).
                nullProcess()
            );

            // creating projectile motors when bought in shop for p2
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorprojectile21', '').
                channelOutCB('buildmotorprojectile21', '', () => this.activeMotorsProjectileP2 = this.activeMotorsProjectileP2 + 1).
                channelIn('buymotorprojectile22', '').
                channelOut('increasesizeprojectile22', '').
                channelOutCB('buildmotorprojectile22', '', () => this.activeMotorsProjectileP2 = this.activeMotorsProjectileP2 + 1).
                channelIn('buymotorprojectile23', '').
                channelOut('increasesizeprojectile23', '').
                channelOutCB('buildmotorprojectile23', '', () => this.activeMotorsProjectileP2 = this.activeMotorsProjectileP2 + 1).
                nullProcess()
            );

            // creating rocket motors when bought in shop for p2
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorrocket21', '').
                channelOutCB('buildmotorrocket21', '', () => this.activeMotorsRocketP2 = this.activeMotorsRocketP2 + 1).
                channelIn('buymotorrocket22', '').
                channelOut('increasesizerocket22', '').
                channelOutCB('buildmotorrocket22', '', () => this.activeMotorsRocketP2 = this.activeMotorsRocketP2 + 1).
                channelIn('buymotorrocket23', '').
                channelOut('increasesizerocket23', '').
                channelOutCB('buildmotorrocket23', '', () => this.activeMotorsRocketP2 = this.activeMotorsRocketP2 + 1).
                nullProcess()
            );


            //
            // PLAYER 2
            //

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorlaser21', '').replication(
                    this.system.add.channelInCB('armorP2', '',
                        ()=>{this.piSeqA.resolveAllAndClearSequence(50, 950, '!a'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorlaser22', '').replication(
                    this.system.add.channelInCB('armorP2', '',
                        ()=>{this.piSeqA.resolveAllAndClearSequence(50, 950, '!a'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorlaser23', '').replication(
                    this.system.add.channelInCB('armorP2', '',
                        ()=>{this.piSeqA.resolveAllAndClearSequence(50, 950, '!a'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorprojectile21', '').replication(
                    this.system.add.channelInCB('shieldP2', '',
                        ()=>{this.piSeqS.resolveAllAndClearSequence(50, 900, '!s'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorprojectile22', '').replication(
                    this.system.add.channelInCB('shieldP2', '',
                        ()=>{this.piSeqS.resolveAllAndClearSequence(50, 900, '!s'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorprojectile23', '').replication(
                    this.system.add.channelInCB('shieldP2', '',
                        ()=>{this.piSeqS.resolveAllAndClearSequence(50, 900, '!s'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket21', '').replication(
                    this.system.add.channelInCB('rocketP2', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket22', '').replication(
                    this.system.add.channelInCB('rocketP2', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket23', '').replication(
                    this.system.add.channelInCB('rocketP2', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));


        }
  //      console.log("test");
 //       this.motorL1 = new Sprite(scene, 500, 200, "fire_light").setScale(0.8, 0.75);
 //       this.motorL1 = Phaser.add.sprite()
        this.startMotor();

    }

 /*   public setMotorTexture void{
        this.wClass = Weapon.getWeaponClass(type);
        this._weaponType = type;
        this.setTexture(Weapon.getWeaponTex(this.isFirst, type));
        this.simplePi = this.wClass.charAt(0);
        this.createPiTerm();

        this.drone.getPlayer().isFirstPlayer() ? this.scene.data.get("redship").addWeapon(this) : this.scene.data.get("blueship").addWeapon(this);
    } */

  /*  private static getMotorTex(isFirstPlayer: boolean, type: WeaponType) : string{
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
    } */


    public startMotor() {

        if (this.player.isFirstPlayer()) {
            //For Player 1
            this.system.pushSymbol(
                this.system.add.channelOut('buymotorlaser11', '').nullProcess()
            );
            this.system.pushSymbol(
                this.system.add.channelOut('buymotorprojectile11', '').nullProcess()
            );
            this.system.pushSymbol(
                this.system.add.channelOut('buymotorrocket11', '').nullProcess()
            );
        }
        else {
            //For Player 2
            this.system.pushSymbol(
                this.system.add.channelOut('buymotorlaser21', '').nullProcess()
            );
            this.system.pushSymbol(
                this.system.add.channelOut('buymotorprojectile21', '').nullProcess()
            );
            this.system.pushSymbol(
                this.system.add.channelOut('buymotorrocket21', '').nullProcess()
            );
        }
    }

    public setmotorL12(){
        this.blueship.motorL1.setScale(1.0,1.0);

    }
    public setmotorL13(){
        this.blueship.motorL1.setScale(1.2,1.2);

    }
    public setmotorP12(){


    }
    public setmotorPL12(){


    }

    getactiveMotorLaserP1(): number{
        return this.activeMotorsLaserP1;
    }

    getactiveMotorProjectileP1(): number{
        return this.activeMotorsProjectileP1;
    }

    getactiveMotorRocketP1(): number{
        return this.activeMotorsRocketP1;
    }

    getactiveMotorLaserP2(): number{
        return this.activeMotorsLaserP2;
    }

    getactiveMotorProjectileP2(): number{
        return this.activeMotorsProjectileP2;
    }

    getactiveMotorRocketP2(): number{
        return this.activeMotorsRocketP2;
    }
}