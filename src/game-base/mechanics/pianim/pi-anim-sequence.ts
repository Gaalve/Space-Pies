import {PiAnimSymbol} from "./pi-anim-symbol";
import {PiAnimAlignment} from "./pi-anim-alignment";
import {PiAnimCommands} from "./pi-anim-commands";
import Scene = Phaser.Scene;

export class PiAnimSequence {

    scene: Scene;
    sequence: PiAnimSymbol[];
    alignment: PiAnimAlignment;
    posX: number;

    toPosX: number;

    commandQueue: PiAnimCommands[];
    clearSequenceQueue: PiAnimSequence[];

    hidden: boolean;


    public constructor(scene: Scene, x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT){
        this.scene = scene;
        this.sequence = [new PiAnimSymbol(scene, name, '', x, y)];
        this.sequence[0].active();
        this.alignment = alignemnt;
        this.posX = x;
        this.toPosX = x;
        this.commandQueue = [];
        this.clearSequenceQueue = [];
        this.hidden = false;
        this.updatePositions();

    };

    public resolveAll(): void{
        this.resolveSymbol();
        for (let i = 0; i < this.sequence.length - 1; i++) {
            this.commandQueue.push(PiAnimCommands.RESOLVE);
        }

    };

    public resolveAndClearSequence(x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT): PiAnimSequence{
        let other = new PiAnimSequence(this.scene, x, y, name, alignemnt);
        other.hide();
        this.clearSequenceQueue.push(other);
        this.resolveSymbol();
        this.commandQueue.push(PiAnimCommands.CLEAR);
        return other;
    };

    public resolveAllAndClearSequence(x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT): PiAnimSequence{
        let other = new PiAnimSequence(this.scene, x, y, name, alignemnt);
        other.hide();
        this.clearSequenceQueue.push(other);
        console.log('ResolveAllAndClear, Commands: '+this.commandQueue.length);
        this.resolveAll();
        this.commandQueue.push(PiAnimCommands.CLEAR);
        return other;
    };

    public clearSequence(x: number, y: number, name: string, alignemnt: PiAnimAlignment = PiAnimAlignment.LEFT): void{
        this.sequence.forEach(value => value.destroy());
        this.sequence = [new PiAnimSymbol(this.scene, name, '', x, y)];
        this.sequence[0].active();
        this.alignment = alignemnt;
        this.posX = x;
        this.toPosX = x;
        this.updatePositions();
    };


    public resolveSymbol(): void{
        if(this.commandQueue.length > 0 || this.sequence[0].isResolving()) this.commandQueue.push(PiAnimCommands.RESOLVE);
        else this.sequence[0].resolve();
    };

    private clamp(min: number, value: number, max: number): number{
        return Math.max(min, Math.min(value, max));
    }

    public update(delta: number): void{
        if (this.sequence.length == 0) return;

        if (this.posX != this.toPosX){
            // console.log('posX '+this.posX +" toPosX "+this.toPosX);
            const maxSpeed = 4;
            this.posX += this.clamp(-maxSpeed,(this.toPosX - this.posX), maxSpeed);
            this.updatePositions();
        }

        let sym = this.sequence[0];
        sym.update(delta);
        if (sym.shouldDestroy()) {
            sym.symbol.setScale(1);
            let width = sym.symbol.getBounds().width;
            sym.destroy();
            this.sequence.splice(0, 1);
            if (this.sequence.length == 0){
                this.nextCommand();
                return;
            }
            this.sequence[0].active();
            this.toPosX = this.posX;
            switch (this.alignment) {
                case PiAnimAlignment.LEFT:
                    this.posX += width;
                    break;
                case PiAnimAlignment.CENTER:
                    this.posX += width/2;
                    break;
                case PiAnimAlignment.RIGHT:
                    break;
            }
            // console.log('posX '+this.posX+' toPosX '+this.toPosX+' width '+width);
            this.updatePositions();
            this.nextCommand();
        }
    }

    private nextCommand(){
        if (this.commandQueue.length == 0) return;
        let command = this.commandQueue[0];
        this.commandQueue.splice(0, 1);
        switch (command) {
            case PiAnimCommands.NOTHING:
                return;
            case PiAnimCommands.RESOLVE:
                this.sequence[0].resolve();
                break;
            case PiAnimCommands.CLEAR:
                this.sequence.forEach(value => value.destroy());
                let other = this.clearSequenceQueue[0];
                this.sequence = other.sequence;
                this.clearSequenceQueue.splice(0, 1);
                this.sequence[0].active();
                this.updatePositions();
                this.show();
                console.log('New Sequence, length '+this.sequence.length + ' pos '+this.posX);
                if (this.commandQueue.length > 0) this.nextCommand();
                break;
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
        if (this.hidden) this.hide();
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

    public hide(): void{
        this.hidden = true;
        this.sequence.forEach(v => v.hide());
    }

    public show(): void{
        this.hidden = false;
        this.sequence.forEach(v => v.show());
    }

}