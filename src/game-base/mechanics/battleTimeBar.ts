

export class BattleTimeBar extends Phaser.GameObjects.Rectangle{


    public constructor(scene : Phaser.Scene){
        super(scene, 0, 0, 200, 10, 0xffffff);
        this.x = 1920/2;
        this.y = 155;
        this.setVisible(false)
        this.scene.add.existing(this);
    }

    public setTime() : void{
        this.displayWidth -= (this.width * 0.015);
    }

    public resetTime() : void{

        this.displayWidth = this.width;
    }

}
