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
    private gameMode: string;


    constructor(refScene: Phaser.Scene, players: [Player, Player], gM: string){
        this.refScene = refScene;
        this.players = players;
        this.idx = 0;
        this.currentPlayer = this.players[this.idx];
        this.clickable = false;
        this.first1 = true;
        this.first2 = true;
        this.awaitInput = false;
        this.currentRound = 0;
        this.gameMode = gM;
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        this.refScene.data.set('round', ""+(this.currentRound));
        this.refScene.data.set('turnAction', 'Create');
        this.refScene.time.delayedCall(0, () => (this.playerInput()), [], this);
        this.refScene.data.set('click', this.clickable);
        this.system = this.refScene.scene.get("MainScene").data.get("system");

        //Turn for Player1

        this.system.pushSymbol(this.system.add.replication(this.system.add.channelInCB('energy1','', ()=> this.currentPlayer.CollectEnergyAnimation()).nullProcess()));

        this.createTurnInPi();
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
            //this.currentPlayer.gainEnergy(3);
            this.refScene.data.set('currentPlayer', this.currentPlayer.getNameIdentifier());
        }


        // this.system.pushSymbol(this.system.add.channelOut("shopp1", "*").nullProcess());

        this.awaitInput = true; //nächster Spieler
        // this.setShopTurn()
        //this.refScene.data.set('turnAction', 'Shopping Phase');
        }
    }

    public Attackturn():void{
        if (!this.awaitInput) return;
        this.clickable = false;
        // this.system.pushSymbol(this.system.add.channelOut("closeshop", "*").nullProcess());

        //Waffen schießen lassen:
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

    private createTurnInPi(){
        switch(this.gameMode){
            case("0"):{
                this.system.pushSymbol(
                    this.system.add.replication(
                        this.system.add.channelIn('player1', '').
                        channelOutCB('shopp1', '', () => this.setShopTurn()).
                        channelIn('shopp1end', '').
                        channelOut('anomaly1', '').
                        channelOutCB('energy1', '', () => this.setEnergyTurn()).
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut("startephase1", "").
                        channelOutCB('unlock1', '', () => this.setAttackTurn()).
                        channelIn('attackp1end', '').
                        channelOutCB('player2', '', () => {this.endAttackTurn()}).nullProcess()
                    )
                );

                //first round turn
                this.system.pushSymbol(
                    this.system.add.channelOutCB('shopp1', '', () => this.setShopTurn()).
                    channelIn('shopp1end', '').
                    channelOutCB('energy1', '', () => this.setEnergyTurn()).
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut("startephase1", "").channelOutCB('player2', '', () => this.endAttackTurn()).nullProcess()
                );

                //Turn for Player2
                this.system.pushSymbol(
                    this.system.add.replication(
                        this.system.add.channelIn('player2', '').
                        channelOutCB('shopp1', '', () => this.setShopTurn()).
                        channelIn('shopp2end', '').
                        channelOut('anomaly2', '').
                        channelOutCB('energy1', '', () => this.setEnergyTurn()).
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut("startephase2", "").
                        channelOutCB('unlock2', '', () => this.setAttackTurn()).
                        channelIn('attackp2end', '').
                        channelOutCB('player1', '', () => {this.endAttackTurn();}).nullProcess()
                    )
                );
                break
            }
            case("1"):{

                //Turn for player 1 (Human)
                this.system.pushSymbol(
                    this.system.add.replication(
                        this.system.add.channelIn('player1', '').
                        channelOutCB('shopp1', '', () => this.setShopTurn()).
                        channelIn('shopp1end', '').
                        channelOut('anomaly1', '').
                        channelOutCB('energy1', '', () => this.setEnergyTurn()).
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut("startephase1", "").
                        channelOutCB('unlock1', '', () => this.setAttackTurn()).
                        channelIn('attackp1end', '').
                        channelOutCB('botstart', '', () => {this.endAttackTurn()}).nullProcess()
                    )
                );

                //First round turn
                this.system.pushSymbol(
                    this.system.add.channelOutCB('shopp1', '', () => this.setShopTurn()).
                    channelIn('shopp1end', '').
                    channelOutCB('energy1', '', () => this.setEnergyTurn()).
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut("startephase1", "").channelOutCB('botstart', '', () => this.endAttackTurn()).nullProcess()
                );

                //Turn for Player 2 (Bot)
                this.system.pushSymbol(
                    this.system.add.replication(
                        this.system.add.channelInCB('botstart', '', () => {this.setShopTurn(); console.log("bot started"); this.players[1].start()}).
                        channelIn('botend', '').
                        channelOut('anomaly2', '').
                        channelOutCB('energy1', '', () => {this.setEnergyTurn(); console.log("e-turn bot")}).
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut("startephase2", "").
                        channelOutCB('unlock2', '', () => this.setAttackTurn()).
                        channelIn('attackp2end', '').
                        channelOutCB('player1', '', () => {this.endAttackTurn()}).nullProcess()
                    )
                );
                break
            }
            case("2"):{
                //Turn for player 1 (Bot)
                this.system.pushSymbol(
                    this.system.add.replication(
                        this.system.add.channelInCB('botstart', '', ()=>{this.setShopTurn(); this.players[0].start()}).
                        channelIn('botend', '').
                        channelOut('anomaly1', '').
                        channelOutCB('energy1', '', () => this.setEnergyTurn()).
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut("startephase1", "").
                        channelOutCB('unlock1', '', () => this.setAttackTurn()).
                        channelIn('attackp1end', '').
                        channelOutCB('player2', '', () => {this.endAttackTurn()}).nullProcess()
                    )
                );

                this.system.pushSymbol(this.system.add.channelInCB('botfirst', '', ()=>{this.setShopTurn(); this.players[0].start()}).nullProcess())
                //first Round Turn
                this.refScene.time.delayedCall(2000,()=>{this.system.pushSymbol(
                    this.system.add.channelOut('botfirst', '').
                    channelIn('botend', '').
                    channelOutCB('energy1', '', () => this.setEnergyTurn()).
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                    channelOut("startephase1", "").channelOutCB('player2', '', () => this.endAttackTurn()).nullProcess()
                );}, [], this);

                //Turn for Player2 (Human)
                this.system.pushSymbol(
                    this.system.add.replication(
                        this.system.add.channelIn('player2', '').
                        channelOutCB('shopp1', '', () => this.setShopTurn()).
                        channelIn('shopp2end', '').
                        channelOut('anomaly2', '').
                        channelOutCB('energy1', '', () => this.setEnergyTurn()).
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').channelOut('wait', '').
                        channelOut("startephase2", "").
                        channelOutCB('unlock2', '', () => this.setAttackTurn()).
                        channelIn('attackp2end', '').
                        channelOutCB('botstart', '', () => {this.endAttackTurn();}).nullProcess()
                    )
                );
            }
        }
    }
}
