
import {PiSystem} from "../mechanics/picalc/pi-system";
import {MainScene} from "./main-scene";
import {Animation} from "../mechanics/animation/Animation";
import Sprite = Phaser.GameObjects.Sprite;
import Color = Phaser.Display.Color;
import {AnimationUtilities} from "../mechanics/animation/AnimationUtilites";
import {Turn} from "../mechanics/turn";




export class ScenePiAnimation extends Phaser.Scene{

    private firstChoose: boolean;
    private system: PiSystem;
    private animationRunning: boolean;
    private queuedAnimations: Array<Animation>;
    private finishedAnimations: Array<Animation>;
    private _finalCallback: Function;
    private finalAnimations: Array<Animation>;
    private parallelAnimations: Array<Array<Animation>>;

    constructor(){
        super({
            key: 'AnimationScene',
            active: true
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
                    this.scaleSin(parseInt(animation.text.style.fontSize, 10), 1, animation.currentTime / halfDuration, animation.text);
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
                        this.addConcurrentAnimation(resolvingAnimations.animationInput);
                        this.addConcurrentAnimation(resolvingAnimations.animationOutput);
                        this.finishedAnimations.splice(i,1);
                    }
                }
                else if (anim.stage == 2)
                {
                    let finalAnimations = this.getFinalAnimation(anim);
                    if (finalAnimations != null)
                    {
                        this.addConcurrentAnimation(finalAnimations.animationInput);
                        this.addConcurrentAnimation(finalAnimations.animationOutput);
                        this.finishedAnimations.splice(i,1);
                    }
                }
            }
        }
        let animationsQueued = this.parallelAnimations[0].length > 0 || this.parallelAnimations[1].length > 0 || this.parallelAnimations[2].length > 0 || this.parallelAnimations[3].length > 0;
        if (animationsQueued)
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

        if (!this.animationsLeft())
            this.nextTurn();
    }

    private animationsLeft() {
        for (let i = 0; i < this.parallelAnimations.length; i++)
                if (this.parallelAnimations[i].length > 0)
                    return true;
        for (let i = 0; i < this.parallelAnimations[i].length; i++)
            if (this.finishedAnimations.length > 0)
                return true;
        return false;
    }

    private nextTurn() {
        if (typeof this._finalCallback != 'undefined')
            this.finalCallback();
        this.finalCallback = undefined;

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
            if (animation.text)
                this.scaleSin(parseInt(animation.text.style.fontSize, 10), 1, animation.currentTime / halfDuration, animation.text);
            if (parseInt(animation.text.style.fontSize.substr(0, animation.text.style.fontSize  .indexOf("px")), 10) <= 2 )
            {
                animation.text.destroy();
                animation.currentTime += 10000;
                animation.finished = true;
                animation.locked = true;
            }
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

    private getFinalAnimation(animation: Animation) {

        if (isInput(animation.text))
            return;;

        for (let i = 0; i < this.finishedAnimations.length; i++)
        {
            let anim = this.finishedAnimations[i];
            if (anim.locked || anim == animation)
                continue;

            if (animation.id.toLowerCase().substr(0,3) == anim.id.toLowerCase().substr(0,3))
            {
                anim.locked = true;
                animation.locked = true;

                let animationInput = new Animation(anim.id.toString(), this, null, null, null, null, anim.text, 500);
                let animationOutput = new Animation(animation.id.toString(), this, null, null, null, null, animation.text, 500);
                // animationInput.callback = v => {anim.text.destroy()};
                // animationOutput.callback = v => {animation.text.destroy()};
                animationInput.vanish = true;
                animationInput.stage = 2;
                animationOutput.vanish = true;
                animationOutput.stage = 2;

                this.finishedAnimations.splice(i,1);
                return {animationOutput, animationInput};
            }
        }
        return null;
    }

    private getResolvingAnimation(animation: Animation)
    {
        if (isInput(animation.text))
            return;


        for (let i = 0; i < this.finishedAnimations.length; i++)
        {
            let anim = this.finishedAnimations[i];
            if (anim.locked || anim == animation)
                continue;

            if (animation.id.toLowerCase().substr(0,3) == anim.id.toLowerCase().substr(0,3))
            {
                anim.locked = true;
                animation.locked = true;

                // let firstSymbol = AnimationUtilities.popSymbol(animation.text, this);
                // let restId = AnimationUtilities.peekSymbol(animation.text, this);
                //     let restToX = restId == "0" ? animation.text.x : 1920/2 - animation.text.width;
                // let restToY = restId == "0" ? 1200 : animation.text.y;
                // let restAnimation = new Animation(restId, this, anim.text.x, anim.text.y, restToX, restToY, anim.text, 500);
                // restAnimation.stage = 1;
                // this.addConcurrentAnimation(restAnimation);

                let toX =  (1920/2) - animation.text.width;
                let toY =  (1080/2);
                let toXCounterPart =  (1920/2);
                let toYCounterPart = (1080/2);

                let animationOutput = new Animation(animation.id.toString(), this, animation.text.x, animation.text.y, toX, toY, animation.text, 500);
                let animationInput = new Animation(anim.id.toString(), this, anim.text.x, anim.text.y, toXCounterPart, toYCounterPart, anim.text, 500);

                animationOutput.stage = 2;
                animationOutput.move = true;
                // animationOutput.scaleFont = true;
                animationInput.stage = 2;
                animationInput.move = true;
                // animationInput.scaleFont = true;

                return {animationOutput, animationInput};
            }

            if (animation.id == "0")
                animation.text.destroy();
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

                let firstSymbol = AnimationUtilities.popSymbol(anim.text, this);
                let restId = AnimationUtilities.peekSymbol(anim.text, this);
                let restAnimation = new Animation(restId, this, anim.text.x, anim.text.y, 1920/2, 1080/2, anim.text, 500);
                restAnimation.stage = 1;
                this.addConcurrentAnimation(restAnimation);
                let outputAnimationText = this.add.text(animation.text.x + 30, animation.text.y + animation.text.height, "lock<*>", anim.text.style);

                let toX =  (1920/2) - outputAnimationText.width - 20;
                let toY =  (1080/2);
                let toXCounterPart =  (1920/2);
                let toYCounterPart = (1080/2);

                let animationOutput = new Animation("resolving (lock)", this, animation.text.x, animation.text.y, toX, toY, outputAnimationText, 500);
                let animationInput = new Animation("resolving (lock)", this, anim.text.x, anim.text.y, toXCounterPart, toYCounterPart, firstSymbol, 500);

                animationOutput.callback = animation.callback;
                animationOutput.stage = 0;
                animationOutput.move = true;
                animationOutput.interpolate = true;
                animationOutput.toColor = '#ff6600'
                animationInput.callback = anim.callback;
                animationInput.stage = 0;
                animationInput.move = true;
                animationInput.interpolate = true;
                animationInput.toColor = '#ff6600'

                this.finishedAnimations.splice(i,1);
                return {animationOutput, animationInput};
            }
            if (anim.id == "resolving (lock)")
            {
                anim.locked = true;
                animation.locked = true;

                let animationInput = new Animation("resolved (lock)", this, null, null, null, null, anim.text, 500);
                let animationOutput = new Animation("resolved (lock)", this, null, null, null, null, animation.text, 500);
                animationInput.callback = anim.callback;
                animationOutput.callback = animation.callback;
                animationInput.vanish = true;
                animationInput.stage = 0;
                animationOutput.vanish = true;
                animationOutput.stage = 0;

                this.finishedAnimations.splice(i,1);
                return {animationOutput, animationInput};
            }
            if (anim.id == "resolved (lock)")
            {
                anim.locked = true;
                animation.locked = true;

                anim.text.destroy();
                if (!this.locksRemaining())
                {
                    let animationFadeOut = Animation.create("fade (lock)", this, animation.text.x, animation.text.y, animation.text.x, -50, animation.text, 300, destroy => { animation.text.destroy();});
                    animationFadeOut.move = true;
                    animationFadeOut.stage = 0;
                    this.addConcurrentAnimation(animationFadeOut);
                }
                this.finishedAnimations.splice(i,1);
                return null;
            }
        }
    }

    private locksRemaining() {
        for (let i = 0; i < this.parallelAnimations.length; i++)
            for (let j = 0; j < this.parallelAnimations[i].length; j++)
                if (this.parallelAnimations[i][j].text.text.indexOf("lock") >= 0)
                    return true;
        for (let i = 0; i < this.parallelAnimations[i].length; i++)
            if (this.finishedAnimations[i].text.text.indexOf("lock") >= 0)
                return true;
        return false;
    }

    get finalCallback(): Function {
        return this._finalCallback;
    }

    set finalCallback(value: Function) {
        this._finalCallback = value;
    }
}

function isInput(text: Phaser.GameObjects.Text) {
    let textObject = text;
    if (textObject.text.toString().indexOf("(*)") >= 0)
        return true;
    return false;
}

