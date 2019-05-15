import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {Player} from "../mechanics/player";

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
    private close: Button;
    private Player2: Player;
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
        const text = this.add.text(160, 50, 'choose Weapon Mod', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        let type = this.scene.get('chooseTypeSceneP2').data.get('type');
        this.Player2 = this.scene.get('MainScene').data.get('P2');
        let drones = this.Player2.getDrones();
        let ship = drones[0];
        this.m0activeExt = ship.getWeapons();
        if(drones.length >= 2){
            let drone1 = drones[1];
            this.m1activeExt = drone1.getWeapons()
        }
        if(drones.length >= 3){
            let drone2 = drones[2];
            this.m2activeExt = drone2.getWeapons()
        }

        if(this.m0activeExt >= 3) {
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                () => {
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(200, 250);
            const shipTL = this.add.text(300, 220, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

        }
        if(this.m0activeExt < 3){
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_space_shuttle",
                ()=>{
                    if(type == true){
                        this.events.emit('shipL');

                    }
                    else {
                        this.events.emit('shipP');

                    }
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(200, 250);
            const shipTL = this.add.text(300, 220, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(type == true){
                const piWext1 = this.add.text(450, 220, 'wextp2m0(l).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext1 = this.add.text(450, 220, 'wextp2m0(p).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }

        if(this.m1activeExt >= 3 || drones.length < 2){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(200, 450);
            if(drones.length < 2){
                const droneTL = this.add.text(300, 420, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
            else{
                const droneTL = this.add.text(300, 420, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }

        }
        if(this.m1activeExt < 3 && drones.length >= 2){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    if(type == true){
                        this.events.emit('drone1L');

                    }
                    else{
                        this.events.emit('drone1P');

                    }
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(200, 450);
            const droneTL = this.add.text(300, 420, 'drone 1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(type == true){
                const piWext2 = this.add.text(450, 420, 'wextp2m1(l).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext2 = this.add.text(450, 420, 'wextp2m1(p).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        if(this.m2activeExt >= 3 || drones.length < 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                    //system.pushSymbol(createWMod)
                });
            if(drones.length < 3){
                const droneT2L = this.add.text(300, 620, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            }
            else{
                const droneT2L = this.add.text(300, 620, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            }
            this.drone2L.setPosition(200, 650)

        }
        if(this.m2activeExt < 3 && drones.length >= 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    if(type == true){
                        this.events.emit('drone2L');

                    }
                    else {
                        this.events.emit('drone2P');

                    }
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(300, 620, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            this.drone2L.setPosition(200, 650)
            if(type == true){
                const piWext3 = this.add.text(450, 620, 'wextp2m2(l).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext3 = this.add.text(450, 620, 'wextp2m2(p).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        this.close = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=> {
                this.scene.sleep()
            });
        this.close.setPosition(200, 850)
        const closeT = this.add.text(300, 820, 'close', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.shipL.updateStep();
            this.drone1L.updateStep();
            this.drone2L.updateStep();
            this.close.updateStep();
            // console.log("Update")
        }
    }

}