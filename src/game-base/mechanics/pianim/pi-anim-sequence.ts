import {PiAnimSymbol} from "./pi-anim-symbol";
import Scene = Phaser.Scene;

export class PiAnimSequence {

    scene: Scene;
    sequence: PiAnimSymbol[];
    curIdx: number;

    public constructor(scene: Scene, x: number, y: number, name: string, orX?: number, orY?: number){
        this.scene = scene;
        this.sequence = [new PiAnimSymbol(scene, name, '', x, y, orX, orY)];
        this.curIdx = 0;
        this.sequence[0].active();
    };

    public clearSequence(x: number, y: number, name: string, orX?: number, orY?: number): void{
        this.sequence.forEach(value => value.destroy());
        this.sequence = [new PiAnimSymbol(this.scene, name, '', x, y, orX, orY)];
        this.curIdx = 0;
        this.sequence[0].active();
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
            lastSym.y,
            lastSym.symbol.originX,
            lastSym.symbol.originY
        ));

    }

}