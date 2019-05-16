import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {Player} from "../mechanics/player";

export class ShopSceneP2 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private skip: Button;
    private wModule: Button;
    private wExt: Button;
    private shield: Button;
    private armor: Button;
    private background;
    private activeWmods:integer = 3;
    private Player2: Player;
    private firstChoose: boolean;

    constructor(){
        super({
            key: 'ShopSceneP2',
            active: false
        });
        this.firstChoose = true;
    }

    preload(): void{
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void{
        //let system = new PiSystem(this, 1,1, 1, false);
        let system = this.scene.get('MainScene').data.get("system");

        let createShield = (system.add.channelOut('rshieldP2','*' ).nullProcess());
        let createArmor = (system.add.channelOut('rarmorP2','*' ).nullProcess());
        let createWExtShipL = (system.add.channelOut('wext20l','*' ).nullProcess());
        let createWExtShipP = (system.add.channelOut('wext20p','*' ).nullProcess());
        let createWExtDrone1L = (system.add.channelOut('wext21l','*' ).nullProcess());
        let createWExtDrone1P = (system.add.channelOut('wext21p','*' ).nullProcess());
        let createWExtDrone2L = (system.add.channelOut('wext22l','*' ).nullProcess());
        let createWExtDrone2P = (system.add.channelOut('wext22p','*' ).nullProcess());
        let startShop = system.add.replication(system.add.channelIn('shopp2','*').process('ShopP2', this.scene.launch));
        let createWMod = (system.add.channelOut('wmod2','*' ).nullProcess()); //wmod2 for p2

        this.Player2 = this.scene.get('MainScene').data.get('P2');
        this.activeWmods = this.Player2.getNrDrones();
        this.background = this.add.image(-250, 500,"shop_bg");
        const text = this.add.text(160, 50, 'choose action', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        this.armor = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_armor",
            ()=>{
            system.pushSymbol(createArmor)
            });
        this.armor.setPosition(200, 200);
        const energyText = this.add.text(300, 180, "Armor", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        const piArmor = this.add.text(500, 180, 'regArmorP2<*>.O',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )
        const piShield = this.add.text(500, 330, 'regShieldP2<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )
        const piWmod = this.add.text(650, 630, 'wmodP2<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

        this.shield = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_shield",
            ()=>{
            system.pushSymbol(createShield)

            });
        this.shield.setPosition(200, 350);
        const shieldText = this.add.text(300, 330, "Shield", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.wExt = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{
                this.scene.launch('chooseTypeSceneP2');

            });
        this.wExt.setPosition(200, 500);
        const wExtText = this.add.text(300, 480, "Weapon Extension", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        if(this.activeWmods >= 3){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{

                });
            this.wModule.setPosition(200, 650);
            const wModText = this.add.text(300, 630, "max Mods reached", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        }
        if(this.activeWmods < 3){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wmod",
                ()=>{
                    system.pushSymbol(createWMod)

                });
            this.wModule.setPosition(200, 650);
            const wModText = this.add.text(300, 630, "Weapon Module", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        }


        this.skip = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=>{
            this.events.emit("skip")
            });
        this.skip.setPosition(200, 800);
        const skipText = this.add.text(300, 780, "close", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        let choose = this.scene.get('chooseSceneP2');
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