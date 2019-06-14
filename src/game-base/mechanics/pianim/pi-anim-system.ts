import {PiAnimSequence} from "./pi-anim-sequence";
import Scene = Phaser.Scene;

export class PiAnimSystem {
    private readonly scene: Scene;
    private sequences: PiAnimSequence[];


    public constructor(scene: Scene) {
        this.scene = scene;
        this.sequences = [];
    }

    public addSequence(x: number, y: number, name: string, orX?: number, orY?: number): PiAnimSequence{
        let seq = new PiAnimSequence(this.scene, x, y, name, orY, orY);
        this.sequences.push(seq);
        return seq;
    }

    public update(delta: number){
        this.sequences.forEach(value => value.update(delta))
    }
}