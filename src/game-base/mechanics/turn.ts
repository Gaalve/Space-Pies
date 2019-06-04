import {Player} from "./player";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {BlackHole} from "./anomalies/black-hole";
import {WormHole} from "./anomalies/worm-hole";
import {SunEruption} from "./anomalies/sun-eruption";

export class Turn {
    private refScene: Phaser.Scene;
    private readonly players: [Player, Player];
    private idx : number;
    private currentPlayer: Player;
    private awaitInput: boolean;
    private currentRound: number;
    public clickable: boolean;
    public first1: boolean;
    public first2: boolean;
    private system: PiSystem;

    private blackHole: BlackHole;
    private sunEruption: SunEruption;
    private wormHole: WormHole;
    private lastAppeared: number;


    constructor(refScene: Phaser.Scene, players: [Player, Player]){
        this.refScene = refScene;
        this.players = players;
        this.idx = 0;
        this.currentPlayer = this.players[this.idx];
        this.clickable = false;
        this.first1 = true;
        this.first2 = true;
        this.awaitInput = false;
        this.currentRound = 0;
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        //this.refScene.data.set('round', ""+(++this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('round', ""+(this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.time.delayedCall(0, () => (this.playerInput()), [], this);
        this.refScene.data.set('click', this.clickable);
        this.system = this.refScene.scene.get("MainScene").data.get("system");
        this.lastAppeared = 0;
    }

    public update():void {

        // raise black Hole
        if (this.blackHole){

            this.blackHole.scaleX += 0.01*this.blackHole.scaleUp;
            this.blackHole.scaleY += 0.01*this.blackHole.scaleUp;

            if (this.blackHole.scaleX < 0) {
                this.blackHole.destroy();
                this.blackHole = null;
            }
        }

        // raise worm Hole
        if (this.wormHole){

            this.wormHole.angle += 1.0;
            this.wormHole.scaleX += 0.01*this.wormHole.scaleUp;
            this.wormHole.scaleY += 0.01*this.wormHole.scaleUp;

            if (this.wormHole.scaleX < 0) {
                this.wormHole.destroy();
                this.wormHole = null;
            }
        }

        // erupt from up to bottom
        if(this.sunEruption){
            this.sunEruption.y += 20;

            if (this.sunEruption.y > 1080) {
                this.sunEruption.destroy();
                this.sunEruption = null;
            }
        }
    }


    public playerInput():void{
        this.clickable = true;
        this.refScene.data.set('round', ""+(++this.currentRound));
        if(this.currentRound != 1){
            this.idx = 1 - this.idx;
            this.currentPlayer = this.players[this.idx];
            //this.currentPlayer.gainEnergy(3);
            this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        }

        if (this.lastAppeared > 0) this.lastAppeared -= 1;

        if(this.currentPlayer.getNameIdentifier() == "P1"){
            //this.refScene.scene.run( 'ShopSceneP1');
            // system.pushSymbol(startShop)
          //  system.pushSymbol(system.add.channelOut('shopp1', '*').nullProcess())
            //this.refScene.events.emit("newTurn")
            //this.refScene.scene.get("MainScene").events.emit("newTurn");
            this.system.pushSymbol(this.system.add.channelOut("shopp1", "*").nullProcess())

        }
        else {
            this.system.pushSymbol(this.system.add.channelOut("shopp1", "*").nullProcess())
        }
        this.awaitInput = true; //nächster Spieler

        this.refScene.data.set('turnAction', 'Shopping Phase');

    }

    public Attackturn():void{
        if (!this.awaitInput) return;
        this.clickable = false;
        /*this.refScene.scene.sleep('ShopSceneP1');
        if(this.refScene.scene.get("chooseSceneP1").scene.isActive()){
            this.refScene.scene.sleep('chooseSceneP1');
        }
        if(this.refScene.scene.get("chooseTypeSceneP1").scene.isActive()) {
            this.refScene.scene.sleep('chooseTypeSceneP1');
        }

        if(this.currentRound != 1){
            this.refScene.scene.sleep('ShopSceneP2');
            if(this.refScene.scene.get("chooseSceneP2").scene.isActive()) {
                this.refScene.scene.sleep('chooseSceneP2');
            }
            if(this.refScene.scene.get("chooseTypeSceneP2").scene.isActive()) {
                this.refScene.scene.sleep('chooseTypeSceneP2');
            }
        }*/
        this.system.pushSymbol(this.system.add.channelOut("closeshop", "*").nullProcess());

        //Waffen schießen lassen:
        //TODO: DEBUG STUFF REMOVE

        let timer = 1250;

        // check if a worm hole appears
        if (Math.floor(Math.random()*500) % 10 == 0 && this.lastAppeared == 0) {
            this.wormHole = new WormHole(this.refScene, this.currentPlayer);
            this.lastAppeared = 3;
            timer = 3000;
        }

        // check if a sun eruption appears
        if (Math.floor(Math.random()*200) % 10 == 0 && this.lastAppeared == 0) {
            this.sunEruption = new SunEruption(this.refScene, this.currentPlayer);

            this.currentPlayer.getSystem().pushSymbol(
                this.currentPlayer.getSystem().add.channelIn('erupt', '').nullProcess());

            this.lastAppeared = 3;
        }

        // check if a black hole appears
        if (Math.floor(Math.random()*100) % 10 == 0 && this.lastAppeared == 0) {
            this.blackHole = new BlackHole(this.refScene, this.currentPlayer);

            this.currentPlayer.getSystem().pushSymbol(
                this.currentPlayer.getSystem().add.channelIn('absorb', '').nullProcess());

            this.lastAppeared = 3;
            timer = 3000;
        }

        this.refScene.time.delayedCall(timer,() => {

            this.currentPlayer.getSystem().pushSymbol(
                this.currentPlayer.getSystem().add.channelOut(
                    'unlock' + this.currentPlayer.getNameIdentifier().charAt(1), '').nullProcess());
            this.currentPlayer.getSystem().pushSymbol(
                this.currentPlayer.getSystem().add.channelIn(
                    'attackp' + this.currentPlayer.getNameIdentifier().charAt(1) + 'end', '').nullProcess());

            if (this.blackHole){
                this.blackHole.scaleUp = 0;
                this.refScene.time.delayedCall(2000, () => {this.blackHole.scaleUp = -1},[], this); // start  hole reduction
            }

            if (this.wormHole){
                this.wormHole.scaleUp = 0;
                this.refScene.time.delayedCall(2000, () => {
                    this.currentPlayer.getSystem().pushSymbol(
                        this.currentPlayer.getSystem().add.channelIn('worm', '').nullProcess());
                    this.wormHole.scaleUp = -1},[], this);      // start  hole reduction
            }

            this.refScene.data.set('turnAction', 'Battle Phase');
            this.refScene.time.delayedCall(timer+2000, () => (this.playerInput()), [], this);
        },[], this); //hier dauer der attackturn bestimmt


    }

    getScene(): Phaser.Scene{
        return this.refScene;
    }

    getCurrentPlayer(): Player{
        return this.currentPlayer;
    }

    getCurrentRound(): number{
        return this.currentRound;
    }

    getBlackHole(): BlackHole{
        return this.blackHole;
    }

    getSunEruption(): SunEruption{
        return this.sunEruption;
    }

    getWormHole(): WormHole{
        return this.wormHole;
    }
}
