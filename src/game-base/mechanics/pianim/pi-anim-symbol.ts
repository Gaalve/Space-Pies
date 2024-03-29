import Text = Phaser.GameObjects.Text;
import Color = Phaser.Display.Color;
import Scene = Phaser.Scene;

export class PiAnimSymbol {

    name: string;

    suffix: '' | '.'; // . or nothing

    x: number;
    y: number;

    symbol: Text;

    counter: number;
    counterLimit: number;

    stage: 1 | 2 | 3;
    nextStage: 1 | 2 | 3;

    colorInactive: Color;
    colorActive: Color;
    colorResolve: Color;
    colorCur: Color;

    public constructor(scene: Scene, name: string, suffix: '' | '.', x: number,
                       y: number){
        this.name = name;
        this.suffix = suffix;
        this.x = x;
        this.y = y;

        this.symbol = scene.add.text(this.x, this.y, this.name + this.suffix, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 3, stroke: '#000'
        });

        this.stage = 1;
        this.counter = 0;
        this.counterLimit = 250;

        this.colorInactive = new Color(255, 255, 255);
        this.colorActive = Color.HexStringToColor('#00aa44');
        this.colorResolve = Color.HexStringToColor('#aa0000');
        this.colorCur = new Color(255, 255, 255);

        this.symbol.setOrigin(0, 0.5);
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
        // console.log('Stage: '+this.stage+' Counter: '+this.counter+'/'+this.counterLimit+' Color: '+this.colorCur.rgba);
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
            this.colorActive, this.colorResolve, this.counterLimit * 2 / 3, this.counter));
        if (this.counter > this.counterLimit * 2 / 3){
            let dist = this.counter - this.counterLimit * 2 / 3 ;
            dist /= this.counterLimit * 1 / 3;
            this.symbol.setScale(1 - dist);
        }
    }

    public shouldDestroy(): boolean{
        return this.stage == 3 && this.counter == this.counterLimit;
    }

    public isResolving(): boolean{
        return this.stage == 3 || this.nextStage == 3;
    };
    public resolve(): void{
        this.nextStage = 3;
    };
    public active(): void{
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

    public setXPosition(x: number): void{
        this.x = x;
        this.symbol.setPosition(this.x, this.y);
    }

    public hide(): void{
        this.symbol.setVisible(false);
    }

    public show(): void{
        this.symbol.setVisible(true);
    }
}