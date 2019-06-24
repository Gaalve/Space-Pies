import {HealthbarSprites} from "./healthbar-sprites";
import {HealthType} from "./health-type";
import {Infobox} from "../Infobox";
import Sprite = Phaser.GameObjects.Sprite;
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
    public back:Sprite;
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
        this.back = scene.add.sprite(this.position - 30 * direction, this.y, "sym_zone").setScale(1.2, 1.2).setTintFill(0xF6F657).setVisible(false);
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
        this.activeBars++;
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
        this.activeBars--;
    }

    private updateText(): void{
        this.term.setText(this.toString());

        for (let bar of this.bars)
        {
            let sprite = bar.sprite;
            let infobox = <Infobox> this.scene.data.get("infoboxx");
            let playerName = this.direction == 1 ? "P1" : "P2";
            let opponentName = this.direction == 1 ? "P2" : "P1";
            let activeTerm = this.term.text.split(".")[0];
            let hitzoneNumber = this.y == 170 ? 1 : this.y == 220 ? 2 : this.y == 270 ? 3 : 4;

            let tooltipInfo = bar.type == HealthType.HitZoneBar ?
                "[" + playerName + "] " +
                "This is your Hitzone Bar. Each element represents one hitzone. \n"
                + "     If all are destroyed, the process \"CoreExplosion\" "+ playerName + " will execute\n"
                + "     and your ship will destroy.\n\n"
                + "     current term:        " + this.term.text + "\n"
                + "     currently active:    " + activeTerm  + "\n"
                + "     will be resolved by: " + Infobox.getOppositeTerm(activeTerm, playerName) + "\n\n"
                + "     (each of the other haelthbars emits an " + Infobox.getOppositeTerm(activeTerm, playerName) + "  after its last destroyed bar)"
            :
                "[" + playerName + "] Hitzone " + hitzoneNumber + "\n\n"
                + "     current term:          " + this.term.text + "\n"
                + "     currently active:      " + activeTerm + "\n"
                + "     will be resolved by:   " + Infobox.getOppositeTerm(activeTerm,playerName) + "\n\n"
                + "     (these come from each of " + opponentName + "'s weapons) \n"

            infobox.addTooltipInfo(sprite, tooltipInfo);
        }

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
        this.activeBars--;
    }

    public getBars() : number{
        return this.bars.length;
    }
}