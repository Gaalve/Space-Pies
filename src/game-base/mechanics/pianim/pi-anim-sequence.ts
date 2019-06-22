import {PiAnimSymbol} from "./pi-anim-symbol";
import {PiAnimAlignment} from "./pi-anim-alignment";
import Scene = Phaser.Scene;

export class PiAnimSequence {

    scene: Scene;
    sequence: PiAnimSymbol[];
    curIdx: number;
    alignment: PiAnimAlignment;
    posX: number;

    public constructor(scene: Scene, x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT){
        this.scene = scene;
        this.sequence = [new PiAnimSymbol(scene, name, '', x, y)];
        this.curIdx = 0;
        this.sequence[0].active();
        this.alignment = alignemnt;
        this.posX = x;
        this.updatePositions();
    };

    public clearSequence(x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT): void{
        this.sequence.forEach(value => value.destroy());
        this.sequence = [new PiAnimSymbol(this.scene, name, '', x, y)];
        this.curIdx = 0;
        this.sequence[0].active();
        this.alignment = alignemnt;
        this.posX = x;
        this.updatePositions();
    };

    public resetSequence(): void{
        this.curIdx = 0;
        this.sequence.forEach(value => value.inactive());
        this.sequence[0].active();
    };

    public resolveSymbol(): void{
        this.sequence[this.curIdx].resolve();
    };

    public update(delta: number): void{
        if (this.curIdx > this.sequence.length) return;
        let sym = this.sequence[this.curIdx];
        sym.update(delta);
        if (sym.shouldDestroy()) {
            this.curIdx++;
            this.sequence[this.curIdx].active();
        }
    }

    public addSymbol(name: string): void{
        let lastSym = this.sequence[this.sequence.length - 1];
        lastSym.changeSuffix('.');
        this.sequence.push(new PiAnimSymbol(this.scene,
            name, '',
            lastSym.getNextX(),
            lastSym.y
        ));
        this.updatePositions();
    }

    private updatePositions(): void{
        let firstX = this.posX;
        let curX = this.posX;
        for(let idx in this.sequence){
            let sym = this.sequence[idx];
            sym.setXPosition(curX);
            curX = sym.getNextX();
        }
        let lastX = curX;
        let width = lastX - firstX;
        if (this.alignment == PiAnimAlignment.CENTER) this.updateLeftAlignment(this.posX - width/2);
        else if (this.alignment == PiAnimAlignment.RIGHT) this.updateLeftAlignment(this.posX - width);
    }

    private updateLeftAlignment(posX: number): void{
        let curX = posX;
        for(let idx in this.sequence){
            let sym = this.sequence[idx];
            sym.setXPosition(curX);
            curX = sym.getNextX();
        }
    }

}