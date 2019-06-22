import {PiAnimSequence} from "./pi-anim-sequence";
import Scene = Phaser.Scene;
import {PiAnimAlignment} from "./pi-anim-alignment";

export class PiAnimSystem {
    private readonly scene: Scene;
    private sequences: PiAnimSequence[];


    public constructor(scene: Scene) {
        this.scene = scene;
        this.sequences = [];
    }

    public addSequence(x: number, y: number, name: string, alignment?: PiAnimAlignment): PiAnimSequence{
        let seq = new PiAnimSequence(this.scene, x, y, name, alignment);
        this.sequences.push(seq);
        return seq;
    }

    public update(delta: number){
        this.sequences.forEach(value => value.update(delta))
    }
}