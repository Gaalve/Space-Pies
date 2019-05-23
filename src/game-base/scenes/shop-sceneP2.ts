import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {Player} from "../mechanics/player";

export class ShopSceneP2 extends Phaser.Scene{

    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;

    private skip: Button;
    private wModule: Button;
    private wExt: Button;
    private solar: Button;
    private shield: Button;
    private armor: Button;
    private background: Phaser.GameObjects.Image;
    private activeWmods:integer = 3;
    private Player2: Player;
    private firstChoose: boolean;
    private wModText: Phaser.GameObjects.Text;
    private energyText: Phaser.GameObjects.Text;
    private armorText: Phaser.GameObjects.Text;
    private shieldText: Phaser.GameObjects.Text;
    private system: PiSystem;
    private energyCostText1: Phaser.GameObjects.Text;
    private energyCostText2: Phaser.GameObjects.Text;
    private energyCostText3: Phaser.GameObjects.Text;
    private energyCostText4: Phaser.GameObjects.Text;
    private solarText: Phaser.GameObjects.Text;



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
        this.system = this.scene.get('MainScene').data.get("system");
        let system = this.system;

        let createShield1 = (system.add.channelOut('rshieldp2z1','*' ).nullProcess());
        let createArmor1 = (system.add.channelOut('rarmorp2z1','*' ).nullProcess());
        let createShield2 = (system.add.channelOut('rshieldp2z2','*' ).nullProcess());
        let createArmor2 = (system.add.channelOut('rarmorp2z2','*' ).nullProcess());
        let createShield3 = (system.add.channelOut('rshieldp2z3','*' ).nullProcess());
        let createArmor3 = (system.add.channelOut('rarmorp2z3','*' ).nullProcess());
        let createShield4 = (system.add.channelOut('rshieldp2z4','*' ).nullProcess());
        let createArmor4 = (system.add.channelOut('rarmorp2z4','*' ).nullProcess());
        let createWExtShipL = (system.add.channelOut('wext20l','*' ).nullProcess());
        let createWExtShipP = (system.add.channelOut('wext20p','*' ).nullProcess());
        let createWExtShipR = (system.add.channelOut('wext20r','*' ).nullProcess());
        let createWExtDrone1R = (system.add.channelOut('wext21r','*' ).nullProcess());
        let createWExtDrone2R = (system.add.channelOut('wext22r','*' ).nullProcess());
        let createWExtDrone1L = (system.add.channelOut('wext21l','*' ).nullProcess());
        let createWExtDrone1P = (system.add.channelOut('wext21p','*' ).nullProcess());
        let createWExtDrone2L = (system.add.channelOut('wext22l','*' ).nullProcess());
        let createWExtDrone2P = (system.add.channelOut('wext22p','*' ).nullProcess());
        let startShop = system.add.replication(system.add.channelIn('shopp2','*').process('ShopP2', this.scene.launch));
        let createWMod = (system.add.channelOut('wmod2','*' ).nullProcess()); //wmod2 for p2

        this.Player2 = this.scene.get('MainScene').data.get('P2');
        this.activeWmods = this.Player2.getNrDrones();
        this.background = this.add.image(0, 540,"shop_bg");
        this.background.setOrigin(0, 0.5);
        this.background.setFlipX(true);
        this.background.setTint(0x214478);

        let energy = this.Player2.getEnergy();
        let energyCost = this.Player2.getEnergyCost();
        this.add.image(50,40,"button_energy");
        this.energyText = this.add.text(70, 10, " : " +energy, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});

        this.add.image(70,200,"button_energy").setDisplaySize(40,40);
        this.add.image(70,350,"button_energy").setDisplaySize(40,40);
        this.add.image(70,500,"button_energy").setDisplaySize(40,40);
        this.add.image(70,650,"button_energy").setDisplaySize(40,40);
        this.energyCostText1 = this.add.text(90, 185, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
        this.energyCostText2 = this.add.text(90, 335, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
        this.energyCostText3 = this.add.text(90, 485, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
        this.energyCostText4 = this.add.text(90, 635, " x " +energyCost, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});


        const text = this.add.text(160, 50, 'choose action', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        const piArmor = this.add.text(600, 160, 'regArmorP2<*>.O',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )
        const piShield = this.add.text(600, 310, 'regShieldP2<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )
        const piWmod = this.add.text(600, 610, 'wmodP2<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

        if(energy < energyCost){

            this.armor = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                });
            this.armor.setPosition(200, 200);

            this.shield = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{

                });
            this.shield.setPosition(200, 350);
            this.shieldText = this.add.text(300, 330, "not enough energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            this.armorText = this.add.text(300, 180, "not enough energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        }
        else{
            this.armor = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_armor",
                ()=>{
                    this.data.set("type", "armor");
                    this.scene.run("chooseZoneSceneP2");
                    this.scene.sleep();                });
            this.armor.setPosition(200, 200);

            this.shield = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_shield",
                ()=>{
                    this.data.set("type", "shield");
                    this.scene.run("chooseZoneSceneP2");
                    this.scene.sleep();                });
            this.shield.setPosition(200, 350);
            this.shieldText = this.add.text(300, 330, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            this.armorText = this.add.text(300, 180, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
            this.solar = new Button(this,1920-600, 900, "button_shadow", "button_bg", "button_fg","button_armor", ()=>{
                system.pushSymbol(system.add.channelOut("solar2", "*").nullProcess())


            });
            this.solarText = this.add.text(1920-500, 880, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        }

        this.wExt = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{
                this.scene.sleep();
                this.scene.run('chooseTypeSceneP2');

            });
        this.wExt.setPosition(200, 500);
        const wExtText = this.add.text(300, 480, "Weapon Extension", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        if(this.activeWmods >= 3 || energy < energyCost){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{

                });
            this.wModule.setPosition(200, 650);
            if(this.activeWmods >= 3){
                this.wModText = this.add.text(300, 630, "max Mods reached", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            }
            else{
                this.wModText = this.add.text(300, 630, "not enough energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            }

        }
        if(this.activeWmods < 3 && energy >= energyCost){
            this.wModule = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wmod",
                ()=>{
                    system.pushSymbol(createWMod);
                    this.Player2.payEnergy(energyCost);
                    this.Player2.raiseEnergyCost(1);
                });
            this.wModule.setPosition(200, 650);
            this.wModText = this.add.text(300, 630, "Weapon Module", {
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
        let zones = this.scene.get('chooseZoneSceneP2');

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
            this.activeWmods = this.Player2.getNrDrones();

            let energy = this.Player2.getEnergy();
            let energyCost = this.Player2.getEnergyCost();
            if(energy != old){
                this.children.remove(this.energyText);
                this.energyText = this.add.text(70, 20, " = " +energy, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});

            }

            if(energyCost != oldCost){
                this.children.remove(this.energyCostText1);
                this.children.remove(this.energyCostText2);
                this.children.remove(this.energyCostText3);
                this.children.remove(this.energyCostText4);
                this.energyCostText1 = this.add.text(90, 185, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
                this.energyCostText2 = this.add.text(90, 335, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
                this.energyCostText3 = this.add.text(90, 485, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
                this.energyCostText4 = this.add.text(90, 635, " x " +energyCost, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 1});
            }

            if(energy < energyCost){
                this.armor.changeButton(this,200, 200, "button_cancel_red", ()=>{
                });
                this.shield.changeButton(this,200, 350, "button_cancel_red", ()=>{
                });
                this.children.remove(this.shieldText);
                this.children.remove(this.armorText);
                this.shieldText = this.changeText(300, 330, "not enough energy")
                this.armorText = this.changeText(300, 180, "not enough energy")

            }

            if(this.firstChoose && this.activeWmods >= 3 || energy < energyCost){
                this.wModule.changeButton(this,200, 650, "button_cancel_red", ()=>{
                });
                this.children.remove(this.wModText);
                if(this.activeWmods >= 3){
                    this.wModText = this.add.text(300, 630, "max Mods reached", {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

                }
                else{
                    this.wModText = this.add.text(300, 630, "not enough energy", {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

                }
                this.firstChoose = false;



            }

            if(!this.firstChoose && this.activeWmods < 3 && energy >= energyCost){
                this.firstChoose = true;
                this.wModule.changeButton(this,200, 650, "button_wmod", ()=>{
                    this.system.pushSymbol(this.system.add.channelOut('wmod2','*' ).nullProcess());
                    this.Player2.payEnergy(energyCost);
                    this.Player2.raiseEnergyCost(1);

                });
                this.children.remove(this.wModText);
                this.wModText = this.add.text(300, 630, "Weapon Mod", {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            }
            old = energy;
            oldCost = energyCost;

            // console.log("Update")
        }
    }
    changeText(x: number, y: number, newText: string) : Phaser.GameObjects.Text{
        return this.add.text(x, y, newText, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


    }



}