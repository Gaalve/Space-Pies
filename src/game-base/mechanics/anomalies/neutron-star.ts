import Scene = Phaser.Scene;
import {Player} from "../player";
import Sprite = Phaser.GameObjects.Sprite;
import {RotatingSprite} from "./rotating-sprite";
import Color = Phaser.Display.Color;


export class NeutronStar {
    private star: Sprite;
    private fg: Sprite;
    private bg1: RotatingSprite;
    private bg2: RotatingSprite;

    private warn: Sprite;
    private pixel: Sprite;

    private player1: Player;
    private player2: Player;

    private pulseCounter: number;

    private popInCounter: number;
    private popInMaxCounter: number;

    public constructor(scene: Scene, player1: Player, player2: Player){
        this.player1 = player1;
        this.player2 = player2;
        this.star = new Sprite(scene, 960, 540, "neutron");
        this.fg = new Sprite(scene, 960, 540, "neutron_fg");

        this.warn = new Sprite(scene, 960, 300, "warning");
        this.pixel = new Sprite(scene, 960, 540, "pixel8");

        this.bg1 = new RotatingSprite(scene,"neutron_bg1", 960, 540, 2700);
        this.bg2 = new RotatingSprite(scene,"neutron_bg2", 960, 540, -2800);
        this.pulseCounter = 0;

        this.popInCounter = 0;
        this.popInMaxCounter = 3000;

        scene.add.existing(this.bg1);
        scene.add.existing(this.bg2);
        scene.add.existing(this.star);
        scene.add.existing(this.fg);

        scene.add.existing(this.warn);
        scene.add.existing(this.pixel);

        this.fg.setTint(0x2eceff);

        this.pixel.setTint(0xDD1111);
        this.pixel.setScale(300);


        this.bg1.setDepth(-1);
        this.bg2.setDepth(-1);
        this.fg.setDepth(-1);
        this.star.setDepth(-1);

        this.pixel.setDepth(14);
        this.warn.setDepth(14);
        this.pixel.setAlpha(0);
        this.warn.setAlpha(0);
        this.fg.setAlpha(0.75);
    }




    public update(delta: number): void{
        this.player1.neutronParticles.emit();


        if (this.popInCounter < this.popInMaxCounter){
            this.bg1.setScale(this.popInCounter / this.popInMaxCounter);
            this.bg2.setScale(this.popInCounter / this.popInMaxCounter);
            this.fg.setScale(this.popInCounter / this.popInMaxCounter);
            this.star.setScale(this.popInCounter / this.popInMaxCounter);
            this.popInCounter += delta;
            if (this.popInCounter >= this.popInMaxCounter){
                this.bg1.setScale(1);
                this.bg2.setScale(1);
                this.fg.setScale(1);
                this.star.setScale(1);
            }
            return;
        }

        if(Math.random() < 0.006){
            if(Math.random() < 0.5)
                this.player1.neutronTurb.impactAt(Math.random()*70 + this.player1.ship.posX, Math.random()*70 + this.player1.ship.posY,
                    0.5, 1.5, Math.random()*360);
            else
                this.player2.neutronTurb.impactAt(Math.random()*70 + this.player2.ship.posX, Math.random()*70 + this.player2.ship.posY,
                    0.5, 1.5, Math.random()*360);
        }

        this.bg1.update(delta);
        this.bg2.update(delta);
        this.pulseCounter += delta/1321;
        this.pulseCounter %= Math.PI * 2;

        this.warn.setAlpha(Math.cos(this.pulseCounter*5) * -0.5 + 0.5);
        this.pixel.setAlpha(Math.cos(this.pulseCounter*3) * -0.12 + 0.12);

        this.star.setScale(Math.cos(this.pulseCounter*2) * 0.02 + 0.98);
        this.fg.setScale(Math.cos(this.pulseCounter) * 0.1 + 0.9);


        this.fg.setTint(
            Color.ObjectToColor(Color.Interpolate.RGBWithRGB(42, 127, 255,
                42, 212, 255, 2, Math.sin(this.pulseCounter) + 1)).color)
    }
}