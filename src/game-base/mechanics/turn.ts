import {Player} from "./player";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {Animation} from "./animation/Animation";
import {ScenePiAnimation} from "../scenes/ScenePiAnimation";

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
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('round', ""+(this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.time.delayedCall(0, () => (this.playerInput()()), [], this);
        this.refScene.data.set('click', this.clickable);
        this.system = this.refScene.scene.get("MainScene").data.get("system");

        //Turn for Player1
        this.system.pushSymbol(
            this.system.add.replication(
                this.system.add.channelIn('player1', '').
                channelOutCB('shopp1', '', () => this.setShopTurn()).
                channelIn('shopp1end', '').channelOut("startephase1", "")
                    .channelOutCB('unlock1', '', () => this.setAttackTurn()).
                channelIn('attackp1end', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').

                channelOutCB('player2', '', () => this.endAttackTurn()).nullProcess()
            )
        );

        this.system.pushSymbol(
                this.system.add.channelOutCB('shopp1', '', () => this.setShopTurn()).
                channelIn('shopp1end', '').channelOut("startephase1", "").channelOutCB('player2', '', () => this.endAttackTurn()).nullProcess()
        );

        //Turn for Player2
        this.system.pushSymbol(
            this.system.add.replication(
                this.system.add.channelIn('player2', '').
                channelOutCB('shopp1', '', () => this.setShopTurn()).
                channelIn('shopp2end', '').
                channelOut("startephase2", "").
                channelOutCB('unlock2', '', () => this.setAttackTurn()).
                channelIn('attackp2end', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOutCB('player1', '', () => this.endAttackTurn()).nullProcess()
            )
        );


    }

    public playerInput():Function{
        if (this.players[0].isDead || this.players[1].isDead) {
            this.system.stop();
        }else {
            let playerInput = function () {
                this.clickable = true;
                this.refScene.data.set('round', "" + (++this.currentRound));
                if (this.currentRound != 1) {
                    this.idx = 1 - this.idx;
                    this.currentPlayer = this.players[this.idx];
                    //this.currentPlayer.gainEnergy(3);
                    this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
                }


                // this.system.pushSymbol(this.system.add.channelOut("shopp1", "*").nullProcess());

                this.awaitInput = true; //nächster Spieler
                // this.setShopTurn()
                //this.refScene.data.set('turnAction', 'Shopping Phase');
            }
            return playerInput;
        }
    }

    public attackturn():void{
        if (!this.awaitInput) return;
        this.clickable = false;
        this.animatedAttack();
        this.attack()();
        //Waffen schießen lassen:
        //TODO: DEBUG STUFF REMOVE
        // this.currentPlayer.getSystem().pushSymbol(
        //     this.currentPlayer.getSystem().add.channelOut(
        //         'unlock'+this.currentPlayer.getNameIdentifier().charAt(1), '').nullProcess());
        // this.currentPlayer.getSystem().pushSymbol(
        //     this.currentPlayer.getSystem().add.channelIn(
        //         'attackp'+this.currentPlayer.getNameIdentifier().charAt(1) + 'end', '').nullProcess());

    }

    animatedAttack() // THE ATTACK WILL BE EXECUTED ONCE ANIMATION IS FINISHED (LOOK INSIDE ScenePiAnimation FOR FUNCTION CALL TO attack())
    {
        // todo: ANIMATION LOCKS
        let animationScene = <ScenePiAnimation> this.refScene.scene.get("AnimationScene");
        animationScene.finalCallback = this.playerInput();
        let toColor = '#faf000';
        let text = this.refScene.add.text(1920/2, 0, "!(lock<*>)", {
            fill: toColor , fontFamily: '"Roboto"', fontSize: 20
        });
        let toX = 1920/2.3;
        let toY = 1080/4.7;
        let animation = new Animation("<lock>", animationScene, text.x, text.y, toX, toY, text, 1000);
        // animation.callback = this.attack();
        animation.move = true;
        animation.interpolate = true;
        animation.scaleFont = true;
        animation.toColor = toColor;
        animationScene.addConcurrentAnimation(animation);

        // todo: ANIMATION WEAPONS
        let currentPlayer = this.getCurrentPlayer();
        let drones = currentPlayer.getDrones();
        drones.forEach( drone =>
            {
                let animationScene = <ScenePiAnimation> this.refScene.scene.get("AnimationScene");
                let onScreenText = drone.onScreenText.text.length > 0 ? drone.onScreenText : null;

                if (onScreenText)
                {
                    let toColor = currentPlayer.isFirstPlayer() ? '#990000' : '#458899';
                    let fromX = drone.onScreenText.x;
                    let fromY = drone.onScreenText.y;
                    let toX = 1920/2 - (drone.onScreenText.width);
                    let toY = 1080/1.1;
                    let animation = new Animation("(lock)", animationScene, fromX, fromY, toX, toY, onScreenText.setAngle(0), 1000);
                    // animation.callback = this.attack();
                    animation.move = true;
                    animation.interpolate = true;
                    animation.scaleFont = true;
                    animation.toColor = toColor;
                    animationScene.addConcurrentAnimation(animation);
                }
            }
        );
    }

    attack()
    {
        const turn: Turn = this
        const currentPlayer = turn.currentPlayer;
        let attack = function()
        {

            if (!turn.awaitInput) return;
            turn.clickable = false;
            turn.system.pushSymbol(turn.system.add.channelOut("closeshop", "*").nullProcess());
            turn.system.pushSymbol(turn.system.add.channelOut("startephase"+currentPlayer.getNameIdentifier().charAt(1), "").nullProcess())
            //Waffen schießen lassen:
            //TODO: DEBUG STUFF REMOVE
            currentPlayer.getSystem().pushSymbol(
                currentPlayer.getSystem().add.channelOut(
                    'unlock'+currentPlayer.getNameIdentifier().charAt(1), '').nullProcess());
            currentPlayer.getSystem().pushSymbol(
                currentPlayer.getSystem().add.channelIn(
                    'attackp'+currentPlayer.getNameIdentifier().charAt(1) + 'end', '').nullProcess());
            turn.refScene.data.set('turnAction', 'Battle Phase');
            // turn.refScene.time.delayedCall(1250, () => (turn.playerInput()), [], turn); //hier dauer der attackturn bestimmen
        }
        return attack;
    }

    public setShopTurn(){
        this.refScene.data.set('turnAction', 'Shopping Phase');
    }

    public setAttackTurn(){
        this.refScene.data.set('turnAction', 'Battle Phase');
    }

    public endAttackTurn() {
            this.playerInput()
            //this.refScene.time.delayedCall(1250, () => (this.playerInput()), [], this); //hier dauer der attackturn bestimmen
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
