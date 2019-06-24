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
    private comets: RotatingSprite;

    private player: Player;

    private pulseCounter: number;

    public constructor(scene: Scene, player: Player){
        this.player = player;
        this.star = new Sprite(scene, 960, 540, "neutron");
        this.fg = new Sprite(scene, 960, 540, "neutron_fg");
        this.bg1 = new RotatingSprite(scene,"neutron_bg1", 960, 540, 2700);
        this.bg2 = new RotatingSprite(scene,"neutron_bg2", 960, 540, -2800);
        this.comets = new RotatingSprite(scene,"neutron_comets", 960, 540, 10000);
        this.pulseCounter = 0;

        scene.add.existing(this.comets);
        scene.add.existing(this.bg1);
        scene.add.existing(this.bg2);
        scene.add.existing(this.star);
        scene.add.existing(this.fg);
        this.fg.setTint(0x2eceff);

    }




    public update(delta: number): void{
        this.bg1.update(delta);
        this.bg2.update(delta);
        this.comets.update(delta);
        this.pulseCounter += delta/1321;
        this.pulseCounter %= Math.PI * 2;

        this.fg.setScale(Math.cos(this.pulseCounter) * 0.1 + 0.9);

        this.fg.setTint(
            Color.ObjectToColor(Color.Interpolate.RGBWithRGB(42, 127, 255,
                42, 212, 255, 2, Math.sin(this.pulseCounter) + 1)).color)
    }
}