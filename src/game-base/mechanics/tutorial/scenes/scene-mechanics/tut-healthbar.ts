import {HealthbarSprites} from "../../../health/healthbar-sprites";
import Sprite = Phaser.GameObjects.Sprite;
import {HealthType} from "../../../health/health-type";
import {Infobox} from "../../../Infobox";

export class TutHealthbar {
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
        if (this.bars.length == 0) this.symbol.destroy();
    }

    private updateTextViaResolve(): void{
        this.updateInfoBox();
    }

    private updateTextViaNew(): void{
        this.updateInfoBox();
    }

    private updateInfoBox(): void{
        if (this.bars.length == 0)return;
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
        if(this.bars.length > 0) {
            str += this.lastPiSymbolString;
            str += ".0";
        }else{
            this.symbol.destroy()
        }
        return str;
    }

    public destroy(): void{
        this.bars.forEach(v => v.destroy());
        this.symbol.destroy();
        this.bars = [];
    }
}