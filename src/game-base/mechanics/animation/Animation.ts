import {Player} from "../player";

export class Animation {
    get weaponType(): string
    {
        return this._weaponType;
    }

    set weaponType(value: string)
    {
        this._weaponType = value;
    }
    private _weaponType: string;
    get weaponNumber(): number
    {
        return this._weaponNumber;
    }

    set weaponNumber(value: number)
    {
        this._weaponNumber = value;
    }
    private _id: String;
    private _animationScene: Phaser.Scene;
    private _fromX: number;
    private _fromY: number;
    private _toX: number;
    private _toY: number;
    private _text: Phaser.GameObjects.Text;
    private _duration: number;
    private _currentTime: number;
    private _finished: boolean;
    private _locked : boolean;
    private _interpolate: boolean;
    private _move: boolean;
    private _scaleFont: boolean;
    private _vanish: boolean;
    private _rotate : boolean;
    private _toColor: string;
    private _stage : number;
    private _callback : Function;
    private _weaponNumber : number;

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

    static create(id: string, animationScene: Phaser.Scene, fromX: number, fromY: number, toX: number, toY: number, text: Phaser.GameObjects.Text, duration: number, callback: Function)
    {
        let newInstance = new this(id, animationScene, fromX, fromY, toX, toY, text, duration);
        newInstance.callback = callback;
        return newInstance;
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
        this._stage = 0;
    }

    get interpolate(): boolean {
        return this._interpolate;
    }

    set interpolate(value: boolean) {
        this._interpolate = value;
    }

    get move(): boolean {
        return this._move;
    }

    set move(value: boolean) {
        this._move = value;
    }

    get scaleFont(): boolean {
        return this._scaleFont;
    }

    set scaleFont(value: boolean) {
        this._scaleFont = value;
    }

    get finished(): boolean {
        return this._finished;
    }

    set finished(value: boolean) {
        this._finished = value;
    }

    get toColor(): string {
        return this._toColor;
    }

    set toColor(value: string) {
        this._toColor = value;
    }

    get vanish(): boolean {
        return this._vanish;
    }

    set vanish(value: boolean) {
        this._vanish = value;
    }

    get stage(): number {
        return this._stage;
    }

    set stage(value: number) {
        this._stage = value;
    }

    get callback(): Function {
        return this._callback;
    }

    set callback(value: Function) {
        this._callback = value;
    }

    get rotate(): boolean {
        return this._rotate;
    }

    set rotate(value: boolean) {
        this._rotate = value;
    }

    resetParams() {
       this.locked = false;
       this.move = false;
       this.interpolate = false;
       this.scaleFont = false;
       this.vanish = false;
       this.callback = null;
       this.currentTime = 0;
       this.finished = false;
       this.fromX = this.text.x;
       this.fromY = this.text.y;
    }

    static clone(anim: Animation) {
        let copiedAnimation = new Animation(anim.id.toString(), anim.animationScene, anim.fromX, anim.fromY, anim.toX, anim.toY, anim.text, anim.duration);
        copiedAnimation.locked = anim.locked;
        copiedAnimation.move = anim.move;
        copiedAnimation.interpolate = anim.interpolate;
        copiedAnimation.scaleFont = anim.scaleFont;
        copiedAnimation.vanish = anim.vanish;
        copiedAnimation.callback = anim.callback;
        copiedAnimation.duration = anim.duration;
        copiedAnimation.toColor = anim.toColor;
        copiedAnimation.finished =  anim.finished;
        copiedAnimation.fromX = anim.text.x;
        copiedAnimation.fromY = anim.text.y;
        copiedAnimation.currentTime = 0;
        copiedAnimation.weaponNumber = anim.weaponNumber;
        copiedAnimation.weaponType = anim.weaponType;
        return copiedAnimation;

    }

    getWidthDelta()
    {
        let fontDelta =  Math.abs(parseInt(this.text.style.fontSize.substr(0,this.text.style.fontSize.indexOf("px"))) - 50);
        fontDelta /= 2;
        let currentWidth = this.text.width;
        let totalWidth = currentWidth;
        for (let char of this.text.text)
            totalWidth += fontDelta;
        return 1;
    }
}