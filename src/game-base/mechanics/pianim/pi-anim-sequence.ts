import {PiAnimSymbol} from "./pi-anim-symbol";
import {PiAnimAlignment} from "./pi-anim-alignment";
import {PiAnimCommands} from "./pi-anim-commands";
import Scene = Phaser.Scene;

export class PiAnimSequence {

    scene: Scene;
    sequence: PiAnimSymbol[];
    // curIdx: number;
    alignment: PiAnimAlignment;
    posX: number;

    commandQueue: PiAnimCommands[];
    clearSequenceQueue: PiAnimSequence[];


    public constructor(scene: Scene, x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT){
        this.scene = scene;
        this.sequence = [new PiAnimSymbol(scene, name, '', x, y)];
        this.sequence[0].active();
        this.alignment = alignemnt;
        this.posX = x;
        this.commandQueue = [];
        this.clearSequenceQueue = [];
        this.updatePositions();
    };


    public resolveAndClearSequence(x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT): PiAnimSequence{
        let other = new PiAnimSequence(this.scene, x, y, name, alignemnt);
        other.hide();
        this.clearSequenceQueue.push(other);
        this.sequence[0].resolve();
        this.commandQueue.push(PiAnimCommands.CLEAR);
        return other;
    };

    public clearSequence(x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT): void{
        this.sequence.forEach(value => value.destroy());
        this.sequence = [new PiAnimSymbol(this.scene, name, '', x, y)];
        this.sequence[0].active();
        this.alignment = alignemnt;
        this.posX = x;
        this.updatePositions();
    };

    public resetSequence(): void{
        // this.curIdx = 0;
        this.sequence.forEach(value => value.inactive());
        this.sequence[0].active();
    };

    public resolveSymbol(): void{
        this.sequence[0].resolve();
    };

    public update(delta: number): void{
        if (this.sequence.length == 0) return;
        let sym = this.sequence[0];
        sym.update(delta);
        if (sym.shouldDestroy()) {
            sym.destroy();
            this.sequence.splice(0, 1);
            this.sequence[0].active();
            this.updatePositions();
            this.nextCommand();
        }
    }

    private nextCommand(){
        if (this.commandQueue.length == 0) return;
        switch (this.commandQueue[0]) {
            case PiAnimCommands.NOTHING:
                return;
            case PiAnimCommands.RESOLVE:
                this.sequence[0].resolve();
                break;
            case PiAnimCommands.CLEAR:
                this.sequence.forEach(value => value.destroy());
                let other = this.clearSequenceQueue[0];
                this.sequence = other.sequence;
                this.posX = other.posX;
                this.clearSequenceQueue.splice(0, 1);
                this.sequence[0].active();
                this.show();
                break;
        }
        this.commandQueue.splice(0, 1);
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

    private hide(): void{
        this.sequence.forEach(v => v.hide());
    }

    private show(): void{
        this.sequence.forEach(v => v.show());
    }

}