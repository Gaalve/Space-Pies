
import {PiSystem} from "../mechanics/picalc/pi-system";
import {MainScene} from "./main-scene";
import {Animation} from "../mechanics/animation/Animation";
import Sprite = Phaser.GameObjects.Sprite;
import Color = Phaser.Display.Color;




export class ScenePiAnimation extends Phaser.Scene{

    private firstChoose: boolean;
    private system: PiSystem;
    private animationRunning: boolean;
    private queuedAnimations: Array<Animation>;
    private finishedAnimations: Array<Animation>;
    private
    private finalAnimations: Array<Animation>;
    private parallelAnimations: Array<Array<Animation>>;

    constructor(){
        super({
            key: 'AnimationScene',
            active: false
        });
        this.firstChoose = true;
        this.queuedAnimations = new Array<Animation>();
        this.finishedAnimations = new Array<Animation>();
        this.finalAnimations = new Array<Animation>();
        this.parallelAnimations = new Array<Array<Animation>>();
        this.parallelAnimations[0] = new Array<Animation>();
        this.parallelAnimations[1] = new Array<Animation>();
        this.parallelAnimations[2] = new Array<Animation>();
        this.parallelAnimations[3] = new Array<Animation>();
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
        if (this.queuedAnimations.length > 0)
        {
            for (let i = 0; i < 1; i++)
            {

                let animation = <Animation> this.queuedAnimations[i];
                animation.currentTime += delta;

                let halfDuration = animation.duration;
                if (animation.move)
                {
                    this.moveSin(animation.fromX, animation.toX, animation.fromY, animation.toY, animation.currentTime / animation.duration, animation.text);
                }

                if (animation.scaleFont)
                {
                    let fontScale = !animation.locked ? 50 : 30;
                    this.scaleSin(20, 50, animation.currentTime / halfDuration, animation.text);
                }
                if (animation.interpolate)
                {
                    let color = !animation.locked ? animation.toColor : "#006c9b";
                    this.colorSin(animation.text.style.color, color , animation.currentTime/animation.duration, animation.text);
                }
                if (animation.vanish)
                {
                    let fontScale = !animation.locked ? 50 : 30;
                    this.scaleSin(parseInt(animation.text.style.fontSize, 10), 0, animation.currentTime / halfDuration, animation.text);
                }


                let text = animation.text;
                if (animation.currentTime >= animation.duration)
                {
                    animation.finished = true;
                    let finishedAnimation = this.queuedAnimations.shift();
                    this.finishedAnimations.push(finishedAnimation);
                }
            }
        }
        if (this.finishedAnimations.length > 0)
        {
            for (let i = 0; i < this.finishedAnimations.length; i++)
            {
                let anim = this.finishedAnimations[i];

                if (anim.locked)
                    continue;

                if (anim.stage == 0)
                {
                    let resolveLocks = this.getResolvingLocksAnimation(anim);
                    if (resolveLocks != null)
                    {
                        this.addConcurrentAnimation(resolveLocks.animationOutput);
                        this.addConcurrentAnimation(resolveLocks.animationInput);
                        this.finishedAnimations.splice(i,1);
                    }
                }

                if (anim.stage == 1)
                {
                    let resolvingAnimations = this.getResolvingAnimation(anim);
                    if (resolvingAnimations != null)
                    {
                        this.addConcurrentAnimation(resolvingAnimations.animationNew);
                        this.addConcurrentAnimation(resolvingAnimations.animationNewCounterPart);
                        this.finishedAnimations.splice(i,1);
                    }
                }
                else if (anim.stage == 2)
                {
                    let finalAnimations = this.getFinalAnimation(anim);
                    if (finalAnimations != null)
                    {
                        this.addConcurrentAnimation(finalAnimations.animationNew);
                        this.addConcurrentAnimation(finalAnimations.animationNewCounterpart);
                        this.finishedAnimations.splice(i,1);
                    }
                }
            }
        }

        if (this.parallelAnimations.length > 0)
        {
            for (let i = 0; i < this.parallelAnimations.length; i++)
            {
                let sameStageAnimations = this.parallelAnimations[i];
                for (let j = 0; j < sameStageAnimations.length; j++)
                {
                    let animation = sameStageAnimations[j];
                    animation.currentTime += delta;

                    this.animate(animation);

                    if (animation.currentTime >= animation.duration)
                    {
                        animation.finished = true;
                        let finishedAnimation = sameStageAnimations.splice(j, 1);
                        this.finishedAnimations.push(finishedAnimation[0]);
                    }
                }
            }
        }
    }

    private animate(animation: Animation) {
        let halfDuration = animation.duration;
        if (animation.move)
        {
            this.moveSin(animation.fromX, animation.toX, animation.fromY, animation.toY, animation.currentTime / animation.duration, animation.text);
        }

        if (animation.scaleFont)
        {
            let fontScale = !animation.locked ? 50 : 30;
            this.scaleSin(20, 50, animation.currentTime / halfDuration, animation.text);
        }

        if (animation.interpolate)
        {
            let color = !animation.locked ? animation.toColor : "#006c9b";
            this.colorSin(animation.text.style.color, color , animation.currentTime/animation.duration, animation.text);
        }

        if (animation.vanish)
        {
            this.scaleSin(parseInt(animation.text.style.fontSize, 10), 1, animation.currentTime / halfDuration, animation.text);
        }
    }



    setAnimationRunning(boolean : boolean)
    {
        this.animationRunning = boolean;
    }

    public addAnimation(animation: Animation)
    {
        for (let i = 0 ; i < this.queuedAnimations.length; i++)
        {
            // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
            let anim = this.queuedAnimations[i];
            if (anim.id == animation.id)
            {
                if (animation.toX >= this.queuedAnimations[i].toX - this.queuedAnimations[i].text.height && animation.toX <= this.queuedAnimations[i].toX + this.queuedAnimations[i].text.height) {
                    animation.toX += animation.text.width;
                }
            }
        }
        this.queuedAnimations.push(animation);
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

    public getTotalAnimationTime()
    {
        let totalTime = 0;
        for (let i = 0; i < this.queuedAnimations.length; i++)
            totalTime += this.queuedAnimations[i].duration * 3;
        return totalTime;
    }


    public addConcurrentAnimation(animation: Animation)
    {
        for (let i = 0 ; i < this.queuedAnimations.length; i++)
        {
            // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
            let anim = this.queuedAnimations[i];
            if (anim.id == animation.id)
            {
                if (animation.toX >= anim.toX - anim.text.height && animation.toX <= anim.toX + anim.text.height) {
                    animation.toX += animation.text.width;
                }
            }
        }
        for (let i = 0 ; i < this.parallelAnimations.length; i++)
        {
            let sameStageAnimations = this.parallelAnimations[i];
            for (let j = 0; j < sameStageAnimations.length; j++)
            {
                let anim = sameStageAnimations[j];
                if (anim.id == animation.id)
                {
                    // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
                    if (animation.toX >= anim.toX - anim.text.height && animation.toX <= anim.toX + anim.text.height) {
                        animation.toX += animation.text.width;
                    }
                }
            }


        }

        let stage = -1;
        if (animation.stage == 0)
            stage = 0;
        if (animation.stage == 1)
            stage = 1;
        if (animation.stage == 2)
            stage = 2;
        if (animation.stage == 3)
            stage = 3;
        this.parallelAnimations[stage].push(animation);
    }

    private getResolvingAnimation(animation: Animation) {

        if (isInput(animation.text))
            return;;

        for (let i = 0; i < this.finishedAnimations.length; i++)
        {
            let anim = this.finishedAnimations[i];
            let toX, toY;
            let toXCounterPart, toYCounterPart;
            if (anim == animation) continue;

            if (anim.id != animation.id && !anim.locked)
            {
                // todo: check for implementation
            }
        }
        return null;
    }

    private getFinalAnimation(anim: Animation)
    {
        if (isInput(anim.text))
            return;

        for (let i = 0; i < this.finishedAnimations.length; i++)
        {
            let animation = this.finishedAnimations[i];

            if (anim.id.indexOf("resolving") >= 0 && anim.id == animation.id && !animation.locked)
            {
                anim.locked = true;
                animation.locked = true;

                let animationNew = new Animation("final" + anim.id, this, null, null, null, null, anim.text, 500);
                let animationNewCounterpart = new Animation("final" + animation.id, this, null, null, null, null, animation.text, 500);

                animationNew.stage = 3;
                animationNew.vanish = true;
                animationNewCounterpart.stage = 3;
                animationNewCounterpart.vanish = true;

                return {animationNew, animationNewCounterpart};
            }
        }
        return null;
    }

    private getResolvingLocksAnimation(animation: Animation) {

        if (isInput(animation.text))
            return;

        for (let i = 0; i < this.finishedAnimations.length; i++)
        {
            let anim = this.finishedAnimations[i];
            if (anim.locked || anim == animation)
                continue;

            if (anim.id == "(lock)")
            {
                anim.locked = true;
                animation.locked = true;

                let firstSymbol = popSymbol(anim, this);
                let outputAnimationText = this.add.text(animation.text.x + 30, animation.text.y + animation.text.height, "lock<*>", anim.text.style);

                let toX =  (1920/2) - outputAnimationText.width - 20;
                let toY =  (1080/2);
                let toXCounterPart =  (1920/2);
                let toYCounterPart = (1080/2);

                let animationOutput = new Animation("resolving (lock)", this, animation.text.x, animation.text.y, toX, toY, outputAnimationText, 500);
                let animationInput = new Animation("resolving (lock)", this, anim.text.x, anim.text.y, toXCounterPart, toYCounterPart, firstSymbol, 500);

                animationOutput.stage = 0;
                animationOutput.move = true;
                animationOutput.interpolate = true;
                animationOutput.toColor = '#ff6600'
                animationInput.stage = 0;
                animationInput.move = true;
                animationInput.interpolate = true;
                animationInput.toColor = '#ff6600'

                this.finishedAnimations.splice(i,1);
                return {animationOutput, animationInput};
            }
            if (anim.id == "resolving (lock)")
            {
                let animationInput = new Animation("resolved (lock)", this, null, null, null, null, anim.text, 500);
                let animationOutput = new Animation("resolved (lock)", this, null, null, null, null, animation.text, 500);
                animationInput.vanish = true;
                animationInput.stage = 0;
                animationOutput.vanish = true;
                animationOutput.stage = 0;

                this.finishedAnimations.splice(i,1);
                return {animationOutput, animationInput};
            }
            if (anim.id == "resolved (lock)")
            {
                anim.text.destroy();
                animation.text.destroy();

                this.finishedAnimations.splice(i,1);
                return null;
            }
        }
    }
}

function isInput(text: Phaser.GameObjects.Text) {
    let textObject = text;
    if (textObject.text.toString().indexOf("(*)") >= 0)
        return true;
    return false;
}

function popSymbol(anim: Animation, scene: Phaser.Scene) {

    let text = anim.text;
    let term = anim.text.text;
    let firstSymbol = term.indexOf("!(") >= 0 ? term.substr(2, term.length - 1) : term.split(".")[0];
    let textObject = scene.add.text(anim.text.x, anim.text.y, firstSymbol, {
        fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2});
    text.text = term.substr(firstSymbol.length + 1, term.length);
    return textObject;

}