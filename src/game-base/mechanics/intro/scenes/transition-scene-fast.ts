import {SubScene} from "../sub-scene";
import {IntroSpace} from "../../space/intro-space";

export class TransitionSceneFast extends SubScene{

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
        if(delta < 0.5){
            delta *= 2;
            this.space.setCounterLimit(0.1);
            this.space.setSpeedModifier((Math.sin(delta * Math.PI / 2)) * 60 + 20);
        }
        else{
            delta -= 0.5;
            delta *= 2;
            this.space.setCounterLimit(0.1);
            this.space.setSpeedModifier((Math.cos(delta * Math.PI / 2)) * 60 + 20);
        }

    }

    destroy(): void {
    }

    launch(): void {
    }



}