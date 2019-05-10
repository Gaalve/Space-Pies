import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {chooseSceneP1} from "./choose-sceneP1";

export class ShopSceneP1 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private skip: Button;
    private wModule: Button;
    private wExt: Button;
    private shield: Button;
    private armor: Button;
    private background;
    private activeWmods: integer = 1;


    constructor(){
        super({
            key: 'ShopSceneP1',
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
        let system = new PiSystem(this, 1,1, 1, false);

        let createShield = system.add.channelOut('shield','p1' ).nullProcess();
        let createArmor = system.add.channelOut('armor','p1' ).nullProcess();
        let createWExtShipL = system.add.channelOut('wext10','l' ).nullProcess();
        let createWExtShipP = system.add.channelOut('wext10','p' ).nullProcess();
        let createWExtDrone1L = system.add.channelOut('wext11','l' ).nullProcess();
        let createWExtDrone1P = system.add.channelOut('wext11','p' ).nullProcess();
        let createWExtDrone2L = system.add.channelOut('wext12','l' ).nullProcess();
        let createWExtDrone2P = system.add.channelOut('wext12','p' ).nullProcess();

        let createWMod = system.add.channelOut('wmod1','*' ).nullProcess(); //wmod2 for p2

        // 'pXmYZ' Z = type(l,p)
        // m0 = ship ; m1 = drone1; m2 = drone2
        // max 3 extensions and modules

        this.background = this.add.image(2150, 500,"shop_bg");

        this.armor = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_energy",
            ()=>{
            system.pushSymbol(createArmor)
            });
        this.armor.setPosition(1920-600, 200);

        const energyText = this.add.text(1920-500, 180, "Armor", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        const piArmor = this.add.text(1920-300, 180, 'armor(p1).0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )
        this.shield = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_shield",
            ()=>{
            system.pushSymbol(createShield)
            });
        this.shield.setPosition(1920-600, 350);
        const shieldText = this.add.text(1920-500, 330, "Shield", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.wExt = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{
            this.scene.launch('chooseSceneP1')
            //system.pushSymbol(createWMod)
            });
        this.wExt.setPosition(1920-600, 500);
        const wExtText = this.add.text(1920-500, 480, "Weapon Extension", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        if(this.activeWmods >= 3){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    system.pushSymbol(createWMod)
                });
            this.wModule.setPosition(1920-600, 650);
            const wModText = this.add.text(1920-500, 630, "max Mods reached", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        }

        if(this.activeWmods < 3){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wmod",
                ()=>{
                    system.pushSymbol(createWMod)
                });
            this.wModule.setPosition(1920-600, 650);
            const wModText = this.add.text(1920-500, 630, "Weapon Module", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        }


        this.skip = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
            this.events.emit("skip")
            });
        this.skip.setPosition(1920-600, 800);
        const skipText = this.add.text(1920-500, 780, "close", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        let choose = this.scene.get('chooseSceneP1');
        choose.events.on('shipL', function () {
            system.pushSymbol(createWExtShipL)
        }, this);

        choose.events.on('shipP', function () {
            system.pushSymbol(createWExtShipP)
        }, this);
        choose.events.on('drone1L', function () {
            system.pushSymbol(createWExtDrone1L)
        }, this);
        choose.events.on('drone2L', function () {
            system.pushSymbol(createWExtDrone2L)
        }, this);
        choose.events.on('drone1P', function () {
            system.pushSymbol(createWExtDrone1P)
        }, this);
        choose.events.on('drone2P', function () {
            system.pushSymbol(createWExtDrone2P)
        }, this)
    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.skip.updateStep();
            this.shield.updateStep();
            this.armor.updateStep();
            this.wModule.updateStep();
            this.wExt.updateStep();
            // console.log("Update")
        }
    }


}