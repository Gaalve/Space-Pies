
export abstract class SubScene {
    inDuration: number;
    outDuration: number;
    subSceneDuration: number;

    public skipInTransition: boolean = false;
    public skipOutTransition: boolean = false;
    protected scene: Phaser.Scene;


    protected constructor(scene: Phaser.Scene, inDuration: number, outDuration: number, subSceneDuration: number) {
        this.scene = scene;
        this.inDuration = inDuration;
        this.outDuration = outDuration;
        this.subSceneDuration = subSceneDuration;
    }

    public abstract launch(): void;
    public abstract subIntro(delta: number): void;
    public abstract subScene(delta: number): void;
    public abstract subOutro(delta: number): void;
    public abstract destroy(): void;
}