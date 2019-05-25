
import {SubScene} from "../sub-scene";
import Sprite = Phaser.GameObjects.Sprite;
import Text = Phaser.GameObjects.Text;

export class LoreScene extends SubScene{

    planet: Sprite;
    blue: Sprite;
    red: Sprite;
    tbs: Sprite;
    tbn: Sprite;

    text: Text;

    constructor(scene: Phaser.Scene) {
        super(scene, 5, 1, 2.5);
        this.skipInTransition = false;
        this.skipOutTransition = true;
        this.planet = new Sprite(scene, -1000, 540, 'atlas', "intro_planet");
        this.blue = new Sprite(scene, -1000, 540, 'atlas', "ssb_ship_on");
        this.red = new Sprite(scene, -1000, 540, 'atlas', "ssr_ship_on");
        this.tbs = new Sprite(scene, -1000, 540, 'atlas', "intro_textbox_scream");
        this.tbn = new Sprite(scene, -1000, 540, 'atlas', "intro_textbox_normal");
        this.red.setFlipX(true);

        this.text = new Text(scene, -1920/2, 1080/2 + 200, "OLAF!", {
            fill: '#222', fontFamily: '"Roboto"', fontSize: 64, fontStyle: 'bold', strokeThickness: 2,
            stroke: '#222'});
        //this.text.setShadow(0,6,'#000', 10);
        this.text.setOrigin(0.5, 0.5);
    }

    subIntro(delta: number): void {
        this.moveLin(-200, 900, delta, this.planet);
    }

    subOutro(delta: number): void {
        this.moveLin(1450, 1670, delta, this.planet);
    }

    subScene(delta: number): void {
        this.moveLin(900, 1450, delta, this.planet);
        this.scaleSin(0, 1, delta, this.red);
        this.moveCos(960, -500, delta, this.red);
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

        this.scene.add.existing(this.text);
        this.scene.add.existing(this.planet);
        this.scene.add.existing(this.blue);
        this.scene.add.existing(this.red);
        this.scene.add.existing(this.tbs);
        this.scene.add.existing(this.tbn);
    }

    private moveCos(from: number, to: number, delta:number, sprite: Sprite){
        sprite.x = to - Math.cos(delta*Math.PI/2 )*(to - from);
        if(this.planet == sprite)console.log(sprite.x+ ' delta: '+delta);
    }

    private moveSin(from: number, to: number, delta:number, sprite: Sprite){
        sprite.x = from + Math.sin(delta*Math.PI/2 )*(to - from);
    }

    private moveLin(from: number, to: number, delta:number, sprite: Sprite){
        sprite.x = from + (to - from) * delta;
    }

    private scaleSin(from: number, to: number, delta:number, sprite: Sprite){
        sprite.setScale( from + Math.sin(delta*Math.PI/2 )*(to - from));
    }

    private scaleCos(from: number, to: number, delta:number, sprite: Sprite){
        sprite.setScale( to - Math.cos(delta*Math.PI/2 )*(to - from));
    }

    private scaleLin(from: number, to: number, delta:number, sprite: Sprite){
        sprite.setScale(from + to * delta);
    }

}