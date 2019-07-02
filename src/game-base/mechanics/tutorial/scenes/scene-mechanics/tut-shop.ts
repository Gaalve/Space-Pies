import {TutShopRowLow} from "./tut-shop-row-low";
import {TutShopRowHigh} from "./tut-shop-row-high";
import Scene = Phaser.Scene;
import {ButtonWithTextCD} from "./button-with-text-cd";


export abstract class TutShop {

    private rowLow: TutShopRowLow;
    private rowHigh: TutShopRowHigh[];

    protected constructor(scene: Scene, buttonsLow: ButtonWithTextCD[], rowHigh: TutShopRowHigh[]) {
        this.rowLow = new TutShopRowLow(scene, buttonsLow);
        this.rowHigh = rowHigh;
        this.setVisible(false);
    }

    public setVisible(value: boolean): void{
        if (!value) this.rowHigh.forEach(r=>r.setVisible(value));
        this.rowLow.setVisible(value);
    }

    public update(delta: number){
        this.rowLow.update(delta);
        this.rowHigh.forEach(r=>r.update(delta));
    }

}