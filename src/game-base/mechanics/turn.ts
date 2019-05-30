import {Player} from "./player";
import {PiSystem} from "../mechanics/picalc/pi-system";

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
        this.currentPlayer.pushEnergy();
        this.refScene.data.set('turnAction', 'Battle Phase');
        this.refScene.time.delayedCall(1250, () => (this.playerInput()), [], this); //hier dauer der attackturn bestimmen

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
}
