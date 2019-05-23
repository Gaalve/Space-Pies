import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {chooseSceneP1} from "./choose-sceneP1";
import {Player} from "../mechanics/player";
import {MainScene} from "./main-scene";

export class ShopSceneP1 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private skip: Button;
    private wModule: Button;
    private wExt: Button;
    private shield: Button;
    private armor: Button;
    private background: Phaser.GameObjects.Image;
    private activeWmods: integer = 1;
    private Player1: Player;
    private firstChoose: boolean;
    private wModText: Phaser.GameObjects.Text;
    private system: PiSystem;
    private energyText: Phaser.GameObjects.Text;
    private armorText: Phaser.GameObjects.Text;
    private shieldText: Phaser.GameObjects.Text;
    private energyCostText1: Phaser.GameObjects.Text;
    private energyCostText2: Phaser.GameObjects.Text;
    private energyCostText3: Phaser.GameObjects.Text;
    private energyCostText4: Phaser.GameObjects.Text;




    constructor(){
        super({
            key: 'ShopSceneP1',
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
        this.system = this.scene.get('MainScene').data.get("system");
        let system = this.system;
        let createShield1 = (system.add.channelOut('rshieldp1z1','*' ).nullProcess());
        let createArmor1 = (system.add.channelOut('rarmorp1z1','*' ).nullProcess());
        let createShield2 = (system.add.channelOut('rshieldp1z2','*' ).nullProcess());
        let createArmor2 = (system.add.channelOut('rarmorp1z2','*' ).nullProcess());
        let createShield3 = (system.add.channelOut('rshieldp1z3','*' ).nullProcess());
        let createArmor3 = (system.add.channelOut('rarmorp1z3','*' ).nullProcess());
        let createShield4 = (system.add.channelOut('rshieldp1z4','*' ).nullProcess());
        let createArmor4 = (system.add.channelOut('rarmorp1z4','*' ).nullProcess());
        let createWExtShipL = (system.add.channelOut('wext10l','*' ).nullProcess());
        let createWExtShipP = (system.add.channelOut('wext10p','*' ).nullProcess());
        let createWExtShipR = (system.add.channelOut('wext10r','*' ).nullProcess());
        let createWExtDrone1L = (system.add.channelOut('wext11l','*' ).nullProcess());
        let createWExtDrone1P = (system.add.channelOut('wext11p','*' ).nullProcess());
        let createWExtDrone1R = (system.add.channelOut('wext11r','*' ).nullProcess());
        let createWExtDrone2L = (system.add.channelOut('wext12l','*' ).nullProcess());
        let createWExtDrone2P = (system.add.channelOut('wext12p','*' ).nullProcess());
        let createWExtDrone2R = (system.add.channelOut('wext12r','*' ).nullProcess());

        let startShop = system.add.replication(system.add.channelIn('shopp1','*').process('ShopP1', this.scene.launch));
        let createWMod = (system.add.channelOut('wmod1','*' ).nullProcess()); //wmod2 for p2

        const text = this.add.text(1920-650, 50, 'choose action', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})


        this.Player1 = this.scene.get('MainScene').data.get('P1');
        this.activeWmods = this.Player1.getNrDrones();
        let energy = this.Player1.getEnergy();
        let energyCost = this.Player1.getEnergyCost();

        this.background = this.add.image(1120, 540,"shop_bg");
        this.background.setOrigin(0,0.5);
        this.background.setTint(0x782121);
        const text1 = this.add.text(1920-650, 50, 'choose action', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        this.add.image(1920-120,40,"button_energy");
        this.energyText = this.add.text(1920-100, 10, " : " +energy, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});

        this.add.image(1920-730,200,"button_energy").setDisplaySize(40,40);
        this.add.image(1920-730,350,"button_energy").setDisplaySize(40,40);
        this.add.image(1920-730,500,"button_energy").setDisplaySize(40,40);
        this.add.image(1920-730,650,"button_energy").setDisplaySize(40,40);
        this.energyCostText1 = this.add.text(1920-710, 185, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
        this.energyCostText2 = this.add.text(1920-710, 335, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
        this.energyCostText3 = this.add.text(1920-710, 485, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
        this.energyCostText4 = this.add.text(1920-710, 635, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});



        const piArmor = this.add.text(1920-200, 160, 'rArmorP1<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} );
        const piShield = this.add.text(1920-200, 310, 'rShieldP1<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} );
        const piWMod = this.add.text(1920-200, 610, 'wmodP1<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} );

        if(energy >= energyCost){

            this.armor = this.setButton(1920-600, 200, "button_armor", ()=>{
                this.data.set("type", "armor");
                this.scene.run("chooseZoneSceneP1");
                this.scene.sleep();


            });
            this.armorText = this.add.text(1920-500, 180, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            this.shield = this.setButton(1920-600, 350, "button_shield", ()=>{
                this.data.set("type", "shield");
                this.scene.run("chooseZoneSceneP1");
                this.scene.sleep();
            });
            this.shieldText = this.add.text(1920-500, 330, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        }
        else{

            this.armor = this.setButton(1920-600, 200, "button_cancel_red", ()=>{


            });
            this.armorText = this.add.text(1920-500, 180, "not enough energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            this.shield = this.setButton(1920-600, 350, "button_cancel_red", ()=>{

            });
            this.wModText = this.add.text(1920-500, 330, "not enough energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        }


        this.wExt = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{
                this.scene.run('chooseTypeSceneP1');
                this.scene.sleep();
                //system.pushSymbol(createWMod)
            });
        this.wExt.setPosition(1920-600, 500);
        const wExtText = this.add.text(1920-500, 480, "Weapon Extension", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        if(this.activeWmods >= 3 || energy < energyCost){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                });
            this.wModule.setPosition(1920-600, 650);
            this.wModText = this.add.text(1920-500, 630, "max Mods reached", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        }

        if(this.activeWmods < 3 && energy >= energyCost){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wmod",
                ()=>{
                    system.pushSymbol(createWMod);
                    this.Player1.payEnergy(energyCost);
                    this.Player1.raiseEnergyCost(1);
                });
            this.wModule.setPosition(1920-600, 650);
            this.wModText = this.add.text(1920-500, 630, "Weapon Module", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        }


        this.skip = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=>{
            this.events.emit("skip")
            });
        this.skip.setPosition(1920-600, 800);
        const skipText = this.add.text(1920-500, 780, "close", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


        let choose = this.scene.get('chooseSceneP1');
        let zones = this.scene.get('chooseZoneSceneP1');
        choose.events.on('shipL', function () {
            system.pushSymbol(createWExtShipL)
        }, this);

        choose.events.on('shipP', function () {
            system.pushSymbol(createWExtShipP)
        }, this);
        choose.events.on('shipR', function () {
            system.pushSymbol(createWExtShipR)
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
        }, this);
        choose.events.on('drone1R', function () {
            system.pushSymbol(createWExtDrone1R)
        }, this);
        choose.events.on('drone2R', function () {
            system.pushSymbol(createWExtDrone2R)
        }, this);

        zones.events.on("armorZ1", function () {
            system.pushSymbol(createArmor1);
        })
        zones.events.on("shieldZ1", function () {
            system.pushSymbol(createShield1);
        })
        zones.events.on("armorZ2", function () {
            system.pushSymbol(createArmor2);
        })
        zones.events.on("shieldZ2", function () {
            system.pushSymbol(createShield2);
        })
        zones.events.on("armorZ3", function () {
            system.pushSymbol(createArmor3);
        })
        zones.events.on("shieldZ3", function () {
            system.pushSymbol(createShield3);
        })
        zones.events.on("armorZ4", function () {
            system.pushSymbol(createArmor4);
        })
        zones.events.on("shieldZ4", function () {
            system.pushSymbol(createShield4);
        })
    }

    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        let old = 0;
        let oldCost = 2;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.skip.updateStep();
            this.shield.updateStep();
            this.armor.updateStep();
            this.wModule.updateStep();
            this.wExt.updateStep();
            this.activeWmods = this.Player1.getNrDrones();
            let energy = this.Player1.getEnergy();
            let energyCost = this.Player1.getEnergyCost();
            if(energy != old){
                this.children.remove(this.energyText);
                this.energyText = this.add.text(1920-100, 20, " = " +energy, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});

            }
            if(energyCost != oldCost){
                this.children.remove(this.energyCostText1);
                this.children.remove(this.energyCostText2);
                this.children.remove(this.energyCostText3);
                this.children.remove(this.energyCostText4);
                this.energyCostText1 = this.add.text(1920-710, 185, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
                this.energyCostText2 = this.add.text(1920-710, 335, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
                this.energyCostText3 = this.add.text(1920-710, 485, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
                this.energyCostText4 = this.add.text(1920-710, 635, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});

            }

            if(energy < energyCost){
                this.armor.changeButton(this,1920-600, 200, "button_cancel_red", ()=>{
                });
                this.shield.changeButton(this,1920-600, 350, "button_cancel_red", ()=>{
                });
                this.children.remove(this.shieldText);
                this.children.remove(this.armorText);
                this.shieldText = this.changeText(1920-500, 330, "not enough energy");
                this.armorText = this.changeText(1920-500, 180, "not enough energy")

                //this.changeText()
            }

            if(this.activeWmods >= 3 && this.firstChoose || energy < energyCost){
                this.firstChoose = false;
                this.wModule.changeButton(this,1920-600, 650, "button_cancel_red", ()=>{
                });
                this.children.remove(this.wModText);
                if(this.activeWmods >= 3){
                    this.wModText = this.add.text(1920-500, 630, "max Mods reached", {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

                }
                else if(energy < energyCost){

                    this.wModText = this.add.text(1920-500, 630, "not enough energy", {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
                }
            }

            if(this.activeWmods < 3 && !this.firstChoose && energy >= energyCost){
                this.firstChoose = true;
                this.wModule.changeButton(this,1920-600, 650, "button_wmod", ()=> {
                        this.system.pushSymbol(this.system.add.channelOut('wmod1','*' ).nullProcess())
                        this.Player1.payEnergy(energyCost);
                        this.Player1.raiseEnergyCost(1);
                    }
                );
                this.children.remove(this.wModText)
                this.wModText = this.changeText(1920-500, 630, "Weapon Mod")
            }

            old = energy;
            oldCost = energyCost;
            // console.log("Update")
        }
    }

    setButton(x : number, y : number, pic : string, onclick: Function = ()=>{}) : Button{
        return new Button(this, x, y, "button_shadow",
            "button_bg", "button_fg", pic, onclick);

    }

    changeText(x: number, y: number, newText: string) : Phaser.GameObjects.Text{
        return this.add.text(x, y, newText, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


    }

}

