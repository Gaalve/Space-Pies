
import {PiSystem} from "../mechanics/picalc/pi-system";
import {MainScene} from "./main-scene";
import {Animation} from "../mechanics/animation/Animation";

export class ScenePiAnimation extends Phaser.Scene{

    private firstChoose: boolean;
    private system: PiSystem;
    private animationRunning: boolean;
    private animations: Array<Animation>;

    constructor(){
        super({
            key: 'AnimationScene',
            active: false
        });
        this.firstChoose = true;
        this.animations = new Array<Animation>();
    }

    preload(): void{
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void{
        this.system = this.scene.get('MainScene').data.get("system");
        console.log("ScenePiAnimation ACTIVE!");
        this.animationRunning = false;
    }

    update(time: number, delta: number): void {
        if (this.animations.length > 0)
        {
            for (let i = 0; i < this.animations.length; i++)
            {
               let animation = <Animation> this.animations[i];
                let deltaX = animation.toX - animation.text.x;
                let deltaY = animation.toY - animation.text.y;
                let deltaRatio = deltaY/deltaX;
                animation.text.x = animation.text.x >= animation.toX ? animation.text.x : animation.text.x + 10 ;
                animation.text.y = animation.text.y >= animation.toY ? animation.text.y : animation.text.y + (10 * deltaRatio) ;
                if (animation.text.x >= animation.toX && animation.text.y >= animation.toY)
                {
                    this.removeAnimation(animation);
                }
            }
        }

    }

    setAnimationRunning(boolean : boolean)
    {
        this.animationRunning = boolean;
    }

    public addAnimation(animation: Animation)
    {
        this.animations.push(animation);
    }

    public removeAnimation(animation: Animation)
    {
        for (let i = 0; i < this.animations.length; i++)
            if (this.animations[i] == animation)
                this.animations.splice(i, 1);

    }
}