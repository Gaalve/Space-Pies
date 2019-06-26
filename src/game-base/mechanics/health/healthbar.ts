import {HealthbarSprites} from "./healthbar-sprites";
import {HealthType} from "./health-type";
import {Infobox} from "../Infobox";
import {PiAnimSystem} from "../pianim/pi-anim-system";
import {PiAnimSequence} from "../pianim/pi-anim-sequence";
import {PiAnimAlignment} from "../pianim/pi-anim-alignment";
import Sprite = Phaser.GameObjects.Sprite;
import {ScenePiAnimation} from "../../scenes/ScenePiAnimation";
import {Animation} from "../animation/Animation";
import {AnimationUtilities} from "../animation/AnimationUtilites";
import Text = Phaser.GameObjects.Text;
import ANIMATION_COMPLETE = Phaser.Animations.Events.ANIMATION_COMPLETE;

export class Healthbar {
    private readonly scene: Phaser.Scene;
    public bars: HealthbarSprites[];
    public activeBars: number = 0;
    private readonly direction: 1|-1;
    private readonly offset: number = 14;
    private readonly y: number;
    public position: number;
    private readonly symbol: Sprite;
    private readonly lastPiSymbolString: string;
    private readonly pid: string;
    private readonly piAnimSys: PiAnimSystem;
    private piAnimSequence: PiAnimSequence;

    public term: Text;

    public constructor(scene: Phaser.Scene, direction: 1|-1, isHitZone: boolean, y: number, lastPiSymbolString: string, pid: string, piAnimSys: PiAnimSystem){
        this.scene = scene;
        this.piAnimSys = piAnimSys;
        this.y = y;
        this.bars = [];
        this.direction = direction;
        this.position = direction == 1 ? 10 + 50 : 1920 - 10 - 50;
        this.symbol = new Sprite(scene, this.position - 30 * direction, this.y, isHitZone ? "sym_zone" : "sym_core");
        this.symbol.setOrigin(0.5,0.5);
        this.scene.add.existing(this.symbol);
        this.lastPiSymbolString = lastPiSymbolString;
        this.pid = pid.toLowerCase();
        this.piAnimSequence = this.piAnimSys.addSequence(this.position - 10 * this.direction,
            this.y + 14, this.lastPiSymbolString, this.direction == 1 ? PiAnimAlignment.LEFT : PiAnimAlignment.RIGHT);

    }

    public addBar(type: HealthType): void{
        this.bars.push(new HealthbarSprites(this.scene,type,
            this.position + this.bars.length * this.offset * this.direction,
            this.y, this.pid.toLowerCase()));
        this.activeBars++;
        this.updateTextViaNew();
    }

    public destroyBar(): void{

        // if (healthtype == HealthType.HitZoneBar)
        //     return;
        // PI ANIMATION
        let animationScene = <ScenePiAnimation> this.scene.scene.get("AnimationScene");
        // let onScreenText = this.term.text.split(".")[1].indexOf("<") > 0 ? this.term : AnimationUtilities.popSymbol(this.term, animationScene);
        let terms = this.term.text.split(".")[1].indexOf("<") >= 0 ? AnimationUtilities.popSymbols(3, this.term, animationScene) : AnimationUtilities.popSymbols(1, this.term, animationScene);
        this.term.setVisible(false);
        let totalWidth = AnimationUtilities.calculateWidth(terms);
        let currentFontSize = parseInt(terms[0].style.fontSize.substr(0,2));
        let fontDelta = Math.abs(50 - currentFontSize);
        let fontScaleFactor = 50 / currentFontSize;
        totalWidth += (fontDelta * 2.8);
        let toX = 0;
        for (let i = 0; i < terms.length; i++)
        {
            let textObject = terms[i];
            toX = i == 0 ? 1920/2 - totalWidth/2 : toX += (terms[i-1].displayWidth * fontScaleFactor);
            toX = healthtype == HealthType.HitZoneBar ? (this.direction == 1 ? (1920/2) / 2 : (1920/2) * 1.5) : toX;
            let toY = 1080/5;
            toY = this.term.y;

            let id = healthtype == HealthType.HitZoneBar ? "(hitzone)" : "(life)";
            if (textObject.text == "0")
                id = "0";
            if (textObject.text.indexOf("<") >= 0)
                id = "<hitzone>";

            let animation = Animation.create(id, animationScene, textObject.x, textObject.y, toX, toY, textObject, 1000, () =>
            {
                // let firstSymbol;
                // if (parseInt(onScreenText.style.fontSize.replace("px", "")) > 2)
                // {
                //     firstSymbol = AnimationUtilities.popSymbol(onScreenText, animationScene);
                //     let animation = new Animation(firstSymbol.text, animationScene,toX, toY, toX, toY, firstSymbol, 1);
                //     animationScene.addConcurrentAnimation(animation);
                // }

            });
            animation.move = true;
            animation.scaleFont = true;
            animation.interpolate = true;
            animation.duration = healthtype == HealthType.HitZoneBar ? 2000 : animation.duration;
            animation.toColor = this.direction == 1 ? AnimationUtilities.getPlayerColorById("P1") : AnimationUtilities.getPlayerColorById("P2");
            animationScene.addConcurrentAnimation(animation, false, false);
        }


        let sprite = this.bars.pop().sprite;
        let infobox = <Infobox> this.scene.data.get("infoboxx");
        infobox.removeTooltipInfo(sprite);
        let bleedingSprite = this.scene.add.sprite(sprite.x, sprite.y, "bleedingbar");
        bleedingSprite.setFrame(0);
        bleedingSprite.anims.animationManager.create({
            key: 'bleeding',
            frames: bleedingSprite.anims.animationManager.generateFrameNumbers('bleedingbar', { start: 0, end: 40 }),
            frameRate: 100
        });
        bleedingSprite.on('animationcomplete', bleedingSprite.destroy);
        bleedingSprite.anims.play("bleeding");
        sprite.destroy();
        this.updateTextViaResolve();
        this.activeBars--;
    }

    private updateTextViaResolve(): void{
        // console.log("Res Bars: "+this.bars.length);
        if(this.bars.length == 0){
            this.piAnimSequence.resolveAll();
            return;
        }
        let other = this.piAnimSequence.resolveAndClearSequence(this.position - 10 * this.direction,
            this.y + 14, this.bars[this.bars.length - 1].toString() + '( )',
            this.direction == 1 ? PiAnimAlignment.LEFT : PiAnimAlignment.RIGHT);
        for (let i = this.bars.length - 2; i >= 0; i--) {
            if (i >= 2 && i < this.bars.length - 3) {
                if(i == 2)
                    other.addSymbol('[...]');
            } else{
                other.addSymbol(this.bars[i].toString() + '( )');
            }
        }
        other.addSymbol(this.lastPiSymbolString);
        other.addSymbol('0');

        this.updateInfoBox();
    }

    private updateTextViaNew(): void{
        // console.log("New Bars: "+this.bars.length);
        if(this.bars.length == 0) return;
        this.piAnimSequence.clearSequence(this.position - 10 * this.direction,
            this.y + 14, this.bars[this.bars.length - 1].toString() + '( )',
            this.direction == 1 ? PiAnimAlignment.LEFT : PiAnimAlignment.RIGHT);
        for (let i = this.bars.length - 2; i >= 0; i--) {
            if (i >= 2 && i < this.bars.length - 3) {
                if(i == 2)
                    this.piAnimSequence.addSymbol('[...]');
            } else{
                this.piAnimSequence.addSymbol(this.bars[i].toString() + '( )');
            }
        }
        this.piAnimSequence.addSymbol(this.lastPiSymbolString);
        this.piAnimSequence.addSymbol('0');

        this.updateInfoBox();
    }

    private updateInfoBox(): void{
        let infobox = <Infobox> this.scene.data.get("infoboxx");
        let playerName = this.direction == 1 ? "P1" : "P2";
        let opponentName = this.direction == 1 ? "P2" : "P1";
        let activeTerm = this.toString().split(".")[0];
        let hitzoneNumber = this.y == 170 ? 1 : this.y == 220 ? 2 : this.y == 270 ? 3 : 4;

        let tooltipInfo = this.bars[this.bars.length - 1].type == HealthType.HitZoneBar ?
            "[" + playerName + "] " +
            "This is your HitZone Bar. Each element represents one HitZone. \n"
            + "     If all are destroyed, the process \"CoreExplosion\" "+ playerName + " will execute\n"
            + "     and your ship will be destroyed.\n\n"
            + "     For each lost Zone you'll receive a Malus for the Energy Regeneration\n"
            + "     of your Space Ship. (-5 for one, -14 for two, -27 for three)\n"
            + "     current term:        " + this.toString() + "\n"
            + "     currently active:    " + activeTerm  + "\n"
            + "     will be resolved by: " + Infobox.getOppositeTerm(activeTerm, playerName) + "\n\n"
            + "     (each of the HitZone emits an " + Infobox.getOppositeTerm(activeTerm, playerName) + " after the last destroyed HealthBar)"
            :
            "[" + playerName + "] HitZone " + hitzoneNumber + "\n\n"
            + "     current term:          " + this.toString() + "\n"
            + "     currently active:      " + activeTerm + "\n"
            + "     will be resolved by:   " + Infobox.getOppositeTerm(activeTerm,playerName) + "\n\n"
            + "     (these come from each of " + opponentName + "'s weapons) \n";
        for (let bar of this.bars){
            let sprite = bar.sprite;
            infobox.addTooltipInfo(sprite, tooltipInfo);
        }
        infobox.addTooltipInfo(this.symbol, tooltipInfo);
    }

    public toString(): string{
        let str: string = "";
        for (let i = this.bars.length - 1; i >= 0; i--) {
            if (i >= 2 && i < this.bars.length - 3) {
                if(i == 3)
                    str += '[...].'
            } else{
                str += this.bars[i].toString();
                str += '( ).';
            }
        }
        if(this.bars.length > 0){
            str += this.lastPiSymbolString;
            str += ".0";
        }else{
            this.symbol.destroy()
        }
        return str;
    }

    public removeBar() : void{
        let sprite = this.bars.pop().sprite;
        this.scene.time.delayedCall(500,()=>{sprite.destroy()}, [],this);
        this.activeBars--;
    }

    public setTermVisible()
    {

        if (this.bars.length > 0)
            this.term.setVisible(true);
        this.updateText();
    }

    public getBars() : number{
        return this.bars.length;
    }
}