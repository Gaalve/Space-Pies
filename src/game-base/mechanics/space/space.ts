import Sprite = Phaser.GameObjects.Sprite;
import {Star} from "./star";

export class Space{

    private readonly scene: Phaser.Scene;
    private readonly lightLeft: Phaser.GameObjects.Sprite;
    private readonly lightRight: Phaser.GameObjects.Sprite;

    private readonly starLayerBG0: Star[];
    private readonly starLayerBG1: Star[];
    private readonly starLayerBG: Star[];
    private readonly starLayerMG: Star[];
    private readonly starLayerFG: Star[];

    private counter: number;
    private readonly counterLimit: number;


    public constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.lightLeft = new Sprite(scene, 0, 540, "big_oval_light");
        this.lightRight = new Sprite(scene, 1920, 540, "big_oval_light");
        this.lightLeft.setOrigin(0.5, 0.5);
        this.lightRight.setOrigin(0.5, 0.5);
        this.lightLeft.setTint(0xFF0000);
        this.lightRight.setTint(0x00ccFF);
        scene.add.existing(this.lightLeft);
        scene.add.existing(this.lightRight);
        this.counter = 0;
        this.counterLimit = 1;
        this.starLayerBG0 = [];
        this.starLayerBG1 = [];
        this.starLayerBG = [];
        this.starLayerMG = [];
        this.starLayerFG = [];
        for (let i = 0; i < 1000; i++) { // simulate 900 seconds
            this.update(0.1);
        }
    }

    private static removeFromList(list: any[], item: any): void{
        let idx: number = list.indexOf(item, 0);
        if(idx == -1){
            console.log("Warning! Symbol is not active");
        }
        else {
            list.splice(idx, 1);
        }
    }

    public update(delta: number): void{
        this.counter+=delta;
        // this.updateStepStars(this.starLayerBG0, 0.25);
        this.updateStepStars(this.starLayerBG1, 0.4, delta);
        this.updateStepStars(this.starLayerBG, 0.5, delta);
        this.updateStepStars(this.starLayerMG, 0.7, delta);
        this.updateStepStars(this.starLayerFG, 0.9, delta);



        this.lightLeft.setScale(0.99 + Math.sin(Phaser.Math.DEG_TO_RAD*360*this.counter/this.counterLimit)*0.01);
        this.lightRight.setScale(0.99 + Math.cos( Phaser.Math.DEG_TO_RAD*360*this.counter/this.counterLimit)*0.01);
        if(this.counter >= this.counterLimit){
            this.counter -= this.counterLimit;
        }
   }

   private updateStepStars(stars: Star[], scale: number, delta: number){
       let remove: Star[] = [];
       for(let idx in stars){
           let star = stars[idx];
           // star.updateStep();
           star.update(delta);
           if (star.shouldRemove()) remove.push(star);
       }

       for(let idx in remove){
           let star = remove[idx];
           star.destroy();
           Space.removeFromList(stars, star);
       }

       if(this.counter > this.counterLimit){
           stars.push(new Star(this.scene, scale, -40));
       }
   }
}