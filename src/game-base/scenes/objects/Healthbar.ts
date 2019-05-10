import {Player} from "../../mechanics/player";

export class Healthbar {
    private refScene: Phaser.Scene;
    private readonly players: [Player, Player];
    private idx : number;
    private player: Player;


    // DISPLAY HEALTHBAR ON MAIN SCENE
    constructor(refScene: Phaser.Scene, player : Player, hp : number, shield : number){
        this.refScene = refScene;
        this.player = player;

        this.idx = this.player.isFirstPlayer() ? 182 : refScene.cameras.main.width - 182;
        for (var i = 0; i < hp; i++) {

            if (this.player.isFirstPlayer())
                refScene.add.image(this.idx+=18, 100, "healthbar");
            else
                refScene.add.image(this.idx-=18, 100, "healthbar");
        }

        this.idx = this.player.isFirstPlayer() ? 182 + (hp * 18) : (refScene.cameras.main.width - 182) - (shield * 18);
        for (var i = 0; i < shield; i++) {

            if (this.player.isFirstPlayer())
                refScene.add.image(this.idx+=18, 100, "shieldbar");
            else
                refScene.add.image(this.idx-=18, 100, "shieldbar");
        }

    }

    // DO DAMAGE TO PLAYER
    private doDamage(amount : number):boolean{
        // do damage to player
        return true;
    }

    // REFRESH HEALTHBAR
    private  refreshHealthabr(player : Player):boolean
    {
        return true;
    }


}