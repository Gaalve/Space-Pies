import {Button} from "../mechanics/button";

export class PauseScene extends Phaser.Scene {



    constructor() {
        super({
            key: "PauseScene"
        })
    }


    create(): void {

        this.add.image(1920/2, 1080/2, "background_space")
        const text = this.add.text(1920 / 2, 300, 'gfhfh!', {
            fill: '#3734ff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2
        });

    }




}