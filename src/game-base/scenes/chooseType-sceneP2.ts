import {Button} from "../mechanics/button";
import {chooseSceneP1} from "./choose-sceneP1";
import first = Phaser.Display.Canvas.CanvasPool.first;

export class ChooseTypeSceneP2 extends Phaser.Scene {
    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000 / 60;
    private laser: Button;
    private projectile: Button;
    private rocket: Button;
    private first: boolean;
    private background;

    constructor() {
        super({
            key: 'chooseTypeSceneP2',
            active: false
        });
        this.first = true;
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void {

        this.background = this.add.image(-250, 500,"shop_bg");
        this.background = this.add.image(0, 540,"shop_bg");
        this.background.setOrigin(0, 0.5);
        this.background.setFlipX(true);
        this.background.setTint(0x214478);
        this.laser = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "ssb_weap_las",
            () => {
                this.data.set('type', "las");
                this.scene.sleep();
                this.scene.run('chooseSceneP2')

                //system.pushSymbol(createWMod)
            });
        this.laser.setPosition(200, 300)

        this.projectile = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "ssb_weap_pro",
            () => {
                this.data.set("type", "pro");
                this.scene.sleep();
                this.scene.run('chooseSceneP2')


                //system.pushSymbol(createWMod)
            });
        this.projectile.setPosition(200, 500);

        this.rocket = new Button(this, 200, 700, "button_shadow",
            "button_bg", "button_fg", "ssb_weap_rock",
            () => {
                this.data.set("type", "rock");
                this.scene.sleep();
                this.scene.run('chooseSceneP2');

                //system.pushSymbol(createWMod)
            });
        const laserT = this.add.text(300, 270, 'Laser', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        const projectileT = this.add.text(300, 470, 'Projectile', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2})
        const rocketT = this.add.text(300, 670, 'Rocket', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2})

        const text = this.add.text(160, 50, 'choose Weapon Type', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})



    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.laser.updateStep();
            this.projectile.updateStep();
            this.rocket.updateStep();
            // console.log("Update")
        }
    }
}