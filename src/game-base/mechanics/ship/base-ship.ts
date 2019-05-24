

export abstract class BaseShip {

    protected scene: Phaser.Scene
    protected posX: number;
    protected posY: number;

    public constructor(scene: Phaser.Scene, x: number, y: number){
        this.scene = scene;
        this.posX = x;
        this.posY = y;
    }

    public abstract setAllPartPosition(): void;

    public setPosition(x: number, y: number): void{
        this.posX = x;
        this.posY = y;
        this.setAllPartPosition();
    }

    public abstract toDestroyedShip(): void;
}