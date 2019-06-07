import {HealthbarSprites} from "./healthbar-sprites";
import {HealthType} from "./health-type";
import {ScenePiAnimation} from "../../scenes/ScenePiAnimation";
import {Animation} from "../animation/Animation";
import {AnimationUtilities} from "../animation/AnimationUtilites";
import Sprite = Phaser.GameObjects.Sprite;
import Text = Phaser.GameObjects.Text;

export class Healthbar {
    private readonly scene: Phaser.Scene;
    private bars: HealthbarSprites[];
    private readonly direction: 1|-1;
    private readonly offset: number = 14;
    private readonly y: number;
    private readonly position: number;
    private readonly symbol: Sprite;
    private readonly lastPiSymbolString: string;
    private readonly pid: string;

    private term: Text;

    public constructor(scene: Phaser.Scene, direction: 1|-1, isHitZone: boolean, y: number, lastPiSymbolString: string, pid: string){
        this.scene = scene;
        this.y = y;
        this.bars = [];
        this.direction = direction;
        this.position = direction == 1 ? 10 + 50 : 1920 - 10 - 50;
        this.symbol = new Sprite(scene, this.position - 30 * direction, this.y, isHitZone ? "sym_zone" : "sym_core");
        this.symbol.setOrigin(0.5,0.5);
        this.scene.add.existing(this.symbol);
        this.lastPiSymbolString = lastPiSymbolString;
        this.pid = pid.toLowerCase();

        this.term = scene.add.text(this.position - 10 * this.direction, this.y, "", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 3, stroke: '#000'
        });
        this.term.setOrigin((-this.direction + 1)/2,0);
        this.term.setDepth(2);
        scene.add.existing(this.term);
    }

    public addBar(type: HealthType): void{
        this.bars.push(new HealthbarSprites(this.scene,type,
            this.position + this.bars.length * this.offset * this.direction,
            this.y, this.pid.toLowerCase()));
        this.updateText();
    }

    public destroyBar(healthtype : HealthType): void{

        // ANIMATION
        let animationScene = <ScenePiAnimation> this.scene.scene.get("AnimationScene");
        let onScreenText = this.term.text.length > 0 ? this.term : null;


        if (onScreenText)
        {
            let animationText = AnimationUtilities.popSymbol(onScreenText, animationScene);
            let toColor = AnimationUtilities.getHealthbarColor(healthtype);
            let fromX = onScreenText.x;
            let fromY = onScreenText.y;
            let toX = 1920/2 - (onScreenText.width);
            let toY = 1080/1.3;
            let id = AnimationUtilities.getTerm(healthtype) + (this.direction == 1 ? "p1" : "p2");
            let animation = new Animation(id, animationScene, fromX, fromY, toX, toY, animationText.setAngle(0), 1000);
            animation.stage = 1;
            animation.move = true;
            animation.interpolate = true;
            animation.scaleFont = true;
            animation.toColor = toColor;
            animationScene.addConcurrentAnimation(animation);
            if (onScreenText.text.split(".")[0].indexOf("<") >= 0)
            {
                let animationText = AnimationUtilities.popSymbol(onScreenText, animationScene);
                let toColor = AnimationUtilities.getHealthbarColor(HealthType.HitZoneBar);
                let fromX = onScreenText.x;
                let fromY = onScreenText.y;
                let toX = 1920/2 + (onScreenText.width);
                let toY = 1080/1.3;
                let id = AnimationUtilities.getTerm(HealthType.HitZoneBar) + (this.direction == 1 ? "p1" : "p2");
                let animation = new Animation(id, animationScene, fromX, fromY, toX, toY, animationText.setAngle(0), 1000);
                animation.stage = 1;
                animation.move = true;
                animation.interpolate = true;
                animation.scaleFont = true;
                animation.toColor = toColor;
                animationScene.addConcurrentAnimation(animation);
            }
        }

        // BLEEDING SPRITE ANIMATION
        let sprite = this.bars.pop().sprite;
        let bleedingSprite = this.scene.add.sprite(sprite.x, sprite.y, "bleedingbar");
        bleedingSprite.setFrame(0);
        bleedingSprite.anims.animationManager.create({
            key: 'bleeding',
            frames: bleedingSprite.anims.animationManager.generateFrameNumbers('bleedingbar', { start: 0, end: 40 }),
            frameRate: 100
        });
        bleedingSprite.on('animationcomplete', this.destroy(bleedingSprite));
        bleedingSprite.anims.play("bleeding");
        sprite.destroy();

        // UPDATE HEALTHBAR TEXT
        this.updateText();
    }

    public updateText(): void{
        this.term.setText(this.toString());
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
        str += this.lastPiSymbolString;
        return str;
    }

    private destroy(bleedingSprite: Phaser.GameObjects.Sprite) {
        let destroy = function()
        {

            bleedingSprite.destroy();
        }
        return destroy;
    }

    public removeBar() : void{
        let sprite = this.bars.pop().sprite;
        sprite.destroy();
        this.updateText();
    }

}