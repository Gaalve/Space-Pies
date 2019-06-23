export class roundTimeBar extends Phaser.GameObjects.Sprite{

    private timer_length;

    public constructor(scene : Phaser.Scene){
        super(scene, 0, 0, "battletime");
        this.x = 1920/2;
        this.y = 155;
        this.setVisible(false)
        this.scene.add.existing(this);
        this.timer_length=3000;
        this.active=false;
    }

    public setTime() : void{
        this.active=true;
        this.visible=true;
        this.displayWidth = this.width;
    }



    update(time, delta): void {

        let duration;
        //if(duration)
    }

}
