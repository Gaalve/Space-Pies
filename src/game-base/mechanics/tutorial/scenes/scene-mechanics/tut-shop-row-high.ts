import {TutShopRowLow} from "./tut-shop-row-low";
import {ButtonWithTextCD} from "./button-with-text-cd";


export class TutShopRowHigh extends TutShopRowLow{

    constructor(scene: Phaser.Scene, buttons: ButtonWithTextCD[]) {
        super(scene, buttons);
        this.buttons.push(
            new ButtonWithTextCD(scene, "button_cancel_black", "Cancel", ()=>this.setVisible(false),0, 0)
        );
        this.yButPos = 1080 - 300;
        this.bg.setScale(0.75);
        this.bg.setPosition(1920/2, 1080-200);
        this.setPositions();
    }
}