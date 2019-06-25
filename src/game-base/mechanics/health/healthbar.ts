import {HealthbarSprites} from "./healthbar-sprites";
import {HealthType} from "./health-type";
import {Infobox} from "../Infobox";
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
        for (let bar of this.bars){
            let sprite = bar.sprite;
            let infobox = <Infobox> this.scene.data.get("infoboxx");
            let playerName = this.direction == 1 ? "P1" : "P2";
            let opponentName = this.direction == 1 ? "P2" : "P1";
            let activeTerm = this.toString().split(".")[0];
            let hitzoneNumber = this.y == 170 ? 1 : this.y == 220 ? 2 : this.y == 270 ? 3 : 4;

            let tooltipInfo = bar.type == HealthType.HitZoneBar ?
                "[" + playerName + "] " +
                "This is your HitZone Bar. Each element represents one HitZone. \n"
                + "     If all are destroyed, the process \"CoreExplosion\" "+ playerName + " will execute\n"
                + "     and your ship will be destroyed.\n\n"
                + "     For each lost Zone you'll receive a Malus for the Energy Regeneration\n"
                + "     of your Space Ship. (-5 for one, -14 for two, -27 for three)\n"
                + "     current term:        " + this.toString() + "\n"
                + "     currently active:    " + activeTerm  + "\n"
                + "     will be resolved by: " + Infobox.getOppositeTerm(activeTerm, playerName) + "\n\n"
                + "     (each of the other HealthBars emits an " + Infobox.getOppositeTerm(activeTerm, playerName) + " after its last destroyed bar)"
                :
                "[" + playerName + "] HitZone " + hitzoneNumber + "\n\n"
                + "     current term:          " + this.toString() + "\n"
                + "     currently active:      " + activeTerm + "\n"
                + "     will be resolved by:   " + Infobox.getOppositeTerm(activeTerm,playerName) + "\n\n"
                + "     (these come from each of " + opponentName + "'s weapons) \n";

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

    public removeBar() : void{
        let sprite = this.bars.pop().sprite;
        this.scene.time.delayedCall(500,()=>{sprite.destroy()}, [],this);
        this.activeBars--;
    }

    public getBars() : number{
        return this.bars.length;
    }
}