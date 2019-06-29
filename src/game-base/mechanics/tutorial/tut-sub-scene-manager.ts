import {TutSubScene} from "./tut-sub-scene";
import {TutGenericTextScene} from "./scenes/tut-generic-text-scene";
import {TutGenericButtonScene} from "./scenes/tut-generic-button-scene";
import {ButtonWithText} from "./scenes/scene-mechanics/button-with-text";
import {Button} from "../button";
import {LifePrep} from "./scenes/tut-life/life-prep";

export class TutSubSceneManager {
    private scene: Phaser.Scene;
    private subScenes: TutSubScene[];
    private idx: number;
    private time: number;

    private skip: Button;

    public constructor(scene: Phaser.Scene){
        this.scene = scene;

        this.skip = new Button(scene, 50, 50, "button_shadow",
            "button_bg", "button_fg", "red_arrow", 0.95, ()=>{if (this.idx < 11){
                this.subScenes[this.idx].destroy();
                this.idx = 11;
                this.time = 0;
                this.subScenes[this.idx].launch();
            }});

        this.subScenes = [
            new TutGenericTextScene(scene, "Welcome.", 64, 3, 1, 1),
            new TutGenericButtonScene(scene, "Are you ready for the tutorial?", [
                new ButtonWithText(scene, "blue_arrow", "Yes.", ()=>{this.unblockScene();},1920/2 - 100, 1080/2),
                new ButtonWithText(scene, "blue_arrow", "Yes!!!", ()=>{this.unblockScene();},1920/2 - 100, 1080/2+100),
                new ButtonWithText(scene, "blue_arrow", "Definitely!", ()=>{this.unblockScene();},1920/2 - 100, 1080/2+200),
                new ButtonWithText(scene, "blue_arrow", "...no.", ()=>{this.dontExitRandom();},1920/2 - 100, 1080/2+300),
            ]),
            new TutGenericTextScene(scene, "This is a tutorial.", 64, 1, 1, 1),
            new TutGenericTextScene(scene, "Be ready!", 64, 1, 1, 1),
            new TutGenericTextScene(scene, "It starts...", 64, 1, 1, 1),
            new TutGenericTextScene(scene, "in...", 64, 1, 1, 1),
            new TutGenericTextScene(scene, "3", 92, 0.5, 0.25, 0.25),
            new TutGenericTextScene(scene, "2", 92, 0.5, 0.25, 0.25),
            new TutGenericTextScene(scene, "1", 92, 0.5, 0.25, 0.25),
            new TutGenericTextScene(scene, "Too bad.", 64, 1, 1, 1),
            new TutGenericTextScene(scene, "It's not yet implemented.", 64, 1, 1, 1), //skipped via button
            new TutGenericTextScene(scene, "Basics: #Life", 64, 3, 1, 1),
            new LifePrep(scene),
        ];

        this.idx = 0;
        this.time = 0;
        this.subScenes[this.idx].launch();
    }

    public update(delta: number){
        if(this.idx >= this.subScenes.length){
            return;
        }
        this.skip.updateStep();
        this.time += delta;
        let curSubScene = this.subScenes[this.idx];
        curSubScene.update(delta);
        this.updateIntro(curSubScene, this.time);
    }

    private updateIntro(cur: TutSubScene, time: number){
        if(time > cur.inDuration){
            this.updateScene(cur, time - cur.inDuration);
        }
        else{
            cur.subIntro(time/cur.inDuration);
        }
    }

    private updateScene(cur: TutSubScene, time: number){
        if(time > cur.subSceneDuration){
            this.updateOutro(cur, time - cur.subSceneDuration);
        }
        else{
            cur.subScene(time/cur.subSceneDuration);
        }
    }

    private updateOutro(cur: TutSubScene, time: number){
        if(time > cur.outDuration){
            this.nextScene();
        }
        else{
            cur.subOutro(time/cur.outDuration);
        }
    }

    private nextScene(){
        if (this.subScenes[this.idx].blockMainScene) return;
        if(this.idx < this.subScenes.length)
            this.subScenes[this.idx].destroy(); // Do not destroy the last scene
        this.idx++;
        if(this.idx < this.subScenes.length) this.subScenes[this.idx].launch();
        else return;//this.scene.scene.launch('FadeScene', {shut: 'TutorialScene', start: 'StartScene'});
        this.time = 0;
    }

    private unblockScene(): void{
        this.subScenes[this.idx].blockMainScene = false;
    }

    private dontExitRandom(): void{
        let rand:number = Math.random();
        const reasons:string[] = [
            "There is no escape.",
            "Why would you want to leave.",
            "Did you really think this button would end the tutorial?",
            "STAY WITH ME!",
            "Please don't click this button again.",
            "This is a tutorial, you must not leave.",
            "Maybe if you try it one more time it will work...",
            "Ah shit, here we go again...",
            "One does not simply press this button to leave.",
            "This button will not let you leave. Change my mind.",
            "You pressed the leave button, but did not leave the game.\nYou: *suprised_pikachu.jpg*",
            "You can't be fooled again if you don't press the button again.",
            'Hard to swallow pills: "This button will not let you leave the tutorial"',
            "Who would win? You persisting to press this useless button : the useless button",
            "Maybe you should just press F5...",
        ];

        this.dontExit(reasons[Math.floor(reasons.length * rand)]);
    }

    private dontExit(text: string): void{
        console.log("He: "+text);
        if(this.idx > 0){
            let scene = this.subScenes[this.idx - 1];
            if (scene instanceof TutGenericTextScene){
                this.subScenes[this.idx].destroy();
                this.idx -= 1;
                this.time = 0;
                scene.launch();
                scene.setText(text);
                return;
            }
        }
        this.subScenes[this.idx].blockMainScene = false;
    }
}