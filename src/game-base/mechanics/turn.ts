import {Player} from "./player";

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
        this.refScene.data.set('round', ""+(++this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('round', ""+(this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.time.delayedCall(0, () => (this.cycle1()), [], this);
    }

    private cycle1():void{
        this.refScene.data.set('turnAction', 'Cycle1');
        this.refScene.time.delayedCall(0, () => (this.cycle2()), [], this);
    }

    private cycle2():void{
        this.refScene.data.set('turnAction', 'Cycle2');
        this.refScene.time.delayedCall(0, () => (this.playerInput()), [], this);
    }

    private playerInput():void{
        if(this.currentPlayer.getNameIdentifier() == "P1"){
            this.refScene.scene.launch('ShopSceneP1');

        }
        else {
            this.refScene.scene.launch('ShopSceneP2');
        }
        this.awaitInput = true;
        this.refScene.data.set('turnAction', 'PlayerInput');
    }

    public nextPlayer():void{
        if (!this.awaitInput) return;
        this.refScene.scene.sleep('ShopSceneP1');
        this.refScene.scene.sleep('ShopSceneP2');
        this.refScene.scene.sleep('chooseSceneP1');
        this.refScene.scene.sleep('chooseSceneP2');

        this.awaitInput = false;
        this.idx = 1 - this.idx;
        this.currentPlayer = this.players[this.idx];
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('turnAction', 'NextPlayer');
        this.refScene.data.set('round', ""+(++this.currentRound));
        this.refScene.time.delayedCall(500, () => (this.cycle1()), [], this);
    }
}