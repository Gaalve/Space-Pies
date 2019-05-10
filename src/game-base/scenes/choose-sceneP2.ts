import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";

export class chooseSceneP2 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private background;
    private shipL: Button;
    private drone1L: Button;
    private drone2L: Button;
    private shipP: Button;
    private drone1P: Button;
    private drone2P: Button;

    private m0activeExt: integer = 0;
    private m1activeExt: integer = 0;
    private m2activeExt: integer = 0;


    constructor(){
        super({
            key: 'chooseSceneP2',
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
        const laser = this.add.text(60, 100, 'Laser', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        const projectile = this.add.text(60, 500, 'Projectile', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2})

        if(this.m0activeExt >= 3){
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(160, 350);
            const shipTL = this.add.text(130, 260, 'max reached', {
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
            this.shipL.setPosition(160, 350);
            const shipTL = this.add.text(130, 260, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m1activeExt >= 3){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(460, 350);
            const droneTL = this.add.text(430, 260, 'max reached', {
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
            this.drone1L.setPosition(460, 350);
            const droneTL = this.add.text(430, 260, 'drone1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m2activeExt >= 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(730, 260, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

            this.drone2L.setPosition(760, 350)

        }

        if(this.m2activeExt < 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    this.events.emit('drone2L');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(730, 260, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

            this.drone2L.setPosition(760, 350)

        }

        if(this.m0activeExt >= 3){
            this.shipP = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_ship",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipP.setPosition(160, 750)
            const shipT = this.add.text(130, 660, 'max reached', {
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
            this.shipP.setPosition(160, 750)
            const shipT = this.add.text(130, 660, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});

        }

        if(this.m1activeExt >= 3){
            this.drone1P = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1P.setPosition(460, 750);
            const droneTP = this.add.text(430, 660, 'max reached', {
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
            this.drone1P.setPosition(460, 750);
            const droneTP = this.add.text(430, 660, 'drone1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});


        }

        if(this.m2activeExt >= 3){
            this.drone2P = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_skip",
                ()=>{
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone2P.setPosition(760, 750);
            const droneT2P = this.add.text(730, 660, 'max reached', {
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
            this.drone2P.setPosition(760, 750);
            const droneT2P = this.add.text(730, 660, 'drone2', {
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