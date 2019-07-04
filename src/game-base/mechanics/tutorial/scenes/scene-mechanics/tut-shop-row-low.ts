import {ButtonWithTextCD} from "./button-with-text-cd";
import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;


export class TutShopRowLow {
    protected buttons : ButtonWithTextCD[];
    protected bg : Sprite;
    protected yButPos: number;

    public constructor(scene: Scene, buttons: ButtonWithTextCD[]){
        this.buttons = buttons;
        this.bg = new Sprite(scene, 1920/2, 1080+50, "shop_bg_back");
        scene.add.existing(this.bg);
        this.bg.setAlpha(0.7);
        this.bg.setOrigin(0.5, 1);
        this.bg.setDepth(-1);
        this.yButPos = 1080 - 110;
        this.setPositions();
    }

    protected setPositions(): void{
        let amount = this.buttons.length;
        let offset = 150;
        let startX = 1920/2 - (amount - 1)/2 * offset;
        this.buttons.forEach((b, idx)=>b.setPosition(idx*offset+startX, this.yButPos));
    }


    public setVisible(value: boolean): void{
        this.buttons.forEach(v=>v.setVisible(value));
        this.bg.setVisible(value);
    }

    public update(delta: number): void{
        this.buttons.forEach(b=>b.update(delta));
    }
}