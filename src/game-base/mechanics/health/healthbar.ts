import {HealthbarSprites} from "./healthbar-sprites";
import {HealthType} from "./health-type";
import {PiAnimSystem} from "../pianim/pi-anim-system";
import {PiAnimSequence} from "../pianim/pi-anim-sequence";
import {PiAnimAlignment} from "../pianim/pi-anim-alignment";
import Sprite = Phaser.GameObjects.Sprite;

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
        let sprite = this.bars.pop().sprite;
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

    public getBars() : number{
        return this.bars.length;
    }
}