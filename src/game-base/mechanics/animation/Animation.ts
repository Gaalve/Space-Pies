import {Player} from "../player";

export class Animation {
    private _id: String;
    private _animationScene: Phaser.Scene;
    private _fromX: number;
    private _fromY: number;
    private _toX: number;
    private _toY: number;
    private _text: Phaser.GameObjects.Text;
    private _duration: number;
    private _currentTime: number;
    private _player: Player;
    private _locked : boolean;
    private _interpolate: boolean;



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

    get fromX(): number {
        return this._fromX;
    }

    set fromX(value: number) {
        this._fromX = value;
    }

    get fromY(): number {
        return this._fromY;
    }

    set fromY(value: number) {
        this._fromY = value;
    }

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    get currentTime(): number {
        return this._currentTime;
    }

    set currentTime(value: number) {
        this._currentTime = value;
    }



    get locked(): boolean {
        return this._locked;
    }

    set locked(value: boolean) {
        this._locked = value;
    }

    get player(): Player {
        return this._player;
    }

    set player(value: Player) {
        this._player = value;
    }

    constructor(id: string, animationScene: Phaser.Scene, fromX: number, fromY: number, toX: number, toY: number, text: Phaser.GameObjects.Text, duration: number) {
        this._animationScene = animationScene;
        this._fromX = fromX;
        this._fromY = fromY;
        this._toX = toX;
        this._toY = toY;
        this._text = text;
        this._duration = duration;
        this._currentTime = 0;
        this._id = id;
        this._locked = false;
    }

    get interpolate(): boolean {
        return this._interpolate;
    }

    set interpolate(value: boolean) {
        this._interpolate = value;
    }
}