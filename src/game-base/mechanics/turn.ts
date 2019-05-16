import {Player} from "./player";
import {ShopSceneP1} from "../scenes/shop-sceneP1";
import {PiSystem} from "./picalc/pi-system";
import {chooseSceneP1} from "../scenes/choose-sceneP1";

export class Turn {
    private refScene: Phaser.Scene;
    private readonly players: [Player, Player];
    private idx : number;
    private currentPlayer: Player;
    private awaitInput: boolean;
    private currentRound: number;
    public clickable: boolean;

    constructor(refScene: Phaser.Scene, players: [Player, Player]){
        this.refScene = refScene;
        this.players = players;
        this.idx = 0;
        this.currentPlayer = this.players[this.idx];
        this.clickable = false;
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
    }
 /*   create(): void{
        let system = new PiSystem(this, 1,1, 1, false);
        system.start()
        let startShop = system.add.replication(system.add.channelOut('shopp1', '*').nullProcess())

    } */

 /*   private Attackturn():void{
        this.refScene.data.set('turnAction', 'Attackturn');
        this.refScene.time.delayedCall(2000, () => (this.playerInput()), [], this);
    } /*

 /*   private cycle2():void{
        this.refScene.data.set('turnAction', 'Cycle2');
        this.refScene.time.delayedCall(1000, () => (this.playerInput()), [], this);
    } */

    private playerInput():void{
       // let system = new PiSystem(this.refScene, 1,1, 1, false);
       // let startShop = system.add.replication(system.add.channelOut('shopp1', '*').nullProcess())
        this.clickable = true;
        this.refScene.data.set('round', ""+(++this.currentRound));
        if(this.currentRound != 1){
            this.idx = 1 - this.idx;
            this.currentPlayer = this.players[this.idx];
            this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());

        }

        if(this.currentPlayer.getNameIdentifier() == "P1"){
            this.refScene.scene.launch('ShopSceneP1');
          // system.pushSymbol(startShop)
          //  system.pushSymbol(system.add.channelOut('shopp1', '*').nullProcess())

        }
        else {
            this.refScene.scene.launch('ShopSceneP2');
        }
        this.awaitInput = true; //nächster Spieler

        this.refScene.data.set('turnAction', 'Shopping Phase');

    }

    public Attackturn():void{
        if (!this.awaitInput) return;
        this.clickable = false;
        this.refScene.scene.sleep('ShopSceneP1');
        this.refScene.scene.sleep('ShopSceneP2');
        this.refScene.scene.sleep('chooseSceneP1');
        this.refScene.scene.sleep('chooseSceneP2');
        this.refScene.scene.sleep('chooseTypeSceneP1');
        this.refScene.scene.sleep('chooseTypeSceneP2');

        //Waffen schießen lassen:

        this.refScene.data.set('turnAction', 'Battle Phase');
        this.refScene.time.delayedCall(1000, () => (this.playerInput()), [], this); //hier dauer der attackturn bestimmen

    }

  /*  public nextPlayer():void{
        if (!this.awaitInput) return;
        this.refScene.scene.sleep('ShopSceneP1');
        this.refScene.scene.sleep('ShopSceneP2');
        this.refScene.scene.sleep('chooseSceneP1');
        this.refScene.scene.sleep('chooseSceneP2');

        this.awaitInput = false;
        this.idx = 1 - this.idx;
        this.currentPlayer = this.players[this.idx];
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('turnAction', 'Nextplayer');
        this.refScene.data.set('round', ""+(++this.currentRound));
        this.refScene.time.delayedCall(500, () => (this.Attackturn()), [], this);
    } */
}