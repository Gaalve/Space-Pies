import {PiAnimFull} from "../mechanics/pianim/pi-anim-full";
import {MainScene} from "./main-scene";
import Text = Phaser.GameObjects.Text;
import Sprite = Phaser.GameObjects.Sprite;
import {Button} from "../mechanics/button";

export class FullPiCalcScene extends Phaser.Scene {

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;
    piAnimFull: PiAnimFull;
    curTexts: Text[];
    curPage: number;
    curMaxY: number;
    background : Sprite;
    scrollBar : Sprite;
    scrolled: number;
    scrollY: number;

    hint: Text;
    close: Button;


    constructor() {
        super({
            key: "FullPiCalcScene",
            active: false
        })
    }

    preload(): void {
    }

    public showPi(){
        this.scene.setVisible(true);
        this.background.setInteractive();
        this.drawPi();
    }

    public closePi(){
        this.scene.resume("MainScene");
        this.scene.setVisible(false);
        this.background.removeInteractive();
        this.reset();
    }

    create(): void {
        this.scene.setVisible(false);
        this.scrollY = 0;
        this.background = this.add.sprite(1920/2, 1080/2, "button_bg");
        this.background.setTint(0);
        this.background.setScale(30);
        this.background.setAlpha(0.8);
        this.background.setDepth(-1);


        let style = {fill: '#fff', fontFamily: '"Roboto"', fontSize: 24};
        this.hint = this.add.text(1600, 50, "Scroll with W, S", style);

        this.close = new Button(this, 1860, 60, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black", 0.95, ()=>{this.closePi()});

        // this.scrollBar = this.add.sprite(1920/2, 1080/2, "pixel8");
        // this.scrollBar.setScale(4, 1080/8);
        // this.scrollBar.setOrigin(1,0);
        // this.scrollBar.setPosition(1920,0);
        // this.scrollBar.setInteractive();
        // this.scrollBar.on('pointermove', ()=>{
        //     if(this.input.mousePointer.isDown){
        //
        //     }
        // });

        this.piAnimFull = (<MainScene>this.scene.get("MainScene")).system.fullAnim;
        this.curTexts = [];
        this.piAnimFull.drawFct = ()=>{
            this.drawPi();
        };
        this.input.keyboard.on('keydown_W', ()=>{this.scrollUp()});
        this.input.keyboard.on('keydown_S', ()=>{this.scrollDown()});
    }

    private drawPi(){
        this.reset();
        if(!this.scene.isVisible())return;
        let y = 50;
        let style = {fill: '#fff', fontFamily: '"Roboto"', fontSize: 16};
        this.piAnimFull.replications.forEach(r=>{
            let maxSize = 150;
            if(r.length>maxSize){
                while(r.length > maxSize) {
                    let idx = r.lastIndexOf('.', maxSize);
                    let sr = r.substr(0, idx);
                    r = '   ' + r.substr(idx);
                    let text = this.add.text(50, y, sr, style);
                    this.curTexts.push(text);
                    y += 24;
                    text.setData("y", y);
                }
            }
            let text = this.add.text(50,y, r, style);
            this.curTexts.push(text);
            y += 24;
            text.setData("y", y);
        });
        this.curMaxY = y;
    }

    public scrollDown(): void{
        this.scroll(this.scrollY-0.01);
    }

    public scrollUp(): void{
        this.scroll(this.scrollY+0.01);
    }

    public scroll(y: number){ //between 0 and 1
        this.scrollY = Math.max(0, Math.min(1, y));
        let toY = (this.curMaxY - 540)*y;
        toY = -Math.max(toY, 0);
        console.log(toY);
        this.curTexts.forEach(t=>t.y = t.data.get("y")+toY);
    }

    reset(): void{
        this.curTexts.forEach(t=>t.destroy());
        this.curTexts = [];
        this.curPage = 0;
        this.curMaxY = 1080;
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;

        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.close.updateStep();
        }
    }
}
