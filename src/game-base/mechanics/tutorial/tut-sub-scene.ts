
export abstract class TutSubScene {
    inDuration: number;
    outDuration: number;
    subSceneDuration: number;

    public blockMainScene: boolean;
    protected scene: Phaser.Scene;


    protected constructor(scene: Phaser.Scene, inDuration: number, outDuration: number, subSceneDuration: number) {
        this.scene = scene;
        this.inDuration = inDuration;
        this.outDuration = outDuration;
        this.subSceneDuration = subSceneDuration;
        this.blockMainScene = false;
    }

    public abstract launch(): void;
    public abstract subIntro(delta: number): void;
    public abstract subScene(delta: number): void;
    public abstract subOutro(delta: number): void;
    public abstract update(delta: number): void;
    public abstract destroy(): void;
}