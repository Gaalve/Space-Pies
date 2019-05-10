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
        const laser = this.add.text(1920-800, 100, 'Laser', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        const projectile = this.add.text(1920-800, 500, 'Projectile', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2})
        if(this.m0activeExt >= 3) {
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                () => {
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-700, 350);
            const shipTL = this.add.text(1920-730, 260, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }
        if(this.m0activeExt < 3){
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('shipL');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-700, 350);
            const shipTL = this.add.text(1920-730, 260, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m1activeExt >= 3){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-400, 350);
            const droneTL = this.add.text(1920-430, 260, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }
        if(this.m1activeExt < 3){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('drone1L');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-400, 350);
            const droneTL = this.add.text(1920-430, 260, 'drone1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }
        if(this.m2activeExt >= 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(1920-130, 260, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

            this.drone2L.setPosition(1920-100, 350)

        }
        if(this.m2activeExt < 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('drone2L');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(1920-130, 260, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

            this.drone2L.setPosition(1920-100, 350)

        }

        if(this.m0activeExt >= 3){
            this.shipP = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipP.setPosition(1920-700, 750)
            const shipT = this.add.text(1920-730, 660, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m0activeExt < 3){
            this.shipP = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('shipP');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipP.setPosition(1920-700, 750)
            const shipT = this.add.text(1920-730, 660, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m1activeExt >= 3){
            this.drone1P = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1P.setPosition(1920-400, 750);
            const droneTP = this.add.text(1920-430, 660, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }
        if(this.m1activeExt < 3){
            this.drone1P = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('drone1P');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1P.setPosition(1920-400, 750);
            const droneTP = this.add.text(1920-430, 660, 'drone1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m2activeExt >= 3){
            this.drone2P = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone2P.setPosition(1920-100, 750);
            const droneT2P = this.add.text(1920-130, 660, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m2activeExt < 3){
            this.drone2P = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('drone2P');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone2P.setPosition(1920-100, 750);
            const droneT2P = this.add.text(1920-130, 660, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

    }
    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.shipL.updateStep();
            this.shipP.updateStep();
            this.drone1P.updateStep();
            this.drone2P.updateStep();
            this.drone1L.updateStep();
            this.drone2L.updateStep();
            // console.log("Update")
        }
    }

}