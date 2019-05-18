import {SubScene} from "./sub-scene";
import {PresentScene} from "./scenes/present-scene";
import {IntroSpace} from "../space/intro-space";
import {TransitionScene} from "./scenes/transition-scene";
import {GenericTextScene} from "./scenes/generic-text-scene";

export class SubSceneManager {
    private space: IntroSpace;
    private subScenes: SubScene[];
    private idx: number;
    private time: number;


    public constructor(scene: Phaser.Scene){
        this.space = new IntroSpace(scene);
        this.subScenes = [new TransitionScene(scene, this.space), new TransitionScene(scene, this.space), new PresentScene(scene),
            new TransitionScene(scene, this.space), new GenericTextScene(scene, "Space Pies\nThe Ultimate Game\nGold Edition", 160),
            new TransitionScene(scene, this.space), new GenericTextScene(scene, "A not so long time ago...", 100, 1),
            new TransitionScene(scene, this.space,1), new GenericTextScene(scene, "...in a galaxy not far away...", 100, 1),
            new TransitionScene(scene, this.space,1), new GenericTextScene(scene, "...two men were destined to fight...", 100, 1),
            new TransitionScene(scene, this.space,1), new GenericTextScene(scene, "...in the Ultimate Battle of the Universe.", 100),];

        this.idx = 0;
        this.time = 0;
        this.subScenes[this.idx].launch();
    }

    public update(delta: number){
        if(this.idx >= this.subScenes.length) return; //TODO
        this.time += delta;
        let curSubScene = this.subScenes[this.idx];
        this.updateIntro(curSubScene, this.time);
        this.space.update(delta);

    }

    private updateIntro(cur: SubScene, time: number){

        if(time > cur.inDuration){
            this.updateScene(cur, time - cur.inDuration);

        }
        else{
            console.log("Intro");
            this.space.setCounterLimit(Math.sin(time/cur.inDuration * Math.PI/2)*0.7+0.1);
            this.space.setSpeedModifier((Math.cos(time/cur.inDuration * Math.PI/2))*18 + 2);
            cur.subIntro(time/cur.inDuration);
        }
    }

    private updateScene(cur: SubScene, time: number){

        if(time > cur.subSceneDuration){
            this.updateOutro(cur, time - cur.subSceneDuration);
        }
        else{
            console.log("Scene");
            this.space.setCounterLimit(0.8);
            this.space.setSpeedModifier(2);
            cur.subScene(time/cur.subSceneDuration);
        }
    }

    private updateOutro(cur: SubScene, time: number){

        if(time > cur.outDuration){
            this.nextScene();
        }
        else{
            console.log("Outro");
            this.space.setCounterLimit(Math.cos(time/cur.outDuration * Math.PI/2)*0.7+0.1);
            this.space.setSpeedModifier((Math.sin(time/cur.inDuration * Math.PI/2))*18 + 2);
            cur.subOutro(time/cur.outDuration);
        }

    }

    private nextScene(){
        console.log("Next");
        this.subScenes[this.idx++].destroy();
        if(this.idx < this.subScenes.length) this.subScenes[this.idx].launch();
        this.time = 0;
    }
}