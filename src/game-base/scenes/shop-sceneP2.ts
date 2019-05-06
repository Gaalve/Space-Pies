import {Button} from "../mechanics/button";

export class ShopSceneP2 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private skip: Button;
    private wModule: Button;
    private wExt: Button;
    private shield: Button;
    private energy: Button;
    private background;

    constructor(){
        super({
            key: 'ShopSceneP2',
            active: false
        })
    }

    preload(): void{
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void{

        this.background = this.add.image(-250, 500,"shop_bg");

        this.energy = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_energy",
            ()=>{});
        this.energy.setPosition(200, 200);
        const energyText = this.add.text(300, 180, "Energy", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.shield = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_shield",
            ()=>{});
        this.shield.setPosition(200, 350);
        const shieldText = this.add.text(300, 330, "Shield", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.wExt = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{});
        this.wExt.setPosition(200, 500);
        const wExtText = this.add.text(300, 480, "Weapon Extension", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.wModule = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{});
        this.wModule.setPosition(200, 650);
        const wModText = this.add.text(300, 630, "Weapon Module", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.skip = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
            this.events.emit("skip")
            });
        this.skip.setPosition(200, 800);
        const skipText = this.add.text(300, 780, "close", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.skip.updateStep();
            this.shield.updateStep();
            this.energy.updateStep();
            this.wModule.updateStep();
            this.wExt.updateStep();
            // console.log("Update")
        }
    }


}