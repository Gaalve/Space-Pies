

export abstract class BaseShip {

    protected posX: number;
    protected posY: number;

    public constructor(x: number, y: number){
        this.posX = x;
        this.posY = y;
    }

    public setPosition(x: number, y: number): void{

    }

    public abstract toDestroyedShip(): void;
}