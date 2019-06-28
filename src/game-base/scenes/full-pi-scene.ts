import {Space} from "../mechanics/space/space";
import Sprite = Phaser.GameObjects.Sprite;
import rexUI from '../rexPlugins/plugins/dist/rexuiplugin.min.js';
import GeometryMask = Phaser.Display.Masks.GeometryMask;
import Graphics = Phaser.GameObjects.Graphics;
import {PiSystem} from "../mechanics/picalc/pi-system";
import {split} from "ts-node";
import Pointer = Phaser.Input.Pointer;


export class FullPiScene extends Phaser.Scene {
    //
    // private timeAccumulator = 0.0;
    // private timeUpdateTick = 1000/30;

    public background: Sprite;
    public mask1: Phaser.Display.Masks.GeometryMask;
    public mask2: Phaser.Display.Masks.GeometryMask;
    public mask3: Phaser.Display.Masks.GeometryMask;
    public piSystem: PiSystem;
    public fullPiText1: Phaser.GameObjects.Text;
    public fullPiText2: Phaser.GameObjects.Text;
    public fullPiText3: Phaser.GameObjects.Text;
    public fullPiCache1: Array<string> = new Array<string>();
    public fullPiCache2: Array<string> = new Array<string>();
    public fullPiCache3: Array<string> = new Array<string>();
    public resetButton: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: "FullPiScene",
            active: false
        })
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void {
        this.background = this.add.sprite(1920/2,1080/2,"fullpiscreen");
        this.background.setAlpha(0.9);
        this.resetButton = this.add.sprite(1775, 910, "resetbutton");

        this.piSystem = this.data.get("system");

        let maskArea1 = new Graphics(this);
        maskArea1.fillRect(200, 150,500,775);

        let maskArea2 = new Graphics(this);
        maskArea2.fillRect(700, 150,500,775);

        let maskArea3 = new Graphics(this);
        maskArea3.fillRect(1200, 150,500,775);

        this.mask1 = new GeometryMask(this,maskArea1)
        this.mask2 = new GeometryMask(this,maskArea2)
        this.mask3 = new GeometryMask(this,maskArea3)

        this.fullPiText1 = this.add.text(250,200, "");
        this.fullPiText1.setMask(this.mask1);
        this.fullPiText1.setWordWrapWidth(500, true);

        this.fullPiText2 = this.add.text(750,200, "");
        this.fullPiText2.setMask(this.mask2);
        this.fullPiText2.setWordWrapWidth(500, true);

        this.fullPiText3 = this.add.text(1250,200, "");
        this.fullPiText3.setMask(this.mask3);
        this.fullPiText3.setWordWrapWidth(500, true);

        let fp1 = this.fullPiText1;
        let fp2 = this.fullPiText2;
        let fp3 = this.fullPiText3;

        this.resetButton.setInteractive();
        this.resetButton.on("pointerdown", () => {
            fp1.x = 250; fp1.y = 200;
            fp2.x = 750; fp2.y = 200;
            fp3.x = 1250; fp3.y = 200;
        })

        this.setMouseMoveListener(this.background)
        let scene = this;
        this.input.keyboard.on('keydown-' + 'E', function (event) {
            let piScene = scene
            piScene.fullPiText1.y =  piScene.fullPiText1.y - 100;
            piScene.fullPiText2.y =  piScene.fullPiText2.y - 100;
            piScene.fullPiText3.y =  piScene.fullPiText3.y - 100;
            for ( let i = 0; i < 15 && i < scene.fullPiCache1.length; i++)
                piScene.addToPiOutput1(piScene.fullPiCache1.shift(), true);
            for ( let i = 0; i < 15 && i < scene.fullPiCache2.length; i++)
                piScene.addToPiOutput2(piScene.fullPiCache2.shift(), true);
            for ( let i = 0; i < 15 && i < scene.fullPiCache3.length; i++)
                piScene.addToPiOutput3(piScene.fullPiCache3.shift(), true);
        });
        this.input.keyboard.on('keyup-' + 'E', function (event) {
            let piScene = scene

        });

        this.input.keyboard.on('keydown-' + 'Q', function (event) {
            let piScene = scene
            piScene.fullPiText1.y =  piScene.fullPiText1.y + 100;
            piScene.fullPiText2.y =  piScene.fullPiText2.y + 100;
            piScene.fullPiText3.y =  piScene.fullPiText3.y + 100;
            for ( let i = 0; i < 15 && i < scene.fullPiCache1.length; i++)
                piScene.addToPiOutput1(piScene.fullPiCache1.shift(), true);
            for ( let i = 0; i < 15 && i < scene.fullPiCache2.length; i++)
                piScene.addToPiOutput2(piScene.fullPiCache2.shift(), true);
            for ( let i = 0; i < 15 && i < scene.fullPiCache3.length; i++)
                piScene.addToPiOutput3(piScene.fullPiCache3.shift(), true);
        });
        this.input.keyboard.on('keyup-' + 'Q', function (event) {
            let piScene = scene

        });



    }

    private setMouseMoveListener(object: Phaser.GameObjects.Sprite)
    {
        object.setInteractive({ draggable: true });
        this.input.setDraggable(object);
        object.input.draggable = true;

        // let lastX, lastY;
        let fullPiText1 = this.fullPiText1;
        let fullPiText2 = this.fullPiText2;
        let fullPiText3 = this.fullPiText3;
    }

    addToPiOutput1(string : String, scrollAction? : Boolean)
    {
        if (!string)
            return;
        let wordWrappedString = this.fullPiText1.runWordWrap(string.toString());
        if (this.fullPiText1.height > 700 && !scrollAction)
            this.fullPiCache1.length > 50 ? this.fullPiCache1 = new Array<string>() : this.fullPiCache1.push(wordWrappedString);
        else
            this.fullPiText1.setText(this.fullPiText1.text + wordWrappedString + "\n\n");
    }

    addToPiOutput2(string : String, scrollAction? : Boolean)
    {
        if (!string)
            return;
        let wordWrappedString = this.fullPiText2.runWordWrap(string.toString());
        if (this.fullPiText2.height > 700 && !scrollAction)
            this.fullPiCache2.length > 50 ? this.fullPiCache2 = new Array<string>() : this.fullPiCache2.push(wordWrappedString);

        else
            this.fullPiText2.setText(this.fullPiText2.text + wordWrappedString + "\n\n");
    }

    addToPiOutput3(string : String, scrollAction? : Boolean)
    {
        if (!string)
            return;
        let wordWrappedString = this.fullPiText3.runWordWrap(string.toString());
        if (this.fullPiText3.height > 700 && !scrollAction)
            this.fullPiCache3.length > 50 ? this.fullPiCache3 = new Array<string>() : this.fullPiCache3.push(wordWrappedString);

        else
            this.fullPiText3.setText(this.fullPiText3.text + wordWrappedString + "\n\n");
    }



    update(time: number, delta: number): void {
        if (this.game.input.activePointer.isDown)
            this.scrollText(this.game.input.activePointer);
    }

    private scrollText(pointer: Pointer)
    {
        if (pointer.y < 300)
        {
            this.fullPiText1.y =  this.fullPiText1.y - 800;
            this.fullPiText2.y =  this.fullPiText2.y - 800;
            this.fullPiText3.y =  this.fullPiText3.y - 800;
            for ( let i = 0; i < 30 && i < this.fullPiCache1.length; i++)
                this.addToPiOutput1(this.fullPiCache1.shift(), true);
            for ( let i = 0; i < 30 && i < this.fullPiCache2.length; i++)
                this.addToPiOutput2(this.fullPiCache2.shift(), true);
            for ( let i = 0; i < 30 && i < this.fullPiCache3.length; i++)
                this.addToPiOutput3(this.fullPiCache3.shift(), true);
            return;
        }
        if (pointer.y > 750)
        {
            this.fullPiText1.y =  this.fullPiText1.y + 800;
            this.fullPiText2.y =  this.fullPiText2.y + 800;
            this.fullPiText3.y =  this.fullPiText3.y + 800;



            return;
        }
    }


}


