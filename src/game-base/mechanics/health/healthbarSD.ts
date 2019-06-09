import {HealthbarSprites} from "./healthbar-sprites";
import Sprite = Phaser.GameObjects.Sprite;
import {HealthType} from "./health-type";
import Text = Phaser.GameObjects.Text;

export class HealthbarSD {
    private readonly scene: Phaser.Scene;
    private bars: HealthbarSprites[];
    private readonly direction: 1|-1;
    private readonly offset: number = 14;
    private readonly x: number;
    private readonly y: number;
    private readonly pid: string;
    private term: Text;
    private readonly index : number;

    public constructor(scene: Phaser.Scene, x: number, y: number, pid: string, index: number){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.bars = [];
        this.pid = pid.toLowerCase();
        this.index = index;
        if(pid == "1"){
            this.direction = 1;
        }else{
            this.direction = -1;
        }

        this.term = scene.add.text(this.x, this.y-75, "", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 3, stroke: '#000'
        });
        this.term.setOrigin(0.5);
        this.term.setDepth(-1);
        scene.add.existing(this.term);
    }

    public addBar(type: HealthType): void{
        if(this.index > 0) {
            this.bars.push(new HealthbarSprites(this.scene, type,
                this.x + this.bars.length * this.offset * this.direction, this.y - 50, this.pid.toLowerCase()));
            this.updateText();
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
        this.updateText();
    }

    private updateText(): void{
        this.term.setText(this.toString());
        this.term.setOrigin(0.5);
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
            str += "desSolar" + this.pid + "< >";
            str += ".0";
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

    public getBars() : number{
        return this.bars.length;
    }
}