import {Space} from "../mechanics/space/space";
import {SubSceneManager} from "../mechanics/intro/sub-scene-manager";
import Text = Phaser.GameObjects.Text;

export class Intro extends Phaser.Scene {

    private mgr: SubSceneManager;
    private text: Text;
    constructor() {
        super({
            key: "Intro",
            active: true
        })
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        );
        this.load.atlas(
            "parts",
            "assets/atlas/particles/pack.png",
            "assets/atlas/particles/pack.json"
        )
    }

    private fadeText(): void{
        this.text.setAlpha(this.text.alpha - 0.05);
        if(this.text.alpha < 0 )this.text.setAlpha(0);
        else this.time.delayedCall(0, ()=>{this.fadeText()}, [], this);
    }

    create(): void {
        this.scene.launch("GuiScene");
        return;

        let counter = 0;
        this.text = new Text(this, 1900, 20, "Click to skip.", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 32, fontStyle: 'bold', strokeThickness: 2});
        this.text.setShadow(0,2,'#000', 4);
        this.text.setOrigin(1, 0);
        this.text.setDepth(2);
        this.time.delayedCall(4000, ()=>{this.fadeText()}, [], this);
        this.input.on('pointerdown', ()=>{
            switch (counter) {
                case 0: this.text.setText("Are you sure?");
                    this.text.setAlpha(1);
                    this.time.removeAllEvents();
                    this.time.clearPendingEvents();
                    this.time.delayedCall(4000, ()=>{this.fadeText()}, [], this);
                    counter = 1;
                    break;
                case 1: this.text.setText("But are you really sure?!");
                    this.text.setAlpha(1);
                    this.time.removeAllEvents();
                    this.time.clearPendingEvents();
                    this.time.delayedCall(4000, ()=>{this.fadeText()}, [], this);
                    counter = 2;
                    break;
                case 2: this.text.setText("There is no turning back, if you click again!!");
                    this.text.setAlpha(1);
                    this.time.removeAllEvents();
                    this.time.clearPendingEvents();
                    this.time.delayedCall(4000, ()=>{this.fadeText()}, [], this);
                    counter = 3;
                    break;
                case 3: this.text.setText("Oh no! You really skipped the intro... :(");
                    this.text.setAlpha(1);
                    this.time.removeAllEvents();
                    this.time.clearPendingEvents();
                    this.time.delayedCall(4000, ()=>{this.fadeText()}, [], this);
                    counter = 4;
                    this.mgr.skipToLastScene();
                    break;
                case 4: return;
            }
        });
        this.add.existing(this.text);
        this.mgr = new SubSceneManager(this);
    }


    update(time: number, delta: number): void {
        // this.mgr.update(delta/1000);
    }
}
