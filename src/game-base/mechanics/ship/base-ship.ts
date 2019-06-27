import {Weapon} from "../weapon";
import {MotorFlame} from "./motor-flame";


export abstract class BaseShip {

    protected scene: Phaser.Scene
    protected posX: number;
    protected posY: number;

    public motorRocket1: MotorFlame;
    public motorRocket2: MotorFlame;
    public motorRsize1: number;
    public motorRsize2: number;

    public motorLaser1: MotorFlame;
    public motorLaser2: MotorFlame;
    public motorLsize1: number;
    public motorLsize2: number;

    public motorProj1: MotorFlame;
    public motorProj2: MotorFlame;
    public motorPsize1: number;
    public motorPsize2: number;

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