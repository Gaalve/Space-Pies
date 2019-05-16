import {Player} from "./player";
import {ShopSceneP1} from "../scenes/shop-sceneP1";
import {PiCalcTests} from "../tests/pi-calc-tests";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {chooseSceneP1} from "../scenes/choose-sceneP1";

export class Turn {
    private refScene: Phaser.Scene;
    private readonly players: [Player, Player];
    private idx : number;
    private currentPlayer: Player;
    private awaitInput: boolean;
    private currentRound: number;

    constructor(refScene: Phaser.Scene, players: [Player, Player]){
        this.refScene = refScene;
        this.players = players;
        this.idx = 0;
        this.currentPlayer = this.players[this.idx];
        this.awaitInput = false;
        this.currentRound = 0;
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        //this.refScene.data.set('round', ""+(++this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('round', ""+(this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.time.delayedCall(0, () => (this.playerInput()), [], this);
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
        if(this.currentPlayer.getNameIdentifier() == "P1"){
            this.refScene.scene.launch('ShopSceneP1');
          // system.pushSymbol(startShop)
          //  system.pushSymbol(system.add.channelOut('shopp1', '*').nullProcess())

        }
        else {
            this.refScene.scene.launch('ShopSceneP2');
        }
        this.awaitInput = true; //nächster Spieler
        this.idx = 1 - this.idx;
        this.currentPlayer = this.players[this.idx];
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('turnAction', 'Shopping Phase');
        this.refScene.data.set('round', ""+(++this.currentRound));

    }

    public Attackturn():void{
        if (!this.awaitInput) return;
        this.refScene.scene.sleep('ShopSceneP1');
        this.refScene.scene.sleep('ShopSceneP2');
        this.refScene.scene.sleep('chooseSceneP1');
        this.refScene.scene.sleep('chooseSceneP2');


        //Waffen schießen lassen:

        this.refScene.data.set('turnAction', 'Battle Phase');
        this.refScene.time.delayedCall(3000, () => (this.playerInput()), [], this); //hier dauer der attackturn bestimmen
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