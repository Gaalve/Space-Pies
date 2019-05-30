import {Button} from "../mechanics/button";
import {Player} from "../mechanics/player";

export class ChooseZoneSceneP2 extends Phaser.Scene {
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
            key: 'chooseZoneSceneP2',
            active: false
        });
    }

    preload(): void {
        // this.load.pack(
        //     "preload",
        //     "assets/pack.json",
        //     "preload"
        // )
    }

    create(): void {
        this.background = this.add.image(0, 540,"shop_bg");
        this.background.setOrigin(0, 0.5);
        this.background.setFlipX(true);
        this.background.setTint(0x214478);
        this.Player = this.scene.get("MainScene").data.get("P2");
        let choose = this.scene.get("ShopSceneP2");
        const text1 = this.add.text(160, 50, 'choose hitzone', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})
        this.zone1 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ1");
                }
                else{
                    this.events.emit("shieldZ1");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP2')

            });
        this.zone1.setPosition(200, 250);

        this.zone2 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ2");
                }
                else{
                    this.events.emit("shieldZ2");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP2')
            });
        this.zone2.setPosition(200, 450);

        this.zone3 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ3");
                }
                else{
                    this.events.emit("shieldZ3");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP2')
            });
        this.zone3.setPosition(200, 650);
        this.zone4 = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(choose.data.get("type") == "armor"){
                    this.events.emit("armorZ4");
                }
                else{
                    this.events.emit("shieldZ4");
                }
                this.Player.payEnergy(this.Player.getEnergyCost());
                this.scene.sleep();
                this.scene.run('ShopSceneP2')

            });
        this.zone4.setPosition(200, 850);
        const zone1T = this.add.text(300, 220, 'Hitzone 1', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        const zone2T = this.add.text(300, 420, 'Hitzone 2', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        const zone3T = this.add.text(300, 620, 'Hitzone 3', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2})
        const zone4T = this.add.text(300, 820, 'Hitzone 4', {
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