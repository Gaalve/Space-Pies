import {HealthbarSprites} from "./healthbar-sprites";
import {HealthType} from "./health-type";
import Text = Phaser.GameObjects.Text;
import {PiAnimSystem} from "../pianim/pi-anim-system";
import {PiAnimSequence} from "../pianim/pi-anim-sequence";
import {PiAnimAlignment} from "../pianim/pi-anim-alignment";

export class HealthbarSD {
    private readonly scene: Phaser.Scene;
    public bars: HealthbarSprites[];
    private readonly direction: 1|-1;
    private readonly offset: number = 14;
    private readonly x: number;
    private readonly y: number;
    private readonly pid: string;
    private readonly index : number;
    private readonly piAnimSys: PiAnimSystem;
    private piAnimSequence: PiAnimSequence;

    public constructor(scene: Phaser.Scene, x: number, y: number, pid: string, index: number, piAnimSys: PiAnimSystem){
        this.scene = scene;
        this.piAnimSys = piAnimSys;
        this.x = x;
        this.y = y;
        this.bars = [];
        this.pid = pid.toLowerCase();
        this.index = index;
        if(pid == "P1"){
            this.direction = 1;
        }else{
            this.direction = -1;
        }
        this.piAnimSequence = this.piAnimSys.addSequence(this.x,
            this.y + 14, 'NONE', PiAnimAlignment.CENTER);
        this.piAnimSequence.hide();
    }

    public addBar(type: HealthType): void{
        if(this.index > 0) {
            this.bars.push(new HealthbarSprites(this.scene, type,
                this.x + this.bars.length * this.offset * this.direction, this.y - 40, this.pid.toLowerCase()));
            this.updateTextViaNew();
            for(let b of this.bars){
                b.sprite.setDepth(-2);
            }
        }
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
        this.updateTextViaResolve();
    }

    private updateTextViaResolve(): void{
        this.piAnimSequence.show();
        if(this.bars.length == 0){
            this.piAnimSequence.resolveAll();
            return;
        }
        let other = this.piAnimSequence.resolveAndClearSequence(this.x,
            this.y - 70, this.bars[this.bars.length - 1].toString() + '( )',
            PiAnimAlignment.CENTER);
        for (let i = this.bars.length - 2; i >= 0; i--) {
            if (i >= 2 && i < this.bars.length - 3) {
                if(i == 2)
                    other.addSymbol('[...]');
            } else{
                other.addSymbol(this.bars[i].toString() + '( )');
            }
        }
        other.addSymbol("dessol" + this.pid + "< >");
        other.addSymbol('0');
    }

    private updateTextViaNew(): void{
        this.piAnimSequence.show();
        if(this.bars.length == 0) return;
        this.piAnimSequence.clearSequence(this.x - 10 * this.direction,
            this.y - 70, this.bars[this.bars.length - 1].toString() + '( )',
            PiAnimAlignment.CENTER);
        for (let i = this.bars.length - 2; i >= 0; i--) {
            if (i >= 2 && i < this.bars.length - 3) {
                if(i == 2)
                    this.piAnimSequence.addSymbol('[...]');
            } else{
                this.piAnimSequence.addSymbol(this.bars[i].toString() + '( )');
            }
        }
        this.piAnimSequence.addSymbol("dessol" + this.pid + "< >");
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
            str += "dessol" + this.pid + "< >";
            str += ".0";
        }
        return str;
    }

    private destroy(bleedingSprite: Phaser.GameObjects.Sprite) {
        let destroy = function()
        {

            bleedingSprite.destroy();
        };
        return destroy;
    }

    public removeBars() : void{
        for(let bar of this.bars){
            bar.destroy();
        }
        this.piAnimSequence.resolveAll();
    }
}