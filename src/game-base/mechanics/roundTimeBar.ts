import progress = Mocha.reporters.progress;
import Color = Phaser.Display.Color;

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
        let progress = 1 - this.timebarEvent.getProgress();
        this.displayWidth=this.width*(progress);
        if(progress < 0.15){
            let idx = progress % 0.0125;
            this.setTint(
                Color.ObjectToColor(
                    Color.Interpolate.RGBWithRGB(
                        255, 255, 255,
                        255, 55, 55,
                        0.025, idx
                    )
                ).color
            );
        }
        else if(progress > 0.955){
            let idx = progress % 0.0075;
            this.setTint(
                Color.ObjectToColor(
                    Color.Interpolate.RGBWithRGB(
                        255, 255, 255,
                        85, 255, 85,
                        0.015, idx
                    )
                ).color
            );
        }
        else this.setTint(0xffffff);
    }

}
