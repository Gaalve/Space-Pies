
import {SubScene} from "../sub-scene";
import Sprite = Phaser.GameObjects.Sprite;
import Text = Phaser.GameObjects.Text;

export class LoreScene4 extends SubScene{

    planet: Sprite;
    blue: Sprite;
    red: Sprite;
    tbs: Sprite;
    tbn: Sprite;

    text: Text;

    constructor(scene: Phaser.Scene) {
        super(scene, 2, 0, 3);
        this.skipInTransition = false;
        this.skipOutTransition = true;
        this.planet = new Sprite(scene, -1000, 540, "intro_planet");
        this.blue = new Sprite(scene, -1000, 540, "ssb_ship_on");
        this.red = new Sprite(scene, -1000, 540, "ssr_ship_on");
        this.tbs = new Sprite(scene, -1000, 540, "intro_textbox_scream");
        this.tbn = new Sprite(scene, -1000, 540, "intro_textbox_normal");
        this.red.setFlipX(true);

        this.text = new Text(scene, -1920/2, 1080/2 + 200, "OLAAAAF!", {
            fill: '#222', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2,
            stroke: '#222'});
        //this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.5, 0.5);
    }

    subIntro(delta: number): void {
        this.moveSin(-500, 300, delta, this.red);
    }

    subOutro(delta: number): void {
        this.tbs.setAlpha(0);
        this.text.setAlpha(0);
    }

    subScene(delta: number): void {
        this.red.x = 300;
        this.tbs.x = 1500;
        this.tbs.setAlpha(1);
        this.text.setAlpha(1);
        this.tbs.y = 400;
        this.text.x = 1500;
        this.text.y = 380;
        if(delta <= 0.25){
            this.tbs.setAlpha(delta*4);
            this.text.setAlpha(delta*4);
        }
        if(delta >= 0.75){
            delta -= 0.75;
            this.tbs.setAlpha(1-delta*4);
            this.text.setAlpha(1-delta*4);
        }
    }



    destroy(): void {
        this.text.destroy();
        this.planet.destroy();
        this.red.destroy();
        this.blue.destroy();
        this.tbs.destroy();
        this.tbn.destroy();
    }

    launch(): void {
        this.text.setDepth(1);
        this.blue.setDepth(1);
        this.red.setDepth(1);
        this.planet.setDepth(1);
        this.tbs.setDepth(1);
        this.tbn.setDepth(1);
        this.blue.x = 1600;

        this.scene.add.existing(this.planet);
        this.scene.add.existing(this.blue);
        this.scene.add.existing(this.red);
        this.scene.add.existing(this.tbs);
        this.scene.add.existing(this.tbn);
        this.scene.add.existing(this.text);
    }

    private moveCos(from: number, to: number, delta:number, sprite: Sprite){
        sprite.x = to - Math.cos(delta*Math.PI/2 )*(to - from);
    }

    private moveSin(from: number, to: number, delta:number, sprite: Sprite){
        sprite.x = from + Math.sin(delta*Math.PI/2 )*(to - from);
    }

    private moveLin(from: number, to: number, delta:number, sprite: Sprite){
        sprite.x = from + (to - from) * delta;
    }

    private scaleSin(from: number, to: number, delta:number, sprite: Sprite){

        sprite.setScale( from + Math.sin(delta*Math.PI/2 )*(to - from));
        console.log("Scale: "+sprite.scaleX+" delta: "+delta);
    }

    private scaleCos(from: number, to: number, delta:number, sprite: Sprite){
        sprite.setScale( to - Math.cos(delta*Math.PI/2 )*(to - from));
    }

    private scaleLin(from: number, to: number, delta:number, sprite: Sprite){
        sprite.setScale(from + to * delta);
    }

}