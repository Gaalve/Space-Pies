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
        //this.refScene.data.set('round', ""+(++this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('round', ""+(this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.time.delayedCall(0, () => (this.playerInput()()), [], this);
        this.refScene.data.set('click', this.clickable);
        this.system = this.refScene.scene.get("MainScene").data.get("system");
    }

    public playerInput():Function{
        let turn : Turn = this;
       let playerInput = function() {
           turn.clickable = true;
           turn.refScene.data.set('round', "" + (++turn.currentRound));
           if (turn.currentRound != 1) {
               turn.idx = 1 - turn.idx;
               turn.currentPlayer = turn.players[turn.idx];
               //this.currentPlayer.gainEnergy(3);
               turn.refScene.data.set('currentPlayer', turn.currentPlayer.getNameIdentifier());

           }

           if (turn.currentPlayer.getNameIdentifier() == "P1") {
               turn.system.pushSymbol(turn.system.add.channelOut("shopp1", "*").nullProcess())

           } else {
               turn.system.pushSymbol(turn.system.add.channelOut("shopp1", "*").nullProcess())
           }
           turn.currentPlayer.updateAllTerms();
           turn.awaitInput = true; //nächster Spieler

           turn.refScene.data.set('turnAction', 'Shopping Phase');
       }
       return playerInput;
    }

    public Attackturn():void{
        this.animatedAttack();
        this.attack()();
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
