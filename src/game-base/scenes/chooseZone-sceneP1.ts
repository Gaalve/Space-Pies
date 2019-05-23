import {Button} from "../mechanics/button";
import {Player} from "../mechanics/player";

export class ChooseZoneSceneP1 extends Phaser.Scene {
    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000 / 60;
    private zone1: Button;
    private zone2: Button;
    private zone3: Button;
    private zone4: Button;
    private Player: Player;
    private background;

    constructor() {
        super({
            key: 'chooseZoneSceneP1',
            active: false
        });
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void {
        this.background = this.add.image(1120, 540,"shop_bg");
        this.background.setOrigin(0,0.5);
        this.background.setTint(0x782121);
        this.Player = this.scene.get("MainScene").data.get("P1");
        let choose = this.scene.get("ShopSceneP1");
        const text1 = this.add.text(1920-650, 50, 'choose hitzone', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})
        this.zone1 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_las",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ1");
                }
                else{
                    this.events.emit("shieldZ1");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP1')

            });
        this.zone1.setPosition(1920-600, 250);

        this.zone2 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_pro",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ2");
                }
                else{
                    this.events.emit("shieldZ2");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP1')
            });
        this.zone2.setPosition(1920-600, 450);

        this.zone3 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_rock",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ3");
                }
                else{
                    this.events.emit("shieldZ3");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP1')
            });
        this.zone3.setPosition(1920-600, 650);
        this.zone4 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_rock",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ4");
                }
                else{
                    this.events.emit("shieldZ4");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP1')

            });
        this.zone4.setPosition(1920-600, 850);
        const zone1T = this.add.text(1920-500, 220, 'Hitzone 1', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        const zone2T = this.add.text(1920-500, 420, 'Hitzone 2', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        const zone3T = this.add.text(1920-500, 620, 'Hitzone 3', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2})
        const zone4T = this.add.text(1920-500, 820, 'Hitzone 4', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2})

    }
    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.zone1.updateStep();
            this.zone2.updateStep();
            this.zone3.updateStep();
            this.zone4.updateStep();

            // console.log("Update")
        }
    }
}