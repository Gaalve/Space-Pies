import {SubScene} from "../sub-scene";
import {IntroSpace} from "../../space/intro-space";

export class TransitionScene extends SubScene{

    space: IntroSpace;
    constructor(scene: Phaser.Scene, space: IntroSpace, duration: number = 2) {
        super(scene, 0, 0, duration);
        this.space = space;
    }



    subIntro(delta: number): void {
    }

    subOutro(delta: number): void {
    }

    subScene(delta: number): void {
        this.space.setCounterLimit(0.1);
        this.space.setSpeedModifier(20);
    }

    destroy(): void {
    }

    launch(): void {
    }



}