import {TutSubScene} from "./tut-sub-scene";
import {TutGenericTextScene} from "./scenes/tut-generic-text-scene";
import {TutGenericButtonScene} from "./scenes/tut-generic-button-scene";
import {ButtonWithText} from "./scenes/scene-mechanics/button-with-text";
import {Button} from "../button";
import {LifePrep} from "./scenes/tut-life/life-prep";
import {Life1} from "./scenes/tut-life/life-1";
import {Life2} from "./scenes/tut-life/life-2";
import {Life3} from "./scenes/tut-life/life-3";
import {Life4} from "./scenes/tut-life/life-4";
import {WeapPrep} from "./scenes/tut-weapons/weap-prep";
import {Weap1} from "./scenes/tut-weapons/weap-1";
import {Weap2} from "./scenes/tut-weapons/weap-2";
import {Weap3} from "./scenes/tut-weapons/weap-3";
import {Weap4} from "./scenes/tut-weapons/weap-4";
import {Weap5} from "./scenes/tut-weapons/weap-5";
import {Weap6} from "./scenes/tut-weapons/weap-6";

export class TutSubSceneManager {
    private scene: Phaser.Scene;
    private subScenes: TutSubScene[];
    private idx: number;
    private time: number;


    public constructor(scene: Phaser.Scene){
        this.scene = scene;
        this.subScenes = [
            new TutGenericTextScene(scene, "Welcome.", 64, 3, 0.5, 0.5),
            new TutGenericButtonScene(scene, "Are you ready for the tutorial?\nBasics: #Life", [
                new ButtonWithText(scene, "blue_arrow", "Yes.", ()=>{this.unblockScene();},1920/2 - 100, 1080/2-200),
                new ButtonWithText(scene, "blue_arrow", "Yes!!!", ()=>{this.unblockScene();},1920/2 - 100, 1080/2-100),
                new ButtonWithText(scene, "blue_arrow", "Definitely!", ()=>{this.unblockScene();},1920/2 - 100, 1080/2),
                new ButtonWithText(scene, "blue_arrow", "Skip.", ()=>{this.skip(15);},1920/2 - 100, 1080/2+100),
                new ButtonWithText(scene, "blue_arrow", "...no.", ()=>{this.exit();},1920/2 - 100, 1080/2+200),
            ]),
            new TutGenericTextScene(scene, "This is a tutorial.", 64, 1, 0.5, 0.5),
            new TutGenericTextScene(scene, "Be ready!", 64, 1, 0.5, 0.5),
            new TutGenericTextScene(scene, "It starts...", 64, 1, 0.5, 0.5),
            new TutGenericTextScene(scene, "in...", 64, 1, 0.5, 0.5),
            new TutGenericTextScene(scene, "3", 92, 0.5, 0.25, 0.25),
            new TutGenericTextScene(scene, "2", 92, 0.5, 0.25, 0.25),
            new TutGenericTextScene(scene, "1", 92, 0.5, 0.25, 0.25),
            new TutGenericTextScene(scene, "Basics: #Life", 64, 1, 0.5, 0.5),
        ];
        let lifePrep = new LifePrep(scene);
        /* ### Life Basics ### */
        this.subScenes.push(lifePrep);
        this.subScenes.push(new Life1(scene, lifePrep));
        this.subScenes.push(new Life2(scene, lifePrep));
        this.subScenes.push(new Life3(scene, lifePrep));
        this.subScenes.push(new Life4(scene, lifePrep));
        this.subScenes.push(new TutGenericTextScene(scene, "Basics: #Shields and Weapons", 64, 3, 0.5, 0.5));
        this.subScenes.push(new TutGenericButtonScene(scene, "Are you ready for #Shields and Weapons?", [
            new ButtonWithText(scene, "blue_arrow", "Yes.", ()=>{this.unblockScene();},1920/2 - 100, 1080/2-200),
            new ButtonWithText(scene, "blue_arrow", "Yes!!!", ()=>{this.unblockScene();},1920/2 - 100, 1080/2-100),
            new ButtonWithText(scene, "blue_arrow", "Definitely!", ()=>{this.unblockScene();},1920/2 - 100, 1080/2),
            new ButtonWithText(scene, "blue_arrow", "Skip.", ()=>{this.skip(24);},1920/2 - 100, 1080/2+100),
            new ButtonWithText(scene, "blue_arrow", "Exit.", ()=>{this.exit()},1920/2 - 100, 1080/2+200),
        ]));

        let weapPrep = new WeapPrep(scene);
        this.subScenes.push(weapPrep);
        this.subScenes.push(new Weap1(scene, weapPrep));
        this.subScenes.push(new Weap2(scene, weapPrep));
        this.subScenes.push(new Weap3(scene, weapPrep));
        this.subScenes.push(new Weap4(scene, weapPrep));
        this.subScenes.push(new Weap5(scene, weapPrep));
        this.subScenes.push(new Weap6(scene, weapPrep));
        this.subScenes.push(new TutGenericTextScene(scene, "That's all. Thanks for playing this tutorial.", 64, 3, 0.5, 0.5));
        this.subScenes.push(new TutGenericButtonScene(scene, "Are you ready to end this Tutorial?", [
            new ButtonWithText(scene, "blue_arrow", "Yes.", ()=>{this.exit();},1920/2 - 100, 1080/2-200),
            new ButtonWithText(scene, "blue_arrow", "Yes!!!", ()=>{this.exit();},1920/2 - 100, 1080/2-100),
            new ButtonWithText(scene, "blue_arrow", "Definitely!", ()=>{this.exit();},1920/2 - 100, 1080/2),
            new ButtonWithText(scene, "blue_arrow", "Exit.", ()=>{this.exit()},1920/2 - 100, 1080/2+100),
        ]));
        this.idx = 0;
        this.time = 0;
        this.subScenes[this.idx].launch();
    }

    public update(delta: number){
        if(this.idx >= this.subScenes.length){
            return;
        }
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
            "Why would you want to leave?",
            "Did you really think this button would end the tutorial?",
            "YOU SHALL NOT LEAVE!",
            "[INSERT TEXT HERE]",
            "Let's not do this again...",
            "Please don't click this button again.",
            "This is a tutorial, you must not leave.",
            "Maybe if you try it one more time it will work...",
            "Ah shit, here we go again...",
            "One does not simply press this button to leave.",
            "This button will not let you leave. Change my mind.",
            "You pressed the leave button, but did not leave the game.\nYou: *suprised_pikachu.jpg*",
            "You can't be fooled again if you don't press the button again.",
            'Hard to swallow pills: "This button will not let you leave this tutorial"',
            "Who would win? You, persisting to press this useless button : the useless button",
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

    private exit(): void{
        this.scene.scene.launch('FadeScene', {shut: 'TutorialScene', start: 'StartScene'});
    }

    private skip(idx: number): void{
        this.subScenes[this.idx].destroy();
        this.idx = idx;
        this.time = 0;
        this.subScenes[this.idx].launch();
    }

}