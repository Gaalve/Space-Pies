import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";
import {Weapon} from "../mechanics/weapon";
import {LWeapon} from "../mechanics/laserweapon";
import {PWeapon} from "../mechanics/projectileweapon";

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
        this.players = [new Player("P1"), new Player("P2")];
        this.turn = new Turn(this, this.players);
        this.buttonEndTurn = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{this.turn.nextPlayer();});
        this.buttonEndTurn.setPosition(1920/2, 500);

        const w1Left = new PWeapon(this, 320, 200, 1, "ssr_wmod", "ssr_weap_pro");
        const w2Left = new PWeapon(this, 320, 500, 1, "ssr_wmod", "ssr_weap_pro");
        const w3Left = new LWeapon(this, 320, 800, 1, "ssr_wmod", "ssr_weap_las");
        const w1Right = new PWeapon(this, 1600, 200, 2, "ssb_wmod", "ssb_weap_pro");
        const w2Right = new PWeapon(this, 1600, 500, 2, "ssb_wmod", "ssb_weap_pro");
        const w3Right = new LWeapon(this, 1600, 800, 2, "ssb_wmod", "ssb_weap_las");
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
