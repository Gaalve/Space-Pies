import Text = Phaser.GameObjects.Text;
import Color = Phaser.Display.Color;
import Scene = Phaser.Scene;
import {PiSymbol} from "../picalc/pi-symbol";

export class PiAnimSymbol {

    name: string;

    suffix: '' | '.'; // . or nothing

    x: number;
    y: number;

    symbol: Text;

    counter: number;
    counterLimit: number = 100;

    stage: 1 | 2 | 3;
    nextStage: 1 | 2 | 3;

    colorInactive: Color;
    colorActive: Color;
    colorResolve: Color;
    colorCur: Color;

    public constructor(scene: Scene, name: string, suffix: '' | '.', x: number,
                       y: number, orX: number = 0.5, orY: number = 0.5){
        this.name = name;
        this.suffix = suffix;
        this.x = x;
        this.y = y;

        this.symbol = scene.add.text(this.x, this.y, this.name + this.suffix, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 3, stroke: '#000'
        });

        this.symbol.setOrigin(orX, orY);
    }

    public update(delta: number): void{
        this.counter += delta;
        if (this.counter >= this.counterLimit) {
            this.counter = this.counterLimit;
            this.changeStage();
        }
        switch (this.stage) {
            case 1: this.stage1Update(); break;
            case 2: this.stage2Update(); break;
            case 3: this.stage3Update(); break;
        }
        this.symbol.setTint(this.colorCur.color);
    }

    private changeStage(){
        if (this.nextStage != this.stage){
            this.stage =  this.nextStage;
            this.counter = 0;
        }
    }

    public stage1Update(){ // Inactive
    }

    public stage2Update(){ // Active
        this.colorCur = Color.ObjectToColor(Color.Interpolate.ColorWithColor(
            this.colorInactive, this.colorActive, this.counterLimit, this.counter));
    }

    public stage3Update(){ // Resolve
        this.colorCur = Color.ObjectToColor(Color.Interpolate.ColorWithColor(
            this.colorActive, this.colorResolve, this.counterLimit, this.counter));
    }

    public shouldDestroy(): boolean{
        return this.stage == 3 && this.counter == this.counterLimit;
    }

    public resolve(): void{
        this.nextStage = 3;
    };
    public active(): void{ //TODO: Maybe next stage?!?!
        this.nextStage = 2;
    };
    public inactive(): void{
        this.nextStage = 1;
    };

    public changeSuffix(suffix: '' | '.'): void{
        this.suffix = suffix;
        this.symbol.setText(this.name + this.suffix);
    };

    public destroy(): void{
        this.symbol.destroy();
    }

    public getNextX(): number{
        return this.symbol.getBounds().right;
    }
}