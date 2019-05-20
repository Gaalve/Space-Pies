import {HealthbarSprites} from "./healthbar-sprites";
import Sprite = Phaser.GameObjects.Sprite;
import {HealthType} from "./health-type";

export class Healthbar {
    private readonly scene: Phaser.Scene;
    private bars: HealthbarSprites[];
    private readonly direction: 1|-1;
    private readonly offset: number = 14;
    private readonly y: number;
    private readonly position: number;
    private readonly symbol: Sprite;

    public constructor(scene: Phaser.Scene, direction: 1|-1, isHitZone: boolean, y: number){
        this.scene = scene;
        this.y = y;
        this.bars = [];
        this.direction = direction;
        this.position = direction == 1 ? 10 + 60 : 1920 - 10 - 50;
        this.symbol = new Sprite(scene, this.position - 30 * direction, this.y, isHitZone ? "sym_zone" : "sym_core");
        this.symbol.setOrigin(0.5,0.5);
        this.scene.add.existing(this.symbol);
    }

    public addBar(type: HealthType): void{
        this.bars.push(new HealthbarSprites(this.scene,type,
            this.position + this.bars.length * this.offset * this.direction,
            this.y))
    }

    public destroyBar(): void{
        this.bars.pop().destroy();
    }
}