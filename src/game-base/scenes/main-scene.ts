import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";
import {PiCalcTests} from "../tests/pi-calc-tests";

export class MainScene extends Phaser.Scene {

    /** How much game time has elapsed since the last rendering of a tick */
    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private players: [Player, Player];
    private turn: Turn;
    private buttonEndTurn: Button;

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
            ()=>{this.turn.nextPlayer();});
        this.buttonEndTurn.setPosition(1920/2, 500);
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.buttonEndTurn.updateStep();
            // console.log("Update");
        }
    }

}
