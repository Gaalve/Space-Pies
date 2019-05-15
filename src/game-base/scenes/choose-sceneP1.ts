import {Button} from "../mechanics/button";
export class chooseSceneP1 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private background;
    private shipL: Button;
    private drone1L: Button;
    private drone2L: Button;
    private shipP: Button;
    private drone1P: Button;
    private drone2P: Button;
    //private activeMod: integer;
    private m0activeExt : integer = 0;
    private m1activeExt: integer = 0;
    private m2activeExt: integer = 0;

    constructor(){
        super({
            key: 'chooseSceneP1',
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
        /*let system = new PiSystem(this, 1,1, 1, false);

        let createShield = system.add.channelOut('shield','p1' ).nullProcess();
        let createArmor = system.add.channelOut('armor','p1' ).nullProcess();
        let createWExtShipL = system.add.channelOut('wExt','p1m0l' ).nullProcess();
        let createWExtShipP = system.add.channelOut('wExt','p1m0p' ).nullProcess();
        let createWExtDrone1L = system.add.channelOut('wExt','p1m1l' ).nullProcess();
        let createWExtDrone1P = system.add.channelOut('wExt','p1m1p' ).nullProcess();
        let createWExtDrone2L = system.add.channelOut('wExt','p1m2l' ).nullProcess();
        let createWExtDrone2P = system.add.channelOut('wExt','p1m2p' ).nullProcess();

        let createWMod = system.add.channelOut('wMod','p1' ).nullProcess();*/

        this.background = this.add.image(2150, 500,"shop_bg");
        const text = this.add.text(1920-600, 50, 'choose Weapon Mod', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        if(this.m0activeExt >= 3) {
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                () => {
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-600, 350);
            const shipTL = this.add.text(1920-500, 320, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

        }
        if(this.m0activeExt < 3){
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('shipL');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-600, 350);
            const shipTL = this.add.text(1920-500, 320, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

        }

        if(this.m1activeExt >= 3){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-600, 550);
            const droneTL = this.add.text(1920-500, 520, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

        }
        if(this.m1activeExt < 3){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('drone1L');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-600, 550);
            const droneTL = this.add.text(1920-500, 520, 'drone 1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

        }
        if(this.m2activeExt >= 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(1920-500, 720, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            this.drone2L.setPosition(1920-600, 750)

        }
        if(this.m2activeExt < 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('drone2L');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(1920-500, 720, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            this.drone2L.setPosition(1920-600, 750)

        }


    }
    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.shipL.updateStep();
            this.drone1L.updateStep();
            this.drone2L.updateStep();
            // console.log("Update")
        }
    }

}