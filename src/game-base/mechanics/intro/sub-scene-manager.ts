import {SubScene} from "./sub-scene";
import {PresentScene} from "./scenes/present-scene";
import {IntroSpace} from "../space/intro-space";
import {TransitionScene} from "./scenes/transition-scene";
import {GenericTextScene} from "./scenes/generic-text-scene";
import {LoreScene} from "./scenes/lore-scene";
import {LoreScene2} from "./scenes/lore-scene-2";
import {LoreScene3} from "./scenes/lore-scene-3";
import {LoreScene4} from "./scenes/lore-scene-4";
import {LoreScene5} from "./scenes/lore-scene-5";
import {LoreScene6} from "./scenes/lore-scene-6";
import {TransitionSceneFast} from "./scenes/transition-scene-fast";
import {Background} from "../../scenes/background";

export class SubSceneManager {
    private scene: Phaser.Scene;
    private space: IntroSpace;
    private subScenes: SubScene[];
    private idx: number;
    private time: number;
    private skipped: boolean;


    public constructor(scene: Phaser.Scene){
        this.scene = scene;
        this.space = new IntroSpace(scene);
        this.subScenes = [
            new TransitionScene(scene, this.space), new TransitionScene(scene, this.space), new PresentScene(scene),
            new TransitionScene(scene, this.space), new GenericTextScene(scene, "Space Pies\nThe Ultimate Game\nGold Edition", 160),
            new TransitionScene(scene, this.space), new GenericTextScene(scene, "A not so long time ago...", 100, 1),
            new TransitionScene(scene, this.space,1), new GenericTextScene(scene, "...in a galaxy not far away...", 100, 1),
            new TransitionScene(scene, this.space,1), new GenericTextScene(scene, "...two men were destined to fight...", 100, 1),
            new TransitionScene(scene, this.space,1), new GenericTextScene(scene, "...in the Ultimate Battle of the Universe.", 100, 3),
            new TransitionSceneFast(scene, this.space,5), new LoreScene(scene), new LoreScene2(scene),
            new TransitionScene(scene, this.space, 2), new LoreScene3(scene),
            new LoreScene4(scene), new LoreScene5(scene), new LoreScene6(scene),
            new TransitionScene(scene,this.space)];

        this.idx = 0;
        this.time = 0;
        this.subScenes[this.idx].launch();
        this.skipped = false;
    }

    public update(delta: number){
        if(this.idx >= this.subScenes.length){
            this.space.update(delta);
            return;
        }
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
            if(!cur.skipInTransition) {
                this.space.setCounterLimit(Math.sin(time / cur.inDuration * Math.PI / 2) * 0.7 + 0.1);
                this.space.setSpeedModifier((Math.cos(time / cur.inDuration * Math.PI / 2)) * 18 + 2);
            }
            cur.subIntro(time/cur.inDuration);
        }
    }

    private updateScene(cur: SubScene, time: number){

        if(time > cur.subSceneDuration){
            this.updateOutro(cur, time - cur.subSceneDuration);
        }
        else{
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
            if(!cur.skipOutTransition) {
                this.space.setCounterLimit(Math.cos(time / cur.outDuration * Math.PI / 2) * 0.7 + 0.1);
                this.space.setSpeedModifier((Math.sin(time / cur.outDuration * Math.PI / 2)) * 18 + 2);
            }
            cur.subOutro(time/cur.outDuration);
        }

    }

    private nextScene(){
        if(this.skipped)return;
        this.subScenes[this.idx++].destroy();
        if(this.idx < this.subScenes.length) this.subScenes[this.idx].launch();
        else this.scene.scene.launch('FadeScene', {shut: 'Intro', start: 'Background'});
        this.time = 0;
    }

    public skipToLastScene(){
        this.skipped = true;
        this.scene.scene.launch('FadeScene', {shut: 'Intro', start: 'Background'});
    }
}