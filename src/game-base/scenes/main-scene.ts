import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";
import {PiCalcTests} from "../tests/pi-calc-tests";
import {Healthbar} from "./objects/Healthbar";

import {PiSystem} from "../mechanics/picalc/pi-system";
import {Health} from "./objects/Health";

export class MainScene extends Phaser.Scene {

    /** How much game time has elapsed since the last rendering of a tick */
    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;
    private players: [Player, Player];
    private turn: Turn;
    private buttonEndTurn: Button;
    private buttonOption: Button;
    private shop: Button;
    private system: PiSystem;

    constructor() {
        super({
            key: "MainScene"
        })
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )

    }

    create(): void {

        // this.add.image(1920/2, 1080/2, "background_space")
        this.players = [new Player(this, 200, 500, "P1", new Health(5, 5), true, this.system), new Player(this, 1720, 500, "P2", new Health(5, 5), false, this.system)];

        // CREATE HEALTHBARS FOR EACH PLAYER, 10 HP, 10 SHIELD
        const healthbars = new Healthbar(this, this.players, this.system);

        this.turn = new Turn(this, this.players);

        /*
           ----------------------------------------------------------
                           SHOOT BUTTONS - can delete
           ----------------------------------------------------------

        const shootLaserP1 = this.add.text(200, 800, "laser ->",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(true);
        shootLaserP1.setInteractive();
        shootLaserP1.on('pointerdown', function (){
            shootLaserP1.setColor("#000000");
        },this)

        shootLaserP1.on('pointerup', function (){
            shootLaserP1.setColor("#ffffff");
            this.players[0].shootLaser(this.players[1]);
        },this)

        const shootProjectileP1 = this.add.text(400, 800, "projectile ->",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(true);
        shootProjectileP1.setInteractive();
        shootProjectileP1.on('pointerdown', function (){
            shootProjectileP1.setColor("#000000");
        },this)

        shootProjectileP1.on('pointerup', function (){
            shootProjectileP1.setColor("#ffffff");
            this.players[0].shootProjectile(this.players[1]);
        },this)

        const shootLaserP2 = this.add.text(1700, 800, "<- laser",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(true);
        shootLaserP2.setInteractive();
        shootLaserP2.on('pointerdown', function (){
            shootLaserP2.setColor("#000000");
        },this)

        shootLaserP2.on('pointerup', function (){
            shootLaserP2.setColor("#ffffff");
            this.players[1].shootLaser(this.players[0]);
        },this)

        const shootProjectileP2 = this.add.text(1350, 800, "<- projectile",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(true);
        shootProjectileP2.setInteractive();
        shootProjectileP2.on('pointerdown', function (){
            shootProjectileP2.setColor("#000000");
        },this)

        shootProjectileP2.on('pointerup', function (){
            shootProjectileP2.setColor("#ffffff");
            this.players[1].shootProjectile(this.players[0]);
        },this)

            ----------------------------------------------------------
                            SHOOT BUTTONS - can delete
            ----------------------------------------------------------
         */

        const openShop1 = this.add.text(910, 600, "shop",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(false);

        const openShop2 = this.add.text(910, 600, "shop",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(false);

        this.scene.get('ShopSceneP1').events.on("skip", function () {
            this.scene.sleep("ShopSceneP1");
            openShop1.setVisible(true);
            openShop1.setInteractive()
        },this);


        this.scene.get('ShopSceneP2').events.on("skip", function () {
            this.scene.sleep("ShopSceneP2");
            openShop2.setVisible(true);
            openShop2.setInteractive()
        },this);

        openShop1.on('pointerup', function (){
                this.scene.launch('ShopSceneP1');

            openShop1.setVisible(false);
            openShop1.removeInteractive();
        },this)

        openShop2.on('pointerup', function (){

            this.scene.launch('ShopSceneP2');


            openShop2.setVisible(false);
            openShop2.removeInteractive();
        },this)
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.buttonEndTurn.updateStep();
            // console.log("Update");

            this.buttonOption.updateStep()

        }
    }

    getPlayer1(): Player{
        return this.players[0];
    }

    getPlayer2(): Player{
        return this.players[1];
    }

}
