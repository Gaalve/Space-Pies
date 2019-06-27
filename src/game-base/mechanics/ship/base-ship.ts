import {Weapon} from "../weapon";


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

    public abstract toDestroyedBack(): void;
    public abstract toDestroyedWingUp(): void;
    public abstract toDestroyedWingDown(): void;
    public abstract toDestroyedPilot(): void;
    public abstract toDestroyedHull(): void;

    public abstract toDestroyedShip(): void;
    public abstract addWeapon(weapon:Weapon): void;

    public abstract update(delta: number): void;
}