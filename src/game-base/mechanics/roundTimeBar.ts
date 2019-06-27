export class roundTimeBar extends Phaser.GameObjects.Sprite{


    private timebarEvent;



    public constructor(scene : Phaser.Scene){
        super(scene, 0, 0, "battletime");
        this.x = 1920/2;
        this.y = 155;
        this.setVisible(false);
        this.scene.add.existing(this);
        this.active=false;



    }

    public setTimer(event) : void{
        this.active=true;
        this.visible=true;
        this.displayWidth = this.width;
        this.timebarEvent=event;

    }

    public stopTimer():void{
        this.timebarEvent.remove();
        this.visible=false;
        this.active=false;

    }




    update(): void {
        this.displayWidth=this.width*(1-this.timebarEvent.getProgress());
    }

}
