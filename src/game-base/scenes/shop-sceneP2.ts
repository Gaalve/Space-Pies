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
    private background: Phaser.GameObjects.Image;
    private activeWmods:integer = 3;
    private Player2: Player;
    private firstChoose: boolean;
    private wModText: Phaser.GameObjects.Text;
    private energyText: Phaser.GameObjects.Text;
    private armorText: Phaser.GameObjects.Text;
    private shieldText: Phaser.GameObjects.Text;
    private system: PiSystem;


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

        let createShield = (system.add.channelOut('rShieldP2','*' ).nullProcess());
        let createArmor = (system.add.channelOut('rArmorP2','*' ).nullProcess());
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
        this.background = this.add.image(0, 540,"shop_bg");
        this.background.setOrigin(0, 0.5);
        this.background.setFlipX(true);
        this.background.setTint(0x214478);

        let energy = this.Player2.getEnergy();
        let energyCost = 3;
        this.add.image(50,40,"button_energy");
        this.energyText = this.add.text(70, 10, " : " +energy, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});




        const text = this.add.text(160, 50, 'choose action', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        const piArmor = this.add.text(500, 180, 'regArmorP2<*>.O',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )
        const piShield = this.add.text(500, 330, 'regShieldP2<*>.0',{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )
        const piWmod = this.add.text(650, 630, 'wmodP2<*>.0',{
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
                    system.pushSymbol(createArmor);
                    this.Player2.payEnergy(energyCost)
                });
            this.armor.setPosition(200, 200);

            this.shield = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_shield",
                ()=>{
                    system.pushSymbol(createShield);
                    this.Player2.payEnergy(energyCost)
                });
            this.shield.setPosition(200, 350);
            this.shieldText = this.add.text(300, 330, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            this.armorText = this.add.text(300, 180, "Armor", {
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
        let old = 0;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.skip.updateStep();
            this.shield.updateStep();
            this.armor.updateStep();
            this.wModule.updateStep();
            this.wExt.updateStep();
            this.activeWmods = this.Player2.getNrDrones();

            let energy = this.Player2.getEnergy();
            let energyCost = 3;
            if(energy != old){
                this.children.remove(this.energyText);
                this.energyText = this.add.text(70, 20, " = " +energy, {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});

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
                    this.system.pushSymbol(this.system.add.channelOut('wmod2','*' ).nullProcess())
                    this.Player2.payEnergy(3);                    this.Player2.payEnergy(energyCost);
                });
                this.children.remove(this.wModText);
                this.wModText = this.add.text(300, 630, "Weapon Mod", {
                        fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

            }
            old = energy;

            // console.log("Update")
        }
    }
    changeText(x: number, y: number, newText: string) : Phaser.GameObjects.Text{
        return this.add.text(x, y, newText, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});


    }



}