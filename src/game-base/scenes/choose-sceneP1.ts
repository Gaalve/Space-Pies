import {Button} from "../mechanics/button";
import {Player} from "../mechanics/player";
export class chooseSceneP1 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private background;
    private shipL: Button;
    private drone1L: Button;
    private drone2L: Button;
    private close: Button;
    private m0activeExt : integer = 0;
    private m1activeExt: integer = 0;
    private m2activeExt: integer = 0;
    private Player1: Player;
    private droneNr: number;
    private maxReached0: boolean;
    private maxReached1: boolean;
    private maxReached2: boolean;
    private shipTL: Phaser.GameObjects.Text;
    private droneTL: Phaser.GameObjects.Text;
    private droneT2L: Phaser.GameObjects.Text;
    private type: boolean;
    private energyText: Phaser.GameObjects.Text;


    constructor(){
        super({
            key: 'chooseSceneP1',
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
        this.Player1 = this.scene.get('MainScene').data.get('P1');
        this.type = this.scene.get("chooseTypeSceneP1").data.get("type");
        let choose = this.scene.get("chooseTypeSceneP1");

        let energy = this.Player1.getEnergy();
        let energyCost = 3;

        let drones = this.Player1.getDrones();
        let droneNr = this.Player1.getNrDrones();
        this.droneNr = 1;
        let ship = drones[0];
        this.m0activeExt = ship.getNrWeapons();
        if(droneNr >= 2){
            let drone1 = drones[1];
            this.m1activeExt = drone1.getNrWeapons();
        }
        if(droneNr >= 3){
            let drone2 = drones[2];
            this.m1activeExt = drone2.getNrWeapons();
        }


        this.background = this.add.image(1120, 540,"shop_bg");
        this.background.setOrigin(0,0.5);
        this.background.setTint(0x782121);
        const text = this.add.text(1920-650, 50, 'choose Weapon Mod', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})


        this.add.image(1920-120,40,"button_energy");
        this.energyText = this.add.text(1920-100, 10, " : " +energy, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});


        if(this.m0activeExt >= 3 || energy < energyCost) {
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                () => {
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-600, 250);
            if(this.m0activeExt >= 3){
                this.shipTL = this.add.text(1920-500, 220, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            }
            else{
                this.shipTL = this.add.text(1920-500, 220, 'not enough energy', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            }
        }
        if(this.m0activeExt < 3 && energy >= energyCost){
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_space_shuttle",
                ()=>{
                    if(choose.data.get("type")  == true){
                        this.events.emit('shipL');
                    }
                    else{
                        this.events.emit('shipP');
                    }
                    this.scene.sleep();
                    this.Player1.payEnergy(energyCost);
                    this.scene.run("ShopSceneP1")
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-600, 250);
            this.shipTL = this.add.text(1920-500, 220, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(choose.data.get("type") == true){
                const piWext1 = this.add.text(1920-150, 220, 'wextp1m0l(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext1 = this.add.text(1920-150, 220, 'wextp1m0p(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }

        if(this.m1activeExt >= 3 || droneNr < 2 || energy < energyCost){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-600, 450);
            if(droneNr < 2){
                this.maxReached1 = true;
                this.m1activeExt = 3;
                this.droneTL = this.add.text(1920-500, 420, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
            else if(this.m1activeExt >= 3){
                this.droneTL = this.add.text(1920-500, 420, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
            else{
                this.droneTL = this.add.text(1920-500, 420, 'not enough energy', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
        }
        if(this.m1activeExt < 3 && droneNr >= 2 && energy >= energyCost){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                    if(choose.data.get("type")  == true){
                        this.events.emit('drone1L');

                    }
                    else{
                        this.events.emit('drone1P');

                    }
                    this.scene.sleep();
                    this.Player1.payEnergy(energyCost);
                    this.scene.run("ShopSceneP1")
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-600, 450);
            this.droneTL = this.add.text(1920-500, 420, 'drone 1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(choose.data.get("type") == true){
                const piWext2 = this.add.text(1920-150, 420, 'wextp1m2l(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext2 = this.add.text(1920-150, 420, 'wextp1m1p(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        if(this.m2activeExt >= 3 || droneNr< 3 || energy < energyCost){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
             });
            if(droneNr < 3){
                this.maxReached2 = true;
                this.m2activeExt = 3;
                this.droneT2L = this.add.text(1920-500, 620, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
            else if(this.m2activeExt >= 3) {
                this.droneT2L = this.add.text(1920 - 500, 620, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });
            }
            else{
                this.droneT2L = this.add.text(1920 - 500, 620, 'not enough energy', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });
            }
            this.drone2L.setPosition(1920-600, 650)

        }
        if(this.m2activeExt < 3 && droneNr >= 3 && energy >= energyCost){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                if(choose.data.get("type")  == true){
                    this.events.emit('drone2L');

                }
                else{
                    this.events.emit('drone2P');

                }
                    this.scene.sleep();
                    this.Player1.payEnergy(energyCost);
                    this.scene.run("ShopSceneP1")
                    //system.pushSymbol(createWMod)
                });
            this.droneT2L = this.add.text(1920-500, 620, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            this.drone2L.setPosition(1920-600, 650)
            if(choose.data.get("type") == true){
                const piWext3 = this.add.text(1920-150, 620, 'wextp1m2l(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext3 = this.add.text(1920-150, 620, 'wextp1m2p(*).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        this.close = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=> {
                this.scene.sleep()
                this.scene.run("ShopSceneP1")
            });
        this.close.setPosition(1920-600, 850);
        const closeT = this.add.text(1920-500, 820, 'close', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});


    }
    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        let old = 0;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.shipL.updateStep();
            this.drone1L.updateStep();
            this.drone2L.updateStep();
            this.close.updateStep();
            let energy = this.Player1.getEnergy();
            let energyCost = 3;
            let choose = this.scene.get("chooseTypeSceneP1");
            let drones = this.Player1.getDrones();
            let droneNr = this.Player1.getNrDrones();
            this.droneNr = 1;
            let ship = drones[0];
            this.m0activeExt = ship.getNrWeapons();
            if(droneNr >= 2){
                let drone1 = drones[1];
                this.m1activeExt = drone1.getNrWeapons();
            }
            if(droneNr >= 3){
                let drone2 = drones[2];
                this.m2activeExt = drone2.getNrWeapons();
            }

            if(energy != old){
                this.children.remove(this.energyText);
                this.energyText = this.add.text(1920-100, 20, " = " +energy, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});

            }


            if(this.m0activeExt >= 3 && !this.maxReached0 || energy < energyCost){
                this.maxReached0 = true;
                this.shipL.changeButton(this,1920-600, 250, "button_cancel_red", ()=>{

                } );
                this.children.remove(this.shipTL);
                if(this.m0activeExt >= 3){
                    this.shipTL = this.add.text(1920 - 500, 220, 'max reached', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }
                else{
                    this.shipTL = this.add.text(1920 - 500, 220, 'not enough energy', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }


            }
            if(this.m0activeExt < 3 && this.maxReached0 && energy >= energyCost){
                this.maxReached0 = false;
                this.shipL.changeButton(this,1920-600, 250, "button_space_shuttle", ()=>{
                    if(choose.data.get("type")  == true){
                        this.events.emit('shipL');
                    }
                    else{
                        this.events.emit('shipP');
                    }
                    this.Player1.payEnergy(energyCost);
                    this.scene.sleep();
                    this.scene.run("ShopSceneP1")
                    //system.pushSymbol(createWMod)
                });
                this.children.remove(this.shipTL);
                this.shipTL = this.add.text(1920 - 500, 220, 'ship', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }
            if(this.m1activeExt >= 3 && !this.maxReached1 || energy < energyCost){
                this.drone1L.changeButton(this,1920-600, 450, "button_cancel_red", ()=>{

                } );
                this.children.remove(this.droneTL);
                if(this.maxReached1 == true){
                    this.droneTL = this.add.text(1920 - 500, 420, 'mod not built', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }
                else if(this.m1activeExt >= 3){
                    this.droneTL = this.add.text(1920 - 500, 420, 'max reached', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }
                else{
                    this.droneTL = this.add.text(1920 - 500, 420, 'not enough energy', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }
                this.maxReached1 = true;



            }
            if(this.m1activeExt < 3 && this.maxReached1 && energy >= energyCost){
                this.maxReached1 = false;
                this.drone1L.changeButton(this,1920-600, 450, "button_wext", ()=>{
                    if(choose.data.get("type")  == true){
                        this.events.emit('drone1L');
                    }
                    else{
                        this.events.emit('drone1P');
                    }
                    this.Player1.payEnergy(energyCost);
                    this.scene.sleep();
                    this.scene.run("ShopSceneP1")
                    //system.pushSymbol(createWMod)
                });
                this.children.remove(this.droneTL);
                this.droneTL = this.add.text(1920 - 500, 420, 'drone1', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }

            if(this.m2activeExt >= 3 && !this.maxReached2 || energy < energyCost){
                this.drone2L.changeButton(this,1920-600, 650, "button_cancel_red", ()=>{

                } );
                this.children.remove(this.droneT2L);
                if(this.maxReached2 == true){
                    this.droneT2L = this.add.text(1920 - 500, 620, 'mod not built', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }
                else if(this.m2activeExt >= 3){
                    this.droneT2L = this.add.text(1920 - 500, 620, 'max reached', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }
                else{
                    this.droneT2L = this.add.text(1920 - 500, 620, 'not enough energy', {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                    });
                }
                this.maxReached2 = true;


            }
            if(this.m2activeExt < 3 && this.maxReached2 && energy >= energyCost){
                this.maxReached2 = false;
                this.drone2L.changeButton(this,1920-600, 650, "button_wext", ()=>{
                    if(choose.data.get("type")  == true){
                        this.events.emit('drone2L');
                    }
                    else{
                        this.events.emit('drone2P');
                    }
                    this.Player1.payEnergy(energyCost);
                    this.scene.sleep();
                    this.scene.run("ShopSceneP1")
                    //system.pushSymbol(createWMod)
                });
                this.children.remove(this.droneT2L);
                this.droneT2L = this.add.text(1920 - 500, 620, 'drone 2', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });


            }
            old = energy;
            // console.log("Update")
        }
    }

}