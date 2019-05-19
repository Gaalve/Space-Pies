import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";

import {PiSystem} from "../mechanics/picalc/pi-system";

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
            key: "MainScene",
            active: false
        })
    }

    preload(): void {
        // this.load.pack(
        //     "preload",
        //     "assets/pack.json",
        //     "preload"
        // )

        this.load.spritesheet('bleedingbar', 'assets/sprites/bleedingbar.png', { frameWidth: 19, frameHeight: 42, spacing: 5, startFrame: 0, endFrame: 42, margin: 0});


    }

    create(): void {
        this.system = new PiSystem(this, 1,1,1,true);
        this.system.start();
        this.data.set("system", this.system);
        this.players = [new Player(this, 280, 540, "P1", true, this.system), new Player(this, 1650, 540, "P2", false, this.system)];
        this.turn = new Turn(this, this.players);
        this.data.set('P1', this.players[0]);
        this.data.set('P2', this.players[1]);
        this.buttonEndTurn = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
                if(this.turn.clickable){
                    openShop1.setVisible(false).removeInteractive();
                    openShop2.setVisible(false).removeInteractive();
                    this.turn.Attackturn();
                }
                });
        this.buttonEndTurn.setPosition(1920/2, 500);

        const openShop1 = this.add.text(910, 600, "shop",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(false);

        const openShop2 = this.add.text(910, 600, "shop",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(false);

        this.scene.get('ShopSceneP1').events.on("skip", function () {
            this.scene.stop("ShopSceneP1");
            openShop1.setVisible(true);
            openShop1.setInteractive()
        },this);


        this.scene.get('ShopSceneP2').events.on("skip", function () {
            this.scene.stop("ShopSceneP2");
            openShop2.setVisible(true);
            openShop2.setInteractive()
        },this);

        openShop1.on('pointerup', function (){
            this.scene.launch('ShopSceneP1');

            openShop1.setVisible(false);
            openShop1.removeInteractive();
        },this);

        openShop2.on('pointerup', function (){

            this.scene.launch('ShopSceneP2');


            openShop2.setVisible(false);
            openShop2.removeInteractive();
        },this);

        this.buttonOption = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_options",
            ()=>{
            this.scene.pause();
            this.scene.launch('PauseScene');
            this.scene.setVisible(true,"PauseScene");

            }
        );
        this.buttonOption.setPosition(1880, 40);

    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.buttonEndTurn.updateStep();
            this.buttonOption.updateStep()

        }
    }


}
