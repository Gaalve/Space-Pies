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
        this.add.image(1920/2, 1080/2, "background_space");
        this.players = [new Player(this, 200, 500,"P1", 20, true), new Player(this, 1720, 500,"P2", 20, false)];
        this.turn = new Turn(this, this.players);
        this.buttonEndTurn = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
                openShop1.setVisible(false).removeInteractive();
                openShop2.setVisible(false).removeInteractive();
                this.turn.nextPlayer()
                ;});
        this.buttonEndTurn.setPosition(1920/2, 500);
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

        this.buttonOption = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_options",
            ()=>{
            this.scene.pause();
            this.scene.launch('PauseScene');
            this.scene.setVisible(true,"PauseScene");

            }
        );
        this.buttonOption.setPosition(1750, 100);



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
