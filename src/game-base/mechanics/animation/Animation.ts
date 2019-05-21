
export class Animation {
    private _id: String;
    private _animationScene: Phaser.Scene;
    private _toX: number;
    private _toY: number;
    private _text: Phaser.GameObjects.Text;


    constructor(id: String, animationScene: Phaser.Scene, toX: number, toY: number, text: Phaser.GameObjects.Text) {
        this._id = id;
        this._animationScene = animationScene;
        this._toX = toX;
        this._toY = toY;
        this._text = text;
    }

    get id(): String {
        return this._id;
    }

    set id(value: String) {
        this._id = value;
    }

    get animationScene(): Phaser.Scene {
        return this._animationScene;
    }

    set animationScene(value: Phaser.Scene) {
        this._animationScene = value;
    }

    get toX(): number {
        return this._toX;
    }

    set toX(value: number) {
        this._toX = value;
    }

    get toY(): number {
        return this._toY;
    }

    set toY(value: number) {
        this._toY = value;
    }

    get text(): Phaser.GameObjects.Text {
        return this._text;
    }

    set text(value: Phaser.GameObjects.Text) {
        this._text = value;
    }
}