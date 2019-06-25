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

    private player: Player;

    private pulseCounter: number;

    public constructor(scene: Scene, player: Player){
        this.player = player;
        this.star = new Sprite(scene, 960, 540, "neutron");
        this.fg = new Sprite(scene, 960, 540, "neutron_fg");

        this.warn = new Sprite(scene, 960, 300, "warning");
        this.pixel = new Sprite(scene, 960, 540, "pixel8");

        this.bg1 = new RotatingSprite(scene,"neutron_bg1", 960, 540, 2700);
        this.bg2 = new RotatingSprite(scene,"neutron_bg2", 960, 540, -2800);
        this.pulseCounter = 0;

        scene.add.existing(this.bg1);
        scene.add.existing(this.bg2);
        scene.add.existing(this.star);
        scene.add.existing(this.fg);

        scene.add.existing(this.warn);
        scene.add.existing(this.pixel);

        this.fg.setTint(0x2eceff);

        this.pixel.setTint(0xDD1111);
        this.pixel.setScale(300);

        this.pixel.setDepth(14);
        this.warn.setDepth(14);
    }




    public update(delta: number): void{
        this.player.neutronParticles.emit();
        if(Math.random() < 0.006){
            if(Math.random() < 0.5)
                this.player.neutronTurb.impactAt(Math.random()*70 + 300, Math.random()*70 + 540,
                    0.5, 1.5, Math.random()*360);
            else
                this.player.neutronTurb.impactAt(Math.random()*70 + 1620, Math.random()*70 + 540,
                    0.5, 1.5, Math.random()*360);
        }

        this.bg1.update(delta);
        this.bg2.update(delta);
        this.pulseCounter += delta/1321;
        this.pulseCounter %= Math.PI * 2;

        this.warn.setAlpha(Math.cos(this.pulseCounter*5) * 0.5 + 0.5);
        this.pixel.setAlpha(Math.cos(this.pulseCounter*3) * 0.12 + 0.12);

        this.star.setScale(Math.cos(this.pulseCounter*2) * 0.02 + 0.98);
        this.fg.setScale(Math.cos(this.pulseCounter) * 0.1 + 0.9);

        this.fg.setAlpha(0.75);
        this.fg.setTint(
            Color.ObjectToColor(Color.Interpolate.RGBWithRGB(42, 127, 255,
                42, 212, 255, 2, Math.sin(this.pulseCounter) + 1)).color)
    }
}