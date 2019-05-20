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
    private maxReached0: boolean;
    private maxReached1: boolean;
    private maxReached2: boolean;
    private type: boolean;
    private shipTL: Phaser.GameObjects.Text;
    private droneTL: Phaser.GameObjects.Text;
    private droneT2L: Phaser.GameObjects.Text;



    constructor(){
        super({
            key: 'chooseSceneP2',
            active: false
        });
        this.maxReached0 = false;
        this.maxReached1 = false;
        this.maxReached2 = false;
    }

    preload(): void{
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void{

        this.background = this.add.image(0, 540,"shop_bg");
        this.background.setOrigin(0, 0.5);
        this.background.setFlipX(true);
        this.background.setTint(0x214478);
        const text = this.add.text(160, 50, 'choose Weapon Mod', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        this.type = this.scene.get('chooseTypeSceneP2').data.get('type');
        let type = this.type
        this.Player2 = this.scene.get('MainScene').data.get('P2');
        let drones = this.Player2.getDrones();
        let droneNr = this.Player2.getNrDrones();
        let ship = drones[0];
        this.m0activeExt = ship.getNrWeapons();
        if(droneNr >= 2){
            let drone1 = drones[1];
            this.m1activeExt = drone1.getNrWeapons()
        }
        if(droneNr >= 3){
            let drone2 = drones[2];
            this.m2activeExt = drone2.getNrWeapons();
        }

        if(this.m0activeExt >= 3) {
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                () => {
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(200, 250);
            this.shipTL = this.add.text(300, 220, 'max reached', {
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
                    this.m0activeExt++;
                    this.scene.sleep()
                    this.scene.run("ShopSceneP2");
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(200, 250);
            this.shipTL = this.add.text(300, 220, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(type == true){
                const piWext1 = this.add.text(450, 200, 'wextp2m0l(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext1 = this.add.text(450, 200, 'wextp2m0p(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }

        if(this.m1activeExt >= 3 || droneNr < 2){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(200, 450);
            if(droneNr < 2){
                this.maxReached1 = true;
                this.m1activeExt = 3;
                this.droneTL = this.add.text(300, 420, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
            else{
                this.droneTL = this.add.text(300, 420, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }

        }
        if(this.m1activeExt < 3 && droneNr >= 2){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    if(type == true){
                        this.events.emit('drone1L');

                    }
                    else{
                        this.events.emit('drone1P');

                    }
                    this.m1activeExt++;
                    this.scene.sleep()
                    this.scene.run("ShopSceneP2");
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(200, 450);
            this.droneTL = this.add.text(300, 420, 'drone 1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(type == true){
                const piWext2 = this.add.text(450, 400, 'wextp2m1l(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext2 = this.add.text(450, 400, 'wextp2m1p(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        if(this.m2activeExt >= 3 || droneNr < 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                    //system.pushSymbol(createWMod)
                });
            if(droneNr < 3){
                this.maxReached2 = true;
                this.m2activeExt = 3;
                this.droneT2L = this.add.text(300, 620, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            }
            else{
                this.droneT2L = this.add.text(300, 620, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            }
            this.drone2L.setPosition(200, 650)

        }
        if(this.m2activeExt < 3 && droneNr >= 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    if(type == true){
                        this.events.emit('drone2L');

                    }
                    else {
                        this.events.emit('drone2P');

                    }
                    this.m2activeExt++;
                    this.scene.sleep()
                    this.scene.run("ShopSceneP2");
                    //system.pushSymbol(createWMod)
                });
            this.droneT2L = this.add.text(300, 620, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            this.drone2L.setPosition(200, 650)
            if(type == true){
                const piWext3 = this.add.text(450, 620, 'wextp2m2l(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext3 = this.add.text(450, 620, 'wextp2m2p(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        this.close = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=> {
                this.scene.sleep()
                this.scene.run("ShopSceneP2");
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

            let drones = this.Player2.getDrones();
            let droneNr = this.Player2.getNrDrones();
            let ship = drones[0];
            this.m0activeExt = ship.getNrWeapons();
            if(droneNr >= 2){
                let drone1 = drones[1];
                this.m1activeExt = drone1.getNrWeapons()
            }
            if(droneNr >= 3){
                let drone2 = drones[2];
                this.m2activeExt = drone2.getNrWeapons();
            }

            if(this.m0activeExt >= 3 && !this.maxReached0){
                this.maxReached0 = true;
                this.shipL.changeButton(this,200, 250, "button_cancel_red", ()=>{

                } );
                this.children.remove(this.shipTL);
                this.shipTL = this.add.text(300, 220, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }
            if(this.m0activeExt < 3 && this.maxReached0){
                this.maxReached0 = false;
                this.shipL.changeButton(this,200, 250, "button_space_shuttle", ()=>{
                    if(this.type == true){
                        this.events.emit('shipL');
                    }
                    else{
                        this.events.emit('shipP');
                    }
                    this.m0activeExt++;
                    this.scene.sleep()
                    this.scene.run("ShopSceneP2")
                    //system.pushSymbol(createWMod)
                });
                this.children.remove(this.shipTL);
                this.shipTL = this.add.text(300, 220, 'ship', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }
            if(this.m1activeExt >= 3 && !this.maxReached1){
                this.maxReached1 = true;
                this.drone1L.changeButton(this,200, 450, "button_cancel_red", ()=>{

                } );
                this.children.remove(this.droneTL);
                this.droneTL = this.add.text(300, 420, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }
            if(this.m1activeExt < 3 && this.maxReached1){
                this.maxReached1 = false;
                this.drone1L.changeButton(this,200, 450, "button_wext", ()=>{
                    if(this.type == true){
                        this.events.emit('drone1L');
                    }
                    else{
                        this.events.emit('drone1P');
                    }
                    this.m1activeExt++;
                    this.scene.sleep()
                    this.scene.run("ShopSceneP2")
                    //system.pushSymbol(createWMod)
                });
                this.children.remove(this.droneTL);
                this.droneTL = this.add.text(300, 420, 'drone1', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }

            if(this.m2activeExt >= 3 && !this.maxReached2){
                this.maxReached2 = true;
                this.drone2L.changeButton(this,200, 650, "button_cancel_red", ()=>{

                } );
                this.children.remove(this.droneT2L);
                this.droneT2L = this.add.text(300, 620, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }
            if(this.m2activeExt < 3 && this.maxReached2){
                this.maxReached2 = false;
                this.drone2L.changeButton(this,200, 650, "button_wext", ()=>{
                    if(this.type == true){
                        this.events.emit('drone2L');
                    }
                    else{
                        this.events.emit('drone2P');
                    }
                    this.m2activeExt++;
                    this.scene.sleep()
                    this.scene.run("ShopSceneP2")
                    //system.pushSymbol(createWMod)
                });
                this.children.remove(this.droneT2L);
                this.droneT2L = this.add.text(300, 620, 'drone2', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }
            // console.log("Update")
        }
    }

}