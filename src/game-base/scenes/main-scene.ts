import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";
import {PiCalcTests} from "../tests/pi-calc-tests";
import {PiSystem} from "../mechanics/picalc/pi-system";
import DataManager = Phaser.Data.DataManager;
import EventEmitter = Phaser.Events.EventEmitter;

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
        this.system = new PiSystem(this, 1,1,1,false);
        this.system.start();
        this.add.image(1920/2, 1080/2, "background_space");
        this.players = [new Player(this, 280, 540,"P1", 20, true, this.system), new Player(this, 1650, 540,"P2", 20, false, this.system)];
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

    //for testing:
        //this.system.pushSymbol(this.system.add.channelOut("wext10l", "*").nullProcess());
        //this.players[0].getDrones()[0].addWeapon("l");
        //this.system.pushSymbol(this.system.add.channelOut("wmod1", "*").nullProcess());
        //this.system.pushSymbol(this.system.add.channelOut("wmod1", "*").nullProcess());
        //this.system.pushSymbol(this.system.add.channelOut("wext11l", "*").nullProcess());
        //this.system.pushSymbol(this.system.add.channelOut("wext11p", "*").nullProcess());

        /*this.system.pushSymbol(this.system.add.channelIn("armorP2", "*").
            process("log", () =>{
                console.log("P2 lost 1 HP");
        }));

        this.system.pushSymbol(this.system.add.channelIn("shieldP2", "*").
        process("log", () =>{
            console.log("P2 lost 2 HP");
        }));*/

        //console.log(this.players[0].getNrDrones());
        //console.log(this.players[0].getDrones()[0].getNrWeapons());
        //console.log(this.players[0].getDrones()[0].getIndex());
        //console.log(this.players[0].getDrones()[0].getWeapons()[0].getWeaponClass())
        //this.players[0].pushWeapons();
        //this.players[0].unlockWeapons();
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


}
