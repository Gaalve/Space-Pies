import {Player} from "../../mechanics/player";
import Image = Phaser.GameObjects.Image;

/*
    HEALTHBAR SPRITES STORED HERE
*/
export class HealthbarSprites {
    public armorSprites : Array<Image>;
    public shieldSprites : Array<Image>;

    constructor(armorSprites : Array<Image>, shieldSprites : Array<Image> ){
        this.armorSprites = armorSprites;
        this.shieldSprites = shieldSprites;
    }
}