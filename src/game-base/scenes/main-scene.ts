import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";


export class MainScene extends Phaser.Scene {

    /** How much game time has elapsed since the last rendering of a tick */
    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private players: [Player, Player];
    private turn: Turn;
    private buttonEndTurn: Button;
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
        this.players = [new Player("P1"), new Player("P2")];
        this.turn = new Turn(this, this.players);
        this.buttonEndTurn = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
                this.turn.nextPlayer()
                ;});
        this.buttonEndTurn.setPosition(1920/2, 500);
        const openShop = this.add.text(910, 600, "shop",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(false);

        this.scene.get('ShopScene').events.on("skip", function () {
            this.scene.sleep("ShopScene");
            openShop.setVisible(true);
            openShop.setInteractive()
        },this);

        openShop.on('pointerup', function (){
            this.scene.launch('ShopScene');
            openShop.setVisible(false);
            openShop.removeInteractive();
        },this)
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.buttonEndTurn.updateStep();
            // console.log("Update")
        }
    }

}
