import {Button} from "../mechanics/button";

export class ShopScene extends Phaser.Scene{

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
            key: 'ShopScene',
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

        this.background = this.add.image(2200, 500,"shop_bg");

        this.energy = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_energy",
            ()=>{});
        this.energy.setPosition(1920-600, 200);
        const energyText = this.add.text(1920-500, 180, "Energy", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.shield = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_shield",
            ()=>{});
        this.shield.setPosition(1920-600, 350);
        const shieldText = this.add.text(1920-500, 330, "Shield", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.wExt = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{});
        this.wExt.setPosition(1920-600, 500);
        const wExtText = this.add.text(1920-500, 480, "Weapon Extension", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.wModule = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{});
        this.wModule.setPosition(1920-600, 650);
        const wModText = this.add.text(1920-500, 630, "Weapon Module", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        this.skip = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
            this.events.emit("skip")
            });
        this.skip.setPosition(1920-600, 800);
        const skipText = this.add.text(1920-500, 780, "close", {
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