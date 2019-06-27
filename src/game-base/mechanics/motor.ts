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
import Text = Phaser.GameObjects.Text;


export class Motor  {

    private player: Player;
    private system: PiSystem;
    private _activeMotorsLaser: number;
    private _activeMotorsProjectile: number;
    private _activeMotorsRocket: number;
    private piSeqS: PiAnimSequence;
    private piSeqA: PiAnimSequence;
    private piSeqR: PiAnimSequence;

    private evasionText: Text;
    private evChanceR: Text;
    private evChanceS: Text;
    private evChanceA: Text;


    //<reference path=" />

    //  private nameIdentifier : string;

    public constructor(scene: Phaser.Scene, player: Player, x: number, y: number, piAnim: PiAnimSystem) {
        this.player = player;
        this.system = this.player.getSystem();
        this._activeMotorsLaser = 0;
        this._activeMotorsProjectile = 0;
        this._activeMotorsRocket = 0;

        let pid = player.getNameIdentifier().toLowerCase();

        let piX = 50;
        if (!this.player.isFirstPlayer()) piX = 1800;
        this.piSeqS = piAnim.addSequence(piX, 900, '!s'+pid+'()');
        this.piSeqS.addSymbol('0');

        this.piSeqA = piAnim.addSequence(piX, 950, '!a'+pid+'()');
        this.piSeqA.addSymbol('0');

        this.piSeqR = piAnim.addSequence(piX, 1000, '!r'+pid+'()');
        this.piSeqR.addSymbol('0');


        let style = {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 26, strokeThickness: 3, stroke: '#000'
        };
        if (this.player.isFirstPlayer()){
            this.evasionText = scene.add.text(130, 840,"Evasion Chance P1", style).setOrigin(0.5, 0.5);
            this.evChanceR = scene.add.text(160, 1000,"R0%", style).setOrigin(0, 0.5);
            this.evChanceS = scene.add.text(160, 900,"S0%", style).setOrigin(0, 0.5);
            this.evChanceA = scene.add.text(160, 950,"a0%", style).setOrigin(0, 0.5);
        }
        else{
            this.evasionText = scene.add.text(1790, 840,"Evasion Chance P2", style).setOrigin(0.5, 0.5);
            this.evChanceR = scene.add.text(1700, 1000,"R0%", style).setOrigin(0, 0.5);
            this.evChanceS = scene.add.text(1700, 900,"S0%", style).setOrigin(0, 0.5);
            this.evChanceA = scene.add.text(1700, 950,"a0%", style).setOrigin(0, 0.5);
        }


        if (this.player.isFirstPlayer()){
            // creating laser motors when bought in shop for p1
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorlaser11', '')
                    .channelOutCB('buildmotorlaser11', '',
                        () => {this.buyMotorS()})
                    .channelIn('buymotorlaser12', '', )
                    .channelOutCB('buildmotorlaser12', '',
                    () => {this.buyMotorS()})
                    .channelIn('buymotorlaser13', '')
                    .channelOutCB('buildmotorlaser13', '',
                    () => {this.buyMotorS()})
                    .nullProcess()
            );

            // creating projectile motors when bought in shop for p1
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorprojectile11', '')
                    .channelOutCB('buildmotorprojectile11', '',
                        () => {this.buyMotorA()})
                    .channelIn('buymotorprojectile12', '')
                    .channelOutCB('buildmotorprojectile12', '',
                    () => {this.buyMotorA()})
                    .channelIn('buymotorprojectile13', '')
                    .channelOutCB('buildmotorprojectile13', '',
                    () => {this.buyMotorA()})
                    .nullProcess()
            );

            // creating rocket motors when bought in shop for p1
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorrocket11', '')
                    .channelOutCB('buildmotorrocket11', '',
                        () => {this.buyMotorR()})
                    .channelIn('buymotorrocket12', '')
                    .channelOutCB('buildmotorrocket12', '',
                        () => this.buyMotorR())
                    .channelIn('buymotorrocket13', '')
                    .channelOutCB('buildmotorrocket13', '',
                        () => this.buyMotorR())
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
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket12', '').replication(
                    this.system.add.channelInCB('rocketP1', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.2).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket13', '').replication(
                    this.system.add.channelInCB('rocketP1', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.2).nullProcess()));

        }


        else {


            // creating laser motors when bought in shop for p2
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorlaser21', '').
                channelOutCB('buildmotorlaser21', '', () => this.buyMotorS()).
                channelIn('buymotorlaser22', '').
                channelOutCB('buildmotorlaser22', '', () => this.buyMotorS()).
                channelIn('buymotorlaser23', '').
                channelOutCB('buildmotorlaser23', '', () => this.buyMotorS()).
                nullProcess()
            );

            // creating projectile motors when bought in shop for p2
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorprojectile21', '').
                channelOutCB('buildmotorprojectile21', '', () => this.buyMotorA()).
                channelIn('buymotorprojectile22', '').
                channelOutCB('buildmotorprojectile22', '', () => this.buyMotorA()).
                channelIn('buymotorprojectile23', '').
                channelOutCB('buildmotorprojectile23', '', () => this.buyMotorA()).
                nullProcess()
            );

            // creating rocket motors when bought in shop for p2
            this.system.pushSymbol(
                this.system.add.channelIn('buymotorrocket21', '').
                channelOutCB('buildmotorrocket21', '', () => this.buyMotorR()).
                channelIn('buymotorrocket22', '').
                channelOutCB('buildmotorrocket22', '', () => this.buyMotorR()).
                channelIn('buymotorrocket23', '').
                channelOutCB('buildmotorrocket23', '', () => this.buyMotorR()).
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
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket22', '').replication(
                    this.system.add.channelInCB('rocketP2', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.2).nullProcess()));

            this.system.pushSymbol(
                this.system.add.channelIn('buildmotorrocket23', '').replication(
                    this.system.add.channelInCB('rocketP2', '',
                        ()=>{this.piSeqR.resolveAllAndClearSequence(50, 1000, '!r'+pid+'()').addSymbol('0')},
                    new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.2).nullProcess()));


        }
        this.startMotor();

    }

    private buyMotorS(): void{
        this._activeMotorsLaser += 1;
        this.player.ship.modularShip.motorLsize1 = this._activeMotorsLaser/3 * 0.8 + 0.5;
        this.player.ship.modularShip.motorLsize2 = this._activeMotorsLaser/3 * 0.8 + 0.5;
        switch (this._activeMotorsLaser) {
            case 0: this.evChanceS.setText("0%");break;
            case 1: this.evChanceS.setText("30%");break;
            case 2: this.evChanceS.setText("45%");break;
            case 3: this.evChanceS.setText("55%");break;
        }
    }

    private buyMotorR(): void{
        this._activeMotorsRocket += 1;
        this.player.ship.modularShip.motorRsize1 = this._activeMotorsRocket/3 * 0.8 + 0.5;
        this.player.ship.modularShip.motorRsize2 = this._activeMotorsRocket/3 * 0.8 + 0.5;
        switch (this._activeMotorsRocket) {
            case 0: this.evChanceR.setText("0%");break;
            case 1: this.evChanceR.setText("0%");break;
            case 2: this.evChanceR.setText("15%");break;
            case 3: this.evChanceR.setText("30%");break;
        }
    }

    private buyMotorA(): void{
        this._activeMotorsProjectile += 1;
        this.player.ship.modularShip.motorPsize1 = this._activeMotorsProjectile/3 * 0.8 + 0.5;
        this.player.ship.modularShip.motorPsize2 = this._activeMotorsProjectile/3 * 0.8 + 0.5;
        switch (this._activeMotorsProjectile) {
            case 0: this.evChanceA.setText("0%");break;
            case 1: this.evChanceA.setText("30%");break;
            case 2: this.evChanceA.setText("45%");break;
            case 3: this.evChanceA.setText("55%");break;
        }
    }


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


    get activeMotorsLaser(): number {
        return this._activeMotorsLaser;
    }

    get activeMotorsProjectile(): number {
        return this._activeMotorsProjectile;
    }

    get activeMotorsRocket(): number {
        return this._activeMotorsRocket;
    }
}