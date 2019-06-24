import {Player} from "./player";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {PiAnimSequence} from "./pianim/pi-anim-sequence";
import {PiAnimSystem} from "./pianim/pi-anim-system";
import {PiAnimAlignment} from "./pianim/pi-anim-alignment";

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
    private roundSeq: PiAnimSequence;


    constructor(refScene: Phaser.Scene, players: [Player, Player], piAnim: PiAnimSystem){

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
        this.refScene.time.delayedCall(0, () => (this.playerInput()), [], this);
        this.refScene.data.set('click', this.clickable);
        this.system = this.refScene.scene.get("MainScene").data.get("system");



        this.roundSeq = piAnim.addSequence(960, 110, "upgradep1<>", PiAnimAlignment.CENTER);
        this.roundSeq.addSymbol("upgradep1end()");
        this.roundSeq.addSymbol("ernergyp1()");
        this.roundSeq.addSymbol("player2<>");
        this.roundSeq.addSymbol("0");

        //Turn for Player1

        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn('Energy1','*').process('Energy1', () =>{
            this.currentPlayer.CollectEnergyAnimation();
        })));

        this.system.pushSymbol(
            this.system.add.replication(
                this.system.add.channelInCB('player1', '', () => {this.roundSeq.resolveSymbol();}).
                channelOutCB('shopp1', '', () => {this.setShopTurn(); this.roundSeq.resolveSymbol();}).
                channelInCB('shopp1end', '', () => {this.roundSeq.resolveSymbol();}).channelOut('wait', '').channelOut('wait', '').
                channelOutCB('anomaly1', '', () => {this.roundSeq.resolveSymbol();}).channelOut('wait', '').channelOut('wait', '').
                channelOutCB('energy1', '', () => {this.setEnergyTurn(); this.roundSeq.resolveSymbol();}).
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut("startephase1", "").
                channelOutCB('unlock1', '', () => {this.setAttackTurn(); this.roundSeq.resolveSymbol();}).
                channelInCB('attackp1end', '', () => {this.roundSeq.resolveSymbol();}).
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOutCB('player2', '', () => {this.endAttackTurn(); this.changeSequenceP2()}).nullProcess()
            )
        );

        this.system.pushSymbol(
                this.system.add.channelOutCB('shopp1', '', () => {this.setShopTurn(); this.roundSeq.resolveSymbol();}).
                channelInCB('shopp1end', '', () => {this.roundSeq.resolveSymbol();}).
                channelOutCB('energy1', '', () => {this.setEnergyTurn(); this.roundSeq.resolveSymbol(); }).
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut("startephase1", "").channelOutCB('player2', '',
                    () => {this.endAttackTurn(); this.changeSequenceP2();}).nullProcess()
        );

        //Turn for Player2
        this.system.pushSymbol(
            this.system.add.replication(
                this.system.add.channelInCB('player2', '', () => {this.roundSeq.resolveSymbol();}).
                channelOutCB('shopp1', '', () => {this.setShopTurn(); this.roundSeq.resolveSymbol();}).
                channelInCB('shopp2end', '', () => {this.roundSeq.resolveSymbol();}).channelOut('wait', '').channelOut('wait', '').
                channelOutCB('anomaly2', '', () => {this.roundSeq.resolveSymbol();}).channelOut('wait', '').channelOut('wait', '').
                channelOutCB('Energy1', '', () => {this.setEnergyTurn(); this.roundSeq.resolveSymbol()}).
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut("startephase2", "").
                channelOutCB('unlock2', '', () => {this.setAttackTurn(); this.roundSeq.resolveSymbol();}).
                channelInCB('attackp2end', '', () => {this.roundSeq.resolveSymbol();}).
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                channelOutCB('player1', '', () => {this.endAttackTurn(); this.changeSequenceP1()}).nullProcess()
            )
        );


    }

    public changeSequenceP2(){
        let other = this.roundSeq.resolveAllAndClearSequence(960, 110, "player2()", PiAnimAlignment.CENTER);
        other.addSymbol("upgradep2()");
        other.addSymbol("upgradep2end()");
        other.addSymbol("anomaly<>");
        other.addSymbol("ernergyp2()");
        other.addSymbol("atkp2<>");
        other.addSymbol("atkp2end()");
        other.addSymbol("player1<>");
        other.addSymbol("0");
    }

    public changeSequenceP1(){
        let other = this.roundSeq.resolveAllAndClearSequence(960, 110, "player1()", PiAnimAlignment.CENTER);
        other.addSymbol("upgradep1()");
        other.addSymbol("upgradep1end()");
        other.addSymbol("anomaly<>");
        other.addSymbol("ernergyp1()");
        other.addSymbol("atkp1<>");
        other.addSymbol("atkp1end()");
        other.addSymbol("player2<>");
        other.addSymbol("0");
    }

    public playerInput():void{
        if (this.players[0].isDead || this.players[1].isDead) {
            this.system.stop();
        }else {
        this.clickable = true;
        this.refScene.data.set('round', ""+(++this.currentRound));
        if(this.currentRound != 1){
            this.idx = 1 - this.idx;
            this.currentPlayer = this.players[this.idx];
            this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        }


        this.awaitInput = true; //nächster Spieler
        }
    }

    public Attackturn():void{
        if (!this.awaitInput) return;
        this.clickable = false;


        //TODO: DEBUG STUFF REMOVE
        // this.currentPlayer.getSystem().pushSymbol(
        //     this.currentPlayer.getSystem().add.channelOut(
        //         'unlock'+this.currentPlayer.getNameIdentifier().charAt(1), '').nullProcess());
        // this.currentPlayer.getSystem().pushSymbol(
        //     this.currentPlayer.getSystem().add.channelIn(
        //         'attackp'+this.currentPlayer.getNameIdentifier().charAt(1) + 'end', '').nullProcess());
        // this.refScene.data.set('turnAction', 'Battle Phase');
        //  this.setAttackTurn()
        // this.refScene.time.delayedCall(1250, () => (this.playerInput()), [], this); //hier dauer der attackturn bestimmen
        //  this.endAttackTurn()
        // this.system.pushSymbol(this.system.add.channelOut("startephase"+this.currentPlayer.getNameIdentifier().charAt(1), "").nullProcess())
        //
    }
    public setShopTurn(){
        this.refScene.data.set('turnAction', 'Shopping Phase');
    }

    public setAttackTurn(){
        this.refScene.data.set('turnAction', 'Battle Phase');
    }

    public setEnergyTurn(){
        this.refScene.data.set('turnAction', 'Energy Phase');
    }

    public endAttackTurn() {
            this.playerInput()
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
