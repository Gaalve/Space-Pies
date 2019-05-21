import {PiSystem} from "../picalc/pi-system";
import TimerEvent = Phaser.Time.TimerEvent;
import GameObject = Phaser.GameObjects.GameObject;
import BitmapText = Phaser.GameObjects.BitmapText;

export class AnimationManager {
    private animationScene: Phaser.Scene;
    private animation: Phaser.Time.TimerEvent;

    public constructor(animationScene: Phaser.Scene){
        this.animationScene = animationScene;
    }

    public animate(x: number, y: number, text: Phaser.GameObjects.Text)
    {

        let animate = function()
        {
            let animation = this.animation;
            console.log("animate entered")
            let deltaX = x - text.x;
            let deltaY = y - text.y;
            let deltaRatio = y/x;


            text.x = text.x += 5;
            text.y = text.y + (5 * deltaRatio);


            if (text.x >= x && text.y >= y)
            {
                console.log("animation stopped")
                animation.remove();
            }
        }
        return animate;
    }

    addAnimation(x: number, y: number, text: Phaser.GameObjects.Text) {
        this.animation = this.animationScene.time.addEvent({
            delay: 1,
            callback: this.animate(1900/2, 300, text),
            callbackScope: this,
            loop: true
        });
       console.log("animation created");
    }
}