import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;

export class ShipPart {
    private scene: Scene;
    public normal: Sprite;
    public destroyed: Sprite;
    public currentTex;
    public normal: Sprite;
    public destroyed: Sprite;
    private _offX: number;
    private _offY: number;
    private _x : number;
    private _y : number;
    private desOffX: number;
    private desOffY: number;

    private isDestroyed: boolean;

    public constructor(scene: Scene, x: number, y: number, normTex: string, desTex: string, offX: number, offY: number,
                       desOffX: number, desOffY: number, depth: number){
        this.scene = scene;
        this.normal = new Sprite(scene, x, y, normTex);
        this.destroyed = new Sprite(scene, x, y, desTex);
        this._offX = offX;
        this._offY = offY;

        this.desOffX = desOffX;
        this.desOffY = desOffY;

        this.isDestroyed = false;

        this.normal.setDepth(depth);
        this.destroyed.setDepth(depth-2);

        this.currentTex = this.scene.add.existing(this.normal);

    }

    public toDestroyedPart(): void{
        this.normal.destroy();
        this.scene.add.existing(this.destroyed);
        this.isDestroyed = true;
    }

    public setPosition(x: number, y: number): void{
        this.normal.setPosition(x + this._offX, y + this._offY);
        this.destroyed.setPosition(x + this.desOffX, y + this.desOffY);

        this.x = this.normal.x;
        this.y = this.normal.y;
    }

    public update(delta: number): void{
        if(!this.isDestroyed) return;
        this.destroyed.x += (this._offX *0+ this.desOffX) / 5500 * delta;
        this.destroyed.y += (this._offY *0+ this.desOffY)/ 5500 * delta;
    }

    get offX(): number
    {
        return this._offX;
    }

    set offX(value: number)
    {
        this._offX = value;
    }

    get offY(): number
    {
        return this._offY;
    }

    set offY(value: number)
    {
        this._offY = value;
    }

    get x()
    {
        return this._x;
    }

    set x(value)
    {
        this._x = value;
    }

    get y()
    {
        return this._y;
    }

    set y(value)
    {
        this._y = value;
    }
}