import {HealthbarSprites} from "./healthbar-sprites";
import Sprite = Phaser.GameObjects.Sprite;
import {HealthType} from "./health-type";
import Text = Phaser.GameObjects.Text;
import ANIMATION_COMPLETE = Phaser.Animations.Events.ANIMATION_COMPLETE;

export class Healthbar {
    private readonly scene: Phaser.Scene;
    public bars: HealthbarSprites[];
    private readonly direction: 1|-1;
    private readonly offset: number = 14;
    private readonly y: number;
    public position: number;
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

    public destroyBar(): void{
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
        this.updateText();
    }

    private updateText(): void{
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
        if(this.bars.length > 0){
            str += this.lastPiSymbolString;
            str += ".0";
        }else{
            this.symbol.destroy()
        }
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
        this.scene.time.delayedCall(500,()=>{sprite.destroy()}, [],this);
        this.scene.time.delayedCall(500,()=>{this.updateText()}, [],this);
    }

    public getBars() : number{
        return this.bars.length;
    }
}