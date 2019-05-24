
import {PiSystem} from "../mechanics/picalc/pi-system";
import {MainScene} from "./main-scene";
import {Animation} from "../mechanics/animation/Animation";
import Sprite = Phaser.GameObjects.Sprite;
import Color = Phaser.Display.Color;

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
                let deltaX = Math.abs(animation.toX - animation.fromX);
                let deltaY = Math.abs(animation.toY - animation.fromY);

                animation.currentTime += delta;
                let halfDuration = animation.duration;
                this.moveSin(animation.fromX, animation.toX, animation.fromY, animation.toY, animation.currentTime/animation.duration, animation.text);

                let fontScale = !animation.locked ? 50 : 30;
                this.scaleSin(20, 50,animation.currentTime/halfDuration, animation.text);

                let color = !animation.locked ? "#990000" : "#006c9b";
                this.colorSin(animation.text.style.color, color , animation.currentTime/animation.duration, animation.text);


                let text = animation.text;
                let player = animation.player;
                if (animation.currentTime >= animation.duration)
                {
                    if(!animation.locked)
                    {
                        let fromX = text.x;
                        let fromY = text.y;
                        let toXY = this.lockCounterpartXY(animation);
                        let toX = toXY != null ? toXY.x : 1920/7;
                        let toY = toXY != null ? toXY.y : 1080/7;
                        let newAnim = new Animation(animation.id.toString(), this, fromX, fromY, toX, toY, text, 500);
                        newAnim.locked = true;
                        this.addAnimation(newAnim);
                    }
                    this.removeAnimation(animation);
                }


            }
        }

    }

    private lockCounterpartXY(animation: Animation) {
        for (let i = 0; i < this.animations.length; i++)
        {
            let anim = this.animations[i];
            let x, y;
            if (anim == animation) continue;
            if (anim.id != animation.id && !anim.locked)
            {
                anim.locked = true;
                x =  anim.text.x - animation.text.width;
                y =  anim.text.y - animation.text.height;
                return {x, y};
            }
        }
        return null;
    }

    setAnimationRunning(boolean : boolean)
    {
        this.animationRunning = boolean;
    }

    public addAnimation(animation: Animation)
    {
        for (let i = 0 ; i < this.animations.length; i++)
        {
            if (animation.toY >= this.animations[i].toY - this.animations[i].text.height && animation.toY <= this.animations[i].toY + this.animations[i].text.height)
            {
                animation.toY += animation.text.height;
            }
        }
        this.animations.push(animation);
    }

    public removeAnimation(animation: Animation)
    {
        for (let i = 0; i < this.animations.length; i++)
            if (this.animations[i] == animation)
                this.animations.splice(i, 1);

    }

    private moveCos(fromX: number, toX: number, fromY: number, toY: number, delta:number, text: Phaser.GameObjects.Text){
        text.x = toX - Math.cos(delta*Math.PI/2 )*(toX - fromX);
        text.y = toY - Math.cos(delta*Math.PI/2 )*(toY - fromY);
    }

    private moveSin(fromX: number, toX: number, fromY: number, toY: number, delta:number, text: Phaser.GameObjects.Text){
        text.x = fromX + Math.sin(delta*Math.PI/2 )*(toX - fromX);
        text.y = fromY + Math.sin(delta*Math.PI/2 )*(toY - fromY);
    }

    private scaleCos(from: number, to: number, delta:number, text: Phaser.GameObjects.Text){
        let stringFontSize = text.style.fontSize.replace("px","");
        let fontSize = parseInt(stringFontSize);
        fontSize = from + Math.cos(delta*Math.PI/2 )*(to - from);
        text.style.setFontSize(new String(fontSize).replace("","") + "px");
    }

    private scaleSin(from: number, to: number, delta:number, text: Phaser.GameObjects.Text){
        let stringFontSize = text.style.fontSize.replace("px","");
        let fontSize = parseInt(stringFontSize);
        fontSize = from + Math.sin(delta*Math.PI/2 )*(to - from);
        text.style.setFontSize(new String(fontSize).replace("","") + "px");
    }

    private colorSin(from: string, to: string, delta:number, text: Phaser.GameObjects.Text){
        let fromRGB = this.getRGB(from);
        let toRGB = this.getRGB(to);
        let newColor = this.interpolate(fromRGB, toRGB, delta);
        text.style.setColor(newColor);
        text.style.setStroke(newColor, 1);
    }

    private getHex(color: Phaser.Display.Color) {
        return "#" + color.red.toString(16) + color.green.toString(16) + color.blue.toString(16);
    }

    private getRGB(color: String) {
        return Phaser.Display.Color.HexStringToColor(color.toString());
    }

    private interpolate(fromRGB: Phaser.Display.Color, toRGB: Phaser.Display.Color, delta: number) {
        let fromR = fromRGB.red;
        let toR = toRGB.red;
        let fromG = fromRGB.green;
        let toG = toRGB.green;
        let fromB = fromRGB.blue;
        let toB = toRGB.blue;


        let newR = Phaser.Display.Color.ComponentToHex(fromR + Math.sin(delta*Math.PI/2 )*(toR - fromR));
        let newG = Phaser.Display.Color.ComponentToHex(fromG + Math.sin(delta*Math.PI/2 )*(toG - fromG));
        let newB = Phaser.Display.Color.ComponentToHex(fromB + Math.sin(delta*Math.PI/2 )*(toB - fromB));

        newR = newR.indexOf(".") >= 0 ? newR.substr(0, newR.indexOf(".")) : newR;
        newG = newG.indexOf(".") >= 0 ? newG.substr(0, newG.indexOf(".")) : newG;
        newB = newB.indexOf(".") >= 0 ? newB.substr(0, newB.indexOf(".")) : newB;

        newR = newR.length < 2 ? "0" + newR : newR;
        newG = newG.length < 2 ? "0" + newG : newG;
        newB = newB.length < 2 ? "0" + newB : newB;

        return "#" + newR + newG + newB;
    }
}