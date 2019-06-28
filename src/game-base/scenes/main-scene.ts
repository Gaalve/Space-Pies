import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";
import {PiSystem} from "../mechanics/picalc/pi-system";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Sprite = Phaser.GameObjects.Sprite;
import {BattleTimeBar} from "../mechanics/battleTimeBar";
import {Bot} from "../mechanics/bot/bot";
import {PiAnimSystem} from "../mechanics/pianim/pi-anim-system";
import {Infobox} from "../mechanics/Infobox";
import {FullPiScene} from "./full-pi-scene";
import {roundTimeBar} from "../mechanics/roundTimeBar";

export class MainScene extends Phaser.Scene {

    /** How much game time has elapsed since the last rendering of a tick */
    private timeAccumulator = 0.0;
    private timeUpdateTick = 1000/60;
    private players: [Player, Player];
    private turn: Turn;
    private buttonEndTurn: Button;
    private buttonOption: Button;
    private shop: Button;
    private system: PiSystem;
    private pem: ParticleEmitterManager;
    private shop_bg_back: Sprite;//Phaser.GameObjects.Graphics;
    private shop_bg_out: Sprite;
    private shop_bg_back2: Sprite;//Phaser.GameObjects.Graphics;
    private shop_bg_out2: Sprite;
    // private energy_bg: Phaser.GameObjects.Rectangle;
    private gameMode: string;

    private shop1: [Button, Button, Button, Button, Button, Button, Button];
    private shopZ: [Button, Button, Button, Button, Button];
    private shopT: [Button, Button, Button, Button];
    private shopW: [Button, Button, Button, Button];
    private shopS: [Button, Button, Button, Button, Button, Button];
    private shopM: [Button, Button, Button, Button];
    private skip: Button;
    private wModule: Button;
    private motors: Button;
    private solar: Button;
    private wExt: Button;
    private shield: Button;
    private armor: Button;
    private close: Button;
    private zone1: Button;
    private zone2: Button;
    private zone3: Button;
    private zone4: Button;
    private laser: Button;
    private projectile: Button;
    private rocket: Button;
    private ship: Button;
    private drone1: Button;
    private drone2: Button;
    private close2: Button;
    private closeS: Button;
    private back: Button;
    private backT: Button;
    private regen: Button;
    private nano: Button;
    private rocketS: Button;
    private adapt: Button;
    private motorL: Button;
    private motorP: Button;
    private motorR: Button;
    private backM: Button;

    private shop1Active: boolean;
    private shopWActive: boolean;
    private shopTActive: boolean;
    private shopZActive: boolean;
    private shopSActive: boolean;
    private shopMActive: boolean;
    private shop1Text: Phaser.GameObjects.Text[];
    private shopZText: Phaser.GameObjects.Text[];
    private shopTText: Phaser.GameObjects.Text[];
    private shopWText: Phaser.GameObjects.Text[];
    private shopSText: Phaser.GameObjects.Text[];
    private shopMText: Phaser.GameObjects.Text[];
    private active: boolean = true;
    private energy: Phaser.GameObjects.Image;
    private energyT: Phaser.GameObjects.Text;
    private energySym: Phaser.GameObjects.Image[];
    private energyCostText: Phaser.GameObjects.Text[];
    private energyShopT: Phaser.GameObjects.Image[];
    private energyCostT: Phaser.GameObjects.Text[];
    private energyShopS: Phaser.GameObjects.Image[];
    private energyTextS: Phaser.GameObjects.Text[];
    private energyRegen: Phaser.GameObjects.Text;
    public battleTime: BattleTimeBar;
    public buttonBotLog: Button;
    private roundTimebar: roundTimeBar;
    private roundTimeEvent;
    private rounddelay:number = 30000;

    /** Round Pi Calc Animation **/
    private roundBG: Sprite;
    private roundFG: Sprite;

    private infobox: Infobox;
    public blackholeExists;


    private openShop: Phaser.GameObjects.Text;



    constructor() {
        super({
            key: "MainScene",
            active: false
        })
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        );

        this.load.spritesheet('bleedingbar', 'assets/sprites/bleedingbar.png', { frameWidth: 19, frameHeight: 42, spacing: 5, startFrame: 0, endFrame: 42, margin: 0});


    }

    create(data?: PiAnimSystem): void {

        this.system = new PiSystem(this, 33,33,33,true);
        this.data.set("system", this.system);
        this.scene.launch("FullPiScene");
        let scene = this;
        this.input.keyboard.on('keydown-' + 'W', function (event) {
            let piScene = <FullPiScene> scene.scene.get("FullPiScene");
           piScene.background.setVisible(true);
           piScene.fullPiText1.setVisible(true);
           piScene.fullPiText2.setVisible(true);
           piScene.fullPiText3.setVisible(true);
            piScene.resetButton.setVisible(true);

        });
        this.input.keyboard.on('keyup-' + 'W', function (event) {
            let piScene = <FullPiScene> scene.scene.get("FullPiScene");
            piScene.background.setVisible(false);
            piScene.fullPiText1.setVisible(false);
            piScene.fullPiText2.setVisible(false);
            piScene.fullPiText3.setVisible(false);
            piScene.resetButton.setVisible(false);
        });

        this.anims.create({
            key: 'snooze',
            frames:
                [{ key: 'shield/00', frame: null },
                { key: 'shield/01' , frame: null},
                { key: 'shield/02', frame: null },
                { key: 'shield/03', frame: null },
                { key: 'shield/04' , frame: null},
                { key: 'shield/05', frame: null },
                { key: 'shield/06' , frame: null},
                { key: 'shield/07', frame: null },
                { key: 'shield/08' , frame: null}, { key: 'shield/09' , frame: null},
                { key: 'shield/10', frame: null, duration: 50 },
            ],
            frameRate: 8,
            repeat: -1
        });

        this.gameMode = this.scene.get("GuiScene").data.get("mode");
        console.log(this.gameMode);
        this.battleTime = new BattleTimeBar(this);
        this.roundTimebar = new roundTimeBar(this);
        this.pem = this.add.particles("parts");
        this.pem.setDepth(5);


        this.input.enabled = true;

        this.infobox = <Infobox> this.scene.get('GuiScene').data.get("infoboxx");
        this.data.set("infoboxx", this.infobox);
        if (!this.infobox) throw Error("No Infobox loaded");

        if (!data && data !instanceof  PiAnimSystem) throw new Error("No Pi Anim System");
        data.reset();

        switch(this.gameMode){
            case("0"):{
                this.players = [new Player(this, 300, 540, "P1", true, this.system, this.pem, this.battleTime, data),
                    new Player(this, 1620, 540, "P2", false, this.system, this.pem, this.battleTime, data)];
                break;
            }
            case("1"):{
                this.players = [new Player(this, 300, 540, "P1", true, this.system, this.pem, this.battleTime, data),
                    new Bot(this, 1620, 540, "P2", false, this.system, this.pem, this.battleTime, data)];
                break;
            }
            case("2"):{
                this.players = [new Bot(this, 300, 540, "P1", true, this.system, this.pem, this.battleTime, data),
                    new Player(this, 1620, 540, "P2", false, this.system, this.pem, this.battleTime, data)];
                break;
            }
            default:{
                this.players = [new Player(this, 300, 540, "P1", true, this.system, this.pem, this.battleTime, data),
                    new Player(this, 1620, 540, "P2", false, this.system, this.pem, this.battleTime, data)];
            }
        }


        this.turn = new Turn(this, this.players, data, this.gameMode);
        let system = this.system;
        let startShop = system.add.replication(system.add.channelIn('shopp1','*').process('ShopP1', () =>{
            if(this.turn.getCurrentRound() != 1){
                this.switchTextures(this.turn.getCurrentPlayer());
            }
            this.changeShopColor(this.turn.getCurrentPlayer());
            this.roundTimeEvent=this.time.addEvent({ delay:  this.rounddelay, loop: false,callback: () => {this.skip.clicked();} });
            this.roundTimebar.setTimer(this.roundTimeEvent);
            this.displayShop(this.shop1, this.shop1Text);
            this.updateShop1(false);
            this.shop1Active = true;
            this.shop_bg_back.setVisible(true);
            this.shop_bg_out.setVisible(true);
            this.updateEnergyText();
            this.updateEnergyRate(false);
            this.energy.setVisible(true);
            this.energyT.setVisible(true);
            this.energyRegen.setVisible(true);



        }));
        let closeShop = system.add.replication(system.add.channelIn('closeshop','*').process('close', () =>{
            this.closeShop(this.shop1, this.shop1Text, true);
            this.shop1Active = false;
        }));
        system.pushSymbol(closeShop);
        system.pushSymbol(startShop);
        this.data.set('P1', this.players[0]);
        this.data.set('P2', this.players[1]);
        this.shop_bg_back = new Sprite(this, 1920/2, 990, "shop_bg_back");
        this.shop_bg_out = new Sprite(this, 1920/2, 990, "shop_bg_out");
        this.shop_bg_back.setAlpha(0.8);
        this.shop_bg_back2 = new Sprite(this, 1920/2, 775, "shop_bg_back").setScale(0.8,0.75).setVisible(false);
        this.shop_bg_out2 = new Sprite(this, 1920/2, 775, "shop_bg_out").setScale(0.8, 0.75);
        this.shop_bg_back2.setAlpha(0.8);
        this.add.existing(this.shop_bg_back2);
        //this.add.existing(this.shop_bg_out2);
        this.add.existing(this.shop_bg_back);
        this.add.existing(this.shop_bg_out);


        this.roundBG = new Sprite(this, 1920/2, 60, "shop_bg_back");
        this.roundFG = new Sprite(this, 1920/2, 60, "shop_bg_out");

        this.roundBG.setAlpha(0.6);
        this.roundBG.setScale(0.62);
        this.roundFG.setScale(0.62);

        this.add.existing(this.roundBG);
        this.add.existing(this.roundFG);

        this.energy = this.add.image(1920/2-125, 200, "energy_icon");
        this.energyT = this.add.text(1920/2-115, 470, "= "+this.turn.getCurrentPlayer().getEnergy(), {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        this.energyRegen = this.add.text(1920/2+20, 470, "(+"+this.turn.getCurrentPlayer().getRegenRate()+ ")", {
            fill: '#15ff31', fontFamily: '"Roboto"', fontSize: 35, stroke:'#15ff31',  strokeThickness: 2});

        this.energy.setVisible(false);
        this.energyT.setVisible(false);
        this.energyRegen.setVisible(false);

        this.shop = new Button(this, 1920/2, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_shop",0.95,
            ()=>{
                this.displayShop(this.shop1, this.shop1Text);
                this.shop.removeInteractive();
                this.shop.setInvisible();
                this.openShop.setVisible(false);
                this.shop1Active = true;
                this.shop_bg_back.setVisible(true);
                this.shop_bg_out.setVisible(true);

            });
        this.shop.removeInteractive();
        this.shop.setInvisible();

        this.openShop = this.add.text(1920/2-50, 1080-50, "shop", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2}).setVisible(false);


        this.buttonOption = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_options", 0.95,
            ()=>{
            this.scene.pause();
            this.scene.run('PauseScene');
            this.scene.setVisible(true,"PauseScene");

            }
        );
        this.buttonOption.setPosition(1880, 40);

        this.buttonBotLog = new Button(this, 1780, 40, "button_shadow",
            "button_bg", "button_fg", "botLog",
            1, ()=>{
                if(this.gameMode == "1"){
                    this.players[1].getBotLog().changeVisible();
                }else if(this.gameMode == "2"){
                    this.players[0].getBotLog().changeVisible();
                }
            });
        this.buttonBotLog.setInvisible();
        this.buttonBotLog.removeInteractive();

        /*const botLog = this.add.text(1580, 10, "show bot\nactions", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 24, strokeThickness: 2}).setVisible(false);*/
        if(this.gameMode == "1" || this.gameMode == "2"){
            //botLog.setVisible(true);
            this.buttonBotLog.setVisible();
            this.buttonBotLog.restoreInteractive();
        }

        this.creatChooseRegen();
        this.createShop1();
        this.createChooseZones();
        this.createChooseType();
        this.createChooseMod();
        this.createChooseMotor();
        this.ship.setHover(this.turn);
        this.drone1.setHoverDrone(this.turn, 1);
        this.drone2.setHoverDrone(this.turn, 2);
        this.zone1.setHoverZone(this.turn, 1);
        this.zone2.setHoverZone(this.turn, 2);
        this.zone3.setHoverZone(this.turn, 3);
        this.zone4.setHoverZone(this.turn, 4);


        //extra functions to resolve existing channels w1, w2, w3 after attack phase
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("w1", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("w2", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("w3", "").nullProcess()));

        //extra functions to resolve existing channels nolock1, nolock2, nolock3 after attack phase
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock1", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock2", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock3", "").nullProcess()));

        //extra functions to resolve existing channels e0 - e4 and nosolar0 - nosolar4 after energy phase
        for(let i = 0; i < 5; i++) {
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("e" + i.toString(), "").nullProcess()));
        }
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nano5", "").nullProcess()));

        //extra function for game sync
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("wait", "").nullProcess()));

        // unlock black hole
        this.system.pushSymbol(
            this.system.add.channelIn("firstunlock1","").
            channelIn("firstunlock2","").
            channelIn("secondunlock2","").
            channelIn("secondunlock1","").nullProcess()
        );

        this.blackholeExists = false;

        this.system.start();
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;

        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.shop.updateStep();
            this.buttonOption.updateStep();
            this.buttonBotLog.updateStep();

            if(this.roundTimebar.active){
                this.roundTimebar.update();
            }

            if(this.shop1Active){
                this.skip.updateStep();
                this.close.updateStep();
                this.regen.updateStep();
                this.wModule.updateStep();
                this.wExt.updateStep();
                this.motors.updateStep();
                this.solar.updateStep();
            }

            if(this.shopZActive){
                this.zone1.updateStep();
                this.zone2.updateStep();
                this.zone3.updateStep();
                this.zone4.updateStep();
                this.back.updateStep();
            }

            if(this.shopTActive){
                this.laser.updateStep();
                this.projectile.updateStep();
                this.rocket.updateStep();
                this.backT.updateStep();
            }

            if(this.shopWActive){
                this.ship.updateStep();
                this.drone1.updateStep();
                this.drone2.updateStep();
                this.close2.updateStep();

            }

            if(this.shopSActive){
                this.armor.updateStep();
                this.shield.updateStep();
                this.rocketS.updateStep();
                this.nano.updateStep();
                this.adapt.updateStep();
                this.closeS.updateStep();
            }

            if(this.shopMActive){
                this.motorR.updateStep();
                this.motorP.updateStep();
                this.motorL.updateStep();
                this.backM.updateStep();
            }



        }
        this.players[0].update(delta);
        this.players[1].update(delta);
        this.turn.update(delta);
    }

    private createShop1(): void
    {
        this.regen = new Button(this, 350, 1080-100, "button_shadow",
            "button_bg","button_fg", "button_regen", 0.95,()=>{
                this.regen.removeInteractive();
                //this.closeShop(this.shop1, this.shop1Text, false);
                if(this.shopTActive){
                    this.closeShop(this.shopT, this.shopTText, false);
                    this.shopTActive = false;
                }
                if(this.shopWActive){
                    this.closeShop(this.shopW, this.shopWText, false);
                    this.shopWActive = false;
                }
                if(this.shopZActive){
                    this.closeShop(this.shopZ, this.shopZText, false);
                    this.shopZActive = false;
                }
                if(this.shopMActive){
                    this.closeShop(this.shopM, this.shopMText, false);
                    this.shopMActive = false;
                }
                this.shop_bg_back2.setVisible(true);
                this.players[0].getDrones()[2].hidePiSeq();
                this.players[1].getDrones()[2].hidePiSeq();
                this.displayShop(this.shopS, this.shopSText);
                this.updateShopS();
                //this.shop1Active = false;
                this.shopSActive = true;
            });
        this.wExt = new Button(this, 550, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wext", 0.95,
            ()=>{
            this.wExt.removeInteractive();

            if(this.shopSActive){
                this.closeShop(this.shopS, this.shopSText, false);
                this.shopSActive = false;
            }
            if(this.shopZActive){
                this.closeShop(this.shopZ, this.shopZText, false);
                this.shopZActive = false;
            }
            if(this.shopWActive){
                this.closeShop(this.shopW, this.shopWText, false);
                this.shopWActive = false;
            }
            if(this.shopMActive){
                this.closeShop(this.shopM, this.shopMText, false);
                this.shopMActive = false;
            }
            //this.closeShop(this.shop1, this.shop1Text, false);
            this.shop_bg_back2.setVisible(true);
            this.players[0].getDrones()[2].hidePiSeq();
            this.players[1].getDrones()[2].hidePiSeq();
            this.displayShop(this.shopT, this.shopTText);
            this.updateShopT();
            //this.shop1Active = false;
            this.shopTActive = true;
                //system.pushSymbol(createWMod)
        });

        this.wModule = new Button(this, 750, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wmod",0.95,
            ()=>{
            this.wModule.removeInteractive();
            let player = this.turn.getCurrentPlayer();
            player.payEnergy(player.getEnergyCost("wmod"));
            player.raiseEnergyCost("wmod", 15);
            this.updateEnergyText();
            this.data.set("buy", "w");
            //this.updateShopW(true);
            this.updateShop1(true);
            this.wModule.removeInteractive();
            this.events.on("unlockW", ()=>{
                this.updateShop1(false);
            });
            let energy = player.getEnergy();
            let type = this.data.get("type");
                if(this.shopTActive){
                    this.updateShopT();
                    if(energy < player.getEnergyCost("weapon")){
                        this.closeShop(this.shopT, this.shopTText, false);
                        this.shop_bg_back2.setVisible(false);
                        this.shopTActive = false;
                    }
                }
                if(this.shopWActive){

                    let rCost = player.getEnergyCost("rocketl");
                    let wCost = player.getEnergyCost("weapon");

                    if(type == "rocketp"){
                        if(energy < rCost){
                            this.closeShop(this.shopW, this.shopWText, false);
                            this.shop_bg_back2.setVisible(false);
                            this.shopWActive = false;
                        }
                        else{
                            this.updateShopW(true);
                        }
                    }
                    else{
                        if(energy < wCost){
                            this.closeShop(this.shopW, this.shopWText, false);
                            this.shop_bg_back2.setVisible(false);
                            this.shopWActive = false;
                        }
                        else{
                            this.updateShopW(true);
                        }
                    }
                }
                if(this.shopZActive){
                    let type = this.data.get("type");
                    if(energy < player.getEnergyCost(type)){
                        this.closeShop(this.shopZ, this.shopZText, false);
                        this.displayShop(this.shopS, this.shopSText);
                        this.updateShopS();
                        this.shopZActive = false;
                        this.shopSActive = true;

                    }
                }
                if(this.shopMActive){
                    if(energy < player.getEnergyCost("motor")){
                        this.closeShop(this.shopM, this.shopMText, false);
                        this.shop_bg_back2.setVisible(false);
                        this.shopMActive = false;
                    }
                }

                if(this.shopSActive){
                    this.updateShopS();
                    if(energy < player.getEnergyCost("nano")){
                        this.closeShop(this.shopS, this.shopSText, false);
                        this.shop_bg_back2.setVisible(false);
                        this.shopSActive = false;
                    }
                }


                this.system.pushSymbol(this.system.add.channelOut('wmod'+ player.getNameIdentifier().charAt(1)+ player.getNrDrones(),'*' ).nullProcess());


        });



        this.solar = this.setButton(950, 1080-100, "ssr_solar_drone", 0.95,()=>{
            let system = this.system;
            let player = this.turn.getCurrentPlayer();
            this.solar.removeInteractive();
            player.payEnergy(player.getEnergyCost("solar"));
            player.raiseEnergyCost("solar", 20);
            this.updateEnergyText();
            this.updateEnergyRate(true);
            //this.updateShopW(false);
            this.data.set("buy", "s");
            this.updateShop1(true);
            this.solar.removeInteractive();
            this.events.on("unlockS", ()=>{
                this.updateShop1(false)
            });
            let energy = player.getEnergy();
            let type = this.data.get("type");
            if(this.shopTActive){
                this.updateShopT();
                if(energy < player.getEnergyCost("weapon")){
                    this.closeShop(this.shopT, this.shopTText, false);
                    this.shop_bg_back2.setVisible(false);
                    this.shopTActive = false;
                }
            }
            if(this.shopWActive){

                let rCost = player.getEnergyCost("rocketl");
                let wCost = player.getEnergyCost("weapon");

                if(type == "rocketp"){
                    if(energy < rCost){
                        this.closeShop(this.shopW, this.shopWText, false);
                        this.shop_bg_back2.setVisible(false);
                        this.shopWActive = false;
                    }
                    else{
                        this.updateShopW(true);
                    }
                }
                else{
                    if(energy < wCost){
                        this.closeShop(this.shopW, this.shopWText, false);
                        this.shop_bg_back2.setVisible(false);
                        this.shopWActive = false;
                    }
                    else{
                        this.updateShopW(true);
                    }
                }
            }
            if(this.shopZActive){
                let type = this.data.get("type");
                if(energy < player.getEnergyCost(type)){
                    this.closeShop(this.shopZ, this.shopZText, false);
                    this.displayShop(this.shopS, this.shopSText);
                    this.updateShopS();
                    this.shopZActive = false;
                    this.shopSActive = true;

                }
            }
            if(this.shopMActive){
                if(energy < player.getEnergyCost("motor")){
                    this.closeShop(this.shopM, this.shopMText, false);
                    this.shop_bg_back2.setVisible(false);
                    this.shopMActive = false;
                }
            }

            if(this.shopSActive){
                this.updateShopS();
                if(energy < player.getEnergyCost("nano")){
                    this.closeShop(this.shopS, this.shopSText, false);
                    this.shop_bg_back2.setVisible(false);
                    this.shopSActive = false;
                }
            }

                system.pushSymbol(system.add.channelOut("newsolar"+ player.getNameIdentifier().charAt(1)+player.getSmallestIndexSD(), "solar"+player.getNameIdentifier().charAt(1)+player.getSmallestIndexSD()).nullProcess())

        });
        this.solar.setAlt(this, 950, 1080-100, "ssb_solar_drone");

        this.motors = this.setButton(1150, 1080-100, "motor", 0.95,()=>{
            this.motors.removeInteractive();
            let system = this.system;
            let player = this.turn.getCurrentPlayer();
            if(this.shopSActive){
                this.closeShop(this.shopS, this.shopSText, false);
                this.shopSActive = false;
            }
            if(this.shopZActive){
                this.closeShop(this.shopZ, this.shopZText, false);
                this.shopZActive = false;
            }
            if(this.shopTActive){
                this.closeShop(this.shopT, this.shopTText, false);
                this.shopTActive = false;
            }
            if(this.shopWActive){
                this.closeShop(this.shopW, this.shopWText, false);
                this.shopWActive = false;
            }
            //this.closeShop(this.shop1, this.shop1Text, false);
            this.shop_bg_back2.setVisible(true);
            this.players[0].getDrones()[2].hidePiSeq();
            this.players[1].getDrones()[2].hidePiSeq();
            this.displayShop(this.shopM, this.shopMText);
            this.updateShopM("");
            this.shopMActive = true;

            //system.pushSymbol(system.add.channelOut("newsolar"+ player.getNameIdentifier().charAt(1)+player.getSmallestIndexSD(), "solar"+player.getNameIdentifier().charAt(1)+player.getSmallestIndexSD()).nullProcess())

        });

        this.close = new Button(this, 1350, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",0.95,
            ()=>{
                this.close.removeInteractive();
                if(this.shopSActive){
                    this.closeShop(this.shopS, this.shopSText, false);
                    this.shopSActive = false;
                }
                if(this.shopZActive){
                    this.closeShop(this.shopZ, this.shopZText, false);
                    this.shopZActive = false;
                }
                if(this.shopTActive){
                    this.closeShop(this.shopT, this.shopTText, false);
                    this.shopTActive = false;
                }
                if(this.shopWActive){
                    this.closeShop(this.shopW, this.shopWText, false);
                    this.shopWActive = false;
                }
                if(this.shopMActive){
                    this.closeShop(this.shopM, this.shopMText, false);
                    this.shopMActive = false;
                }
                this.shop_bg_back2.setVisible(false);
                this.turn.getCurrentPlayer().getDrones()[2].showPiSeq();
                this.closeShop(this.shop1, this.shop1Text, true);
                this.openShop.setVisible(true);
                this.shop.setVisible();
                this.shop.restoreInteractive();
                this.shop1Active = false;

            });

        this.skip = new Button(this, 1550, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_skip",0.95,
            ()=>{
                if(this.turn.clickable){
                    this.roundTimebar.stopTimer();
                    // this.turn.Attackturn();
                    this.system.pushSymbol(this.system.add.channelOut("closeshop", "*").nullProcess());
                    this.system.pushSymbol(this.system.add.channelOut(
                        'shopp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'end', '').
                    nullProcess());
                    if(this.shopTActive){
                        this.closeShop(this.shopT, this.shopTText, false);
                        this.shopTActive = false;
                    }
                    if(this.shopSActive){
                        this.closeShop(this.shopS, this.shopSText, false);
                        this.shopSActive = false;
                    }
                    if(this.shopZActive){
                        this.closeShop(this.shopZ, this.shopZText, false);
                        this.shopZActive = false;
                    }
                    if(this.shopWActive){
                        this.closeShop(this.shopW, this.shopWText, false);
                        this.shopWActive = false;
                    }
                    if(this.shopMActive){
                        this.closeShop(this.shopM, this.shopMText, false);
                        this.shopMActive = false;
                    }
                    this.shop_bg_back2.setVisible(false);
                    this.players[0].getDrones()[2].showPiSeq();
                    this.players[1].getDrones()[2].showPiSeq();
                    this.closeShop(this.shop1, this.shop1Text, true);
                    this.shop1Active = false;
                    this.energy.setVisible(false);
                    this.energyT.setVisible(false);
                    this.energyRegen.setVisible(false);

                }
        });


        this.shop1 = [this.regen, this.wExt, this.wModule, this.solar, this.motors, this.close, this.skip];
        this.shop1Text = [
            this.add.text(315, 1080-50, "Regenerate", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(515, 1080-50, "wExt", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(715, 1080-50, "wMod", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(915, 1080-50, "Solar", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1115, 1080-50, "Engine", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1315, 1080-50, "close", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1510, 1080-50, "end turn", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false)
        ];

        let infobox = <Infobox> this.data.get("infoboxx");

        this.energySym = this.createEnergyCostIcons();
        this.energyCostText = this.createEnergyCostText();

        infobox.addTooltipInfo(this.regen.bg, "Regenerate any of your existing hitzones with different types of shields.", [() => this.regen.onClick(), () => {this.regen.hovering = true; this.regen.updateStep();}, () => {this.regen.hovering = false; this.regen.updateStep();}]);
        infobox.addTooltipInfo(this.wExt.bg, "Buy up to 3 weapons for each drone.", [() =>this.wExt.onClick(), () => {this.wExt.hovering = true; this.wExt.updateStep();}, () => {this.wExt.hovering = false; this.wExt.updateStep();}]);
        infobox.addTooltipInfo(this.wModule.bg, "Add up to 2 drones equip more weapons.", [() =>this.wModule.onClick(), () => {this.wModule.hovering = true; this.wModule.updateStep();}, () => {this.wModule.hovering = false; this.wModule.updateStep();}]);
        infobox.addTooltipInfo(this.solar.bg, "Collect +25 Energy per round.", [() =>this.solar.onClick(), () => {this.solar.hovering = true; this.solar.updateStep();}, () => {this.solar.hovering = false; this.solar.updateStep();}]);
        infobox.addTooltipInfo(this.skip.bg, "Attack opponent with all weapons.", [() => this.skip.onClick(), () => {this.skip.hovering = true; this.skip.updateStep();}, () => {this.skip.hovering = false; this.skip.updateStep();}]);
        infobox.addTooltipInfo(this.close.bg, "Close the shop to see more of these beautiful stars.", [() =>this.close.onClick(), () => {this.close.hovering = true; this.close.updateStep();}, () => {this.close.hovering = false; this.close.updateStep();}]);
        infobox.addTooltipInfo(this.motors.bg, "Buy new Engines to boost your Evasion.", [() => this.motors.onClick(), () => {this.motors.hovering = true; this.motors.updateStep();}, () => {this.motors.hovering = false; this.motors.updateStep();}]);

        /* ## Weapons ## */

        /* ## Shields ## */


        infobox.addTooltipInfo(this.energySym[0], "The cheapest part costs " + this.energyCostText[0].text.toString() + " energy.");
        infobox.addTooltipInfo(this.energySym[1], "The cheapest part costs " + this.energyCostText[1].text.toString() + " energy.");
        infobox.addTooltipInfo(this.energySym[2], "The cheapest part costs " + this.energyCostText[2].text.toString() + " energy.");
        infobox.addTooltipInfo(this.energySym[3], "The cheapest part costs " + this.energyCostText[3].text.toString() + " energy.");
        infobox.addTooltipInfo(this.energyCostText[0], "The cheapest part costs " + this.energyCostText[0].text.toString() + " energy.");
        infobox.addTooltipInfo(this.energyCostText[1], "The cheapest part costs " + this.energyCostText[1].text.toString() + " energy.");
        infobox.addTooltipInfo(this.energyCostText[2], "The cheapest part costs " + this.energyCostText[2].text.toString() + " energy.");
        infobox.addTooltipInfo(this.energyCostText[3], "The cheapest part costs " + this.energyCostText[3].text.toString() + " energy.");


        this.closeShop(this.shop1, this.shop1Text, true);

        /*this.shieldText = this.add.text(1920-500, 330, "Shield", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});*/

    }

    creatChooseRegen():void{

        if(this.armor) this.infobox.removeTooltipInfo(this.armor.bg);
        if(this.shield) this.infobox.removeTooltipInfo(this.shield.bg);
        if(this.rocketS) this.infobox.removeTooltipInfo(this.rocketS.bg);
        if(this.adapt) this.infobox.removeTooltipInfo(this.adapt.bg);
        if(this.nano) this.infobox.removeTooltipInfo(this.nano.bg);

        this.armor = this.setButton(500, 1080-300, "button_armor", 0.6, ()=>{
            this.armor.removeInteractive();
            this.data.set("type", "armor");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;
        });


        this.shield = this.setButton(675, 1080-300, "button_shield", 0.6,()=>{
            this.shield.removeInteractive();
            this.data.set("type", "shield");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;

        });

        this.rocketS = this.setButton(850, 1080-300, "button_rocket", 0.6,()=>{
            this.rocketS.removeInteractive();
            this.data.set("type", "rocket");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;


        });


        this.nano = this.setButton(1025, 1080-300, "button_nano", 0.6,()=>{
            this.nano.removeInteractive();
            this.data.set("type", "nano");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;

        });
        this.adapt = this.setButton(1200, 1080-300, "button_adapt", 0.6,()=>{
            this.adapt.removeInteractive();
            this.data.set("type", "adap");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;


        });

        this.closeS = this.setButton(1375, 1080-300, "button_back", 0.6,()=>{
            this.shop_bg_back2.setVisible(false);
            this.players[0].getDrones()[2].showPiSeq();
            this.players[1].getDrones()[2].showPiSeq();
            this.closeShop(this.shopS, this.shopSText, false);
            //this.displayShop(this.shop1, this.shop1Text);
            this.shopSActive = false;
            //this.shop1Active = true;
            this.updateShop1(false);


        });

        this.shopS = [this.armor, this.shield, this.rocketS, this.nano, this.adapt, this.closeS];

        this.shopSText = [
            this.add.text(415, 1080-50, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(615, 1080-50, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(815, 1080-50, "Hyper", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1015, 1080-50, "Nano", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1200, 1080-50, "Adaptive", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1345, 1080-250, "back", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false)
        ];
        this.energyShopS = this.createEnergyCostIconsS();
        this.energyTextS = this.createEnergyCostTextS();
        this.closeShop(this.shopS, this.shopSText, false);


        this.infobox.addTooltipInfo(this.rocketS.bg, "Hyper Shields can only be destroyed by [R]ockets.", [() =>this.rocketS.onClick(), () => {this.rocketS.hovering = true; this.rocketS.updateStep();}, () => {this.rocketS.hovering = false; this.rocketS.updateStep();}]);
        this.infobox.addTooltipInfo(this.shield.bg, "Laser [S]hields can be destroyed by Rockets and Projectiles.", [() => this.shield.onClick(), () => {this.shield.hovering = true; this.shield.updateStep();}, () => {this.shield.hovering = false; this.shield.updateStep();}]);
        this.infobox.addTooltipInfo(this.armor.bg, "[A]rmor Shields can be destroyed by Lasers and Projectiles.", [() =>this.armor.onClick(), () => {this.armor.hovering = true; this.armor.updateStep();}, () => {this.armor.hovering = false; this.armor.updateStep();}]);
        this.infobox.addTooltipInfo(this.nano.bg, "Nano Shields can be destroyed by all Weapons. But they are cheap!", [() =>this.nano.onClick(), () => {this.nano.hovering = true; this.nano.updateStep();}, () => {this.nano.hovering = false; this.nano.updateStep();}]);
        this.infobox.addTooltipInfo(this.adapt.bg, "Adaptive Shields. Will add two shields. The second shield will change to Rocket,\n" +
            "Laser or Armor Shield based on the Weapon that hits the first shield.\n" +
            "Rocket -> Rocket Shield; Laser -> Laser Shield; Projectile -> Armor Shield", [() =>this.adapt.onClick(), () => {this.adapt.hovering = true; this.adapt.updateStep();}, () => {this.adapt.hovering = false; this.adapt.updateStep();}]);


    }


    createChooseZones(): void{
        let player = this.turn.getCurrentPlayer();
        this.zone1 = new Button(this, 550, 1080-300, "button_shadow",
            "button_bg", "button_fg", "sym_zone",0.6,
            () => {
                this.zone1.removeInteractive();
                let type = this.data.get("type");
                this.regShield(type);
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z1','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shopS, this.shopSText);
                this.updateShopS();
                this.shopSActive = true;
                this.updateShop1(false);
                this.shopZActive = false;

            });

        this.zone2 = new Button(this, 750, 1080-300, "button_shadow",
            "button_bg", "button_fg", "sym_zone",0.6,
            () => {
                this.zone2.removeInteractive();
                let type = this.data.get("type");
                this.regShield(type);
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z2','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shopS, this.shopSText);
                this.updateShopS();
                this.shopSActive = true;
                this.updateShop1(false);
                this.shopZActive = false;
            });

        this.zone3 = new Button(this, 950, 1080-300, "button_shadow",
            "button_bg", "button_fg", "sym_zone",0.6,
            () => {
                this.zone3.removeInteractive();
                let type = this.data.get("type");
                this.regShield(type);
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z3','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shopS, this.shopSText);
                this.updateShopS();
                this.shopSActive = true;
                this.updateShop1(false);
                this.shopZActive = false;
            });
        this.zone4 = new Button(this, 1150, 1080-300, "button_shadow",
            "button_bg", "button_fg", "sym_zone",0.6,
            () => {
                this.zone4.removeInteractive();
                let type = this.data.get("type");
                this.regShield(type);
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z4','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shopS, this.shopSText);
                this.updateShopS();
                this.shopSActive = true;
                this.updateShop1(false);
                this.shopZActive = false;
            });

        this.back = new Button(this, 1350, 1080-300, "button_shadow",
            "button_bg", "button_fg", "button_back",0.6,
            ()=>{

                    this.closeShop(this.shopZ, this.shopZText, false);
                    this.displayShop(this.shopS, this.shopSText);
                    this.shopSActive = true;
                    this.shopZActive = false;


            });

            this.shopZ = [this.zone1, this.zone2, this.zone3, this.zone4, this.back];
            this.shopZText = [
                this.add.text(410, 1080-50, "Hitzone1", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
                this.add.text(660, 1080-50, "Hitzone2", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
                this.add.text(910, 1080-50, "Hitzone3", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
                this.add.text(1160, 1080-50, "Hitzone4", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
                this.add.text(1330, 1080-250, "back", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false)
            ];

            this.closeShop(this.shopZ, this.shopZText, false);

    }

    private createChooseType(): void{
        if(this.laser) this.infobox.removeTooltipInfo(this.laser.bg);
        if(this.projectile) this.infobox.removeTooltipInfo(this.projectile.bg);
        if(this.rocket) this.infobox.removeTooltipInfo(this.rocket.bg);
        this.laser = new Button(this, 550, 1080-300, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_las",0.6,
            () => {
                this.laser.removeInteractive();
                this.data.set("type", "armorp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.laser.setAlt(this, 550, 1080-300, "ssb_weap_las");

        this.projectile = new Button(this, 800, 1080-300, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_pro",0.6,
            () => {
                this.projectile.removeInteractive();
                this.data.set("type", "shieldp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.projectile.setAlt(this, 800, 1080-300, "ssb_weap_pro");

        this.rocket = new Button(this, 1050, 1080-300, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_rock",0.6,
            () => {
                this.rocket.removeInteractive();
                this.data.set("type", "rocketp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.rocket.setAlt(this, 1050, 1080-300, "ssb_weap_rock");
        this.backT = new Button(this, 1300, 1080-300, "button_shadow",
            "button_bg", "button_fg", "button_back",0.6,
            ()=>{

                this.closeShop(this.shopT, this.shopTText, false);
                this.shop_bg_back2.setVisible(false);
                this.players[0].getDrones()[2].showPiSeq();
                this.players[1].getDrones()[2].showPiSeq();
                //this.displayShop(this.shop1, this.shop1Text);
                this.shopTActive = false;
                this.updateShop1(false);
                //this.shop1Active = true;


            });
        this.shopT = [this.laser, this.projectile, this.rocket, this.backT];
        this.shopTText = [
            this.add.text(550-30, 1080-250, "Laser", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
            this.add.text(800-40, 1080-250, "Projectile", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
            this.add.text(1100-30, 1080-250, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
            this.add.text(1300-20, 1080-250, "back", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false)

        ];
        this.energyShopT = this.createEnergyCostIconsT();
        this.energyCostT = this.createEnergyCostTextT();
        this.closeShop(this.shopT, this.shopTText, false);

        this.infobox.addTooltipInfo(this.rocket.bg, "Rockets. Can destroy all shields and will hardly miss.", [() =>this.rocket.onClick(), () => {this.rocket.hovering = true; this.rocket.updateStep();}, () => {this.rocket.hovering = false; this.rocket.updateStep();}]);
        this.infobox.addTooltipInfo(this.laser.bg, "Lasers. Destroys all Shields\n except Laser Shields and Hyper Shields.", [() => this.laser.onClick(), () => {this.laser.hovering = true; this.laser.updateStep();}, () => {this.laser.hovering = false; this.laser.updateStep();}]);
        this.infobox.addTooltipInfo(this.projectile.bg, "Projectile Weapons. Destroys all Shields\n except Armor and Hyper Shields.", [() =>this.projectile.onClick(), () => {this.projectile.hovering = true; this.projectile.updateStep();}, () => {this.projectile.hovering = false; this.projectile.updateStep();}]);

    }

    createChooseMod(): void{
        this.ship = new Button(this, 550, 1080-300, "button_shadow",
            "button_bg", "button_fg", "button_space_shuttle",0.6,
            ()=>{
                this.ship.removeInteractive();
                let player = this.turn.getCurrentPlayer();
                if(this.data.get("type") == "rocketp"){
                    player.payEnergy(player.getEnergyCost("rocketl"));
                }
                else{
                    player.payEnergy(player.getEnergyCost("weapon"));
                }
                this.updateEnergyText();
                let term = "wext"+player.getNameIdentifier().charAt(1) + "0" + player.getDrones()[0].getNrWeapons();
                //this.updateShopW(true);
                this.data.set("buy", "s");
                this.system.pushSymbol(this.system.add.channelOut(term, this.data.get("type")+this.getOpponentNr(player)).nullProcess());
                this.closeShop(this.shopW, this.shopWText,false);
                this.displayShop(this.shopT, this.shopTText);
                this.updateShopT();
                this.updateShop1(false);
                this.shopTActive = true;
                this.shopWActive = false;
                //system.pushSymbol(createWMod)
        });
        this.drone1 = new Button(this, 800, 1080-300, "button_shadow",
            "button_bg", "button_fg", "button_wmod",0.6,
            ()=>{
                this.drone1.removeInteractive();
                let player = this.turn.getCurrentPlayer();
                let term = "wext"+player.getNameIdentifier().charAt(1) + "1" + player.getDrones()[1].getNrWeapons();
                if(this.data.get("type") == "rocketp"){
                    player.payEnergy(player.getEnergyCost("rocketl"));
                }
                else{
                    player.payEnergy(player.getEnergyCost("weapon"));
                }                this.updateEnergyText();
                //this.updateShopW(true);
                this.data.set("buy", "d1");
                this.system.pushSymbol(this.system.add.channelOut(term, this.data.get("type")+this.getOpponentNr(player)).nullProcess());
                this.closeShop(this.shopW, this.shopWText,false);
                this.displayShop(this.shopT, this.shopTText);
                this.updateShopT();
                this.updateShop1(false);
                this.shopTActive = true;
                this.shopWActive = false;
        });

        this.drone2 = new Button(this, 1050, 1080-300, "button_shadow",
            "button_bg", "button_fg", "button_wmod",0.6,
            ()=>{
                this.drone2.removeInteractive();
                let player = this.turn.getCurrentPlayer();
                let term = "wext"+player.getNameIdentifier().charAt(1) + "2" + player.getDrones()[2].getNrWeapons();
                if(this.data.get("type") == "rocketp"){
                    player.payEnergy(player.getEnergyCost("rocketl"));
                }
                else{
                    player.payEnergy(player.getEnergyCost("weapon"));
                }                this.updateEnergyText();
                //this.updateShopW(true);
                this.data.set("buy", "d2");
                this.system.pushSymbol(this.system.add.channelOut(term, this.data.get("type")+this.getOpponentNr(player)).nullProcess());
                this.closeShop(this.shopW, this.shopWText,false);
                this.displayShop(this.shopT, this.shopTText);
                this.updateShopT();
                this.updateShop1(false);
                this.shopTActive = true;
                this.shopWActive = false;
        });
        this.close2 = new Button(this, 1300, 1080-300, "button_shadow",
            "button_bg", "button_fg", "button_back", 0.6,
            ()=>{
                this.closeShop(this.shopW, this.shopWText, false);
                this.displayShop(this.shopT, this.shopTText);
                this.shopTActive = true;
                this.shopWActive = false;
        });

        this.shopW = [this.ship, this.drone1, this.drone2, this.close2];
        this.shopWText = [
            this.add.text(550-30, 1080-2500, "ship", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(800-40, 1080-50, "drone 1", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1100-30, 1080-50, "drone 2", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1300-30, 1080-250, "back", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
        ];
        this.closeShop(this.shopW, this.shopWText, false);
    }

    createChooseMotor(): void{
        this.motorL = new Button(this, 550, 1080-300, "button_shadow",
            "button_bg", "button_fg", "motorL",0.6,
            ()=>{
                this.motorL.removeInteractive();
                let player = this.turn.getCurrentPlayer();
                player.payEnergy(player.getEnergyCost("motor"));
                this.updateEnergyText();
                let term = "buymotorlaser"+player.getNameIdentifier().charAt(1) + (player.getActiveMotorL()+1);
                //this.updateShopW(true);

                this.data.set("buy", "motorL");
                this.system.pushSymbol(this.system.add.channelOut(term ,'').nullProcess());
                this.updateShop1(false);
                this.updateShopM("L");

                //system.pushSymbol(createWMod)
            });
        this.motorP = new Button(this, 800, 1080-300, "button_shadow",
            "button_bg", "button_fg", "motorP",0.6,
            ()=>{
                this.motorP.removeInteractive();
                let player = this.turn.getCurrentPlayer();
                player.payEnergy(player.getEnergyCost("motor"));
                this.updateEnergyText();
                let term = "buymotorprojectile"+player.getNameIdentifier().charAt(1) + (player.getActiveMotorP()+1);
                //this.updateShopW(true);
                this.data.set("buy", "motorP");
                this.system.pushSymbol(this.system.add.channelOut(term, '').nullProcess());
                this.updateShop1(false);
                this.updateShopM("P");

            });

        this.motorR = new Button(this, 1050, 1080-300, "button_shadow",
            "button_bg", "button_fg", "motorR",0.6,
            ()=>{
                this.motorR.removeInteractive();
                let player = this.turn.getCurrentPlayer();
                player.payEnergy(player.getEnergyCost("motor"));
                this.updateEnergyText();
                let term = "buymotorrocket"+player.getNameIdentifier().charAt(1) + (player.getActiveMotorR()+1);
                //this.updateShopW(true);
                this.data.set("buy", "motorR");
                this.system.pushSymbol(this.system.add.channelOut(term, "").nullProcess());
                this.updateShop1(false);
                this.updateShopM("R");
            });

        this.backM = new Button(this, 1300, 1080-300, "button_shadow",
            "button_bg", "button_fg", "button_back", 0.6,
            ()=>{
                this.closeShop(this.shopM, this.shopMText, false);
                this.shop_bg_back2.setVisible(false);
                this.players[0].getDrones()[2].showPiSeq();
                this.players[1].getDrones()[2].showPiSeq();
                this.shopMActive = false;

                this.updateShop1(false);

            });

        this.shopM = [this.motorL, this.motorP, this.motorR, this.backM];
        this.shopMText = [
            this.add.text(550-30, 1080-250, "Laser", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
            this.add.text(800-40, 1080-250, "Projectile", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
            this.add.text(1050-30, 1080-250, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
            this.add.text(1300-30, 1080-250, "back", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2}).setVisible(false),
        ];
        this.closeShop(this.shopM, this.shopMText, false);
        this.infobox.addTooltipInfo(this.motorL.bg, "Engine, that enhances evasion of Laser attacks", [() => this.motorL.onClick(), () => {this.motorL.hovering = true; this.motorL.updateStep();}, () => {this.motorL.hovering = false; this.motorL.updateStep();}]);
        this.infobox.addTooltipInfo(this.motorP.bg, "Engine, that enhances evasion of Projectile attacks", [() => this.motorP.onClick(), () => {this.motorP.hovering = true; this.motorP.updateStep();}, () => {this.motorP.hovering = false; this.motorP.updateStep();}]);
        this.infobox.addTooltipInfo(this.motorR.bg, "Engine, that enhances evasion of Rocket attacks", [() => this.motorR.onClick(), () => {this.motorR.hovering = true; this.motorR.updateStep();}, () => {this.motorR.hovering = false; this.motorR.updateStep();}]);

    }

    setButton(x : number, y : number, pic : string, scale: number, onclick: Function = ()=>{}) : Button{
        return new Button(this, x, y, "button_shadow",
            "button_bg", "button_fg", pic, scale, onclick);

    }

    closeShop(array: Button[], text: Phaser.GameObjects.Text[],closeBg: boolean): void{
        this.turn.getCurrentPlayer().getDrones()[2].showPiSeq();
        for(let b of array){
            b.setInvisible();
            b.removeInteractive();
        }
        if(closeBg){
            this.shop_bg_back.setVisible(false);
            this.shop_bg_out.setVisible(false);
        }

        for(let t of text){
            t.setVisible(false);
        }

        if(array == this.shop1) {
            for (let i of this.energySym) {
                i.setVisible(false);
                i.removeInteractive()
            }
            for (let t of this.energyCostText) {
                t.setVisible(false);
                t.removeInteractive()
            }
        }
        else if(array == this.shopT) {
            for (let i of this.energyShopT) {
                i.setVisible(false);
            }
            for (let t of this.energyCostT) {
                t.setVisible(false);
            }
        }
        else if(array == this.shopS) {
            for (let i of this.energyShopS) {
                i.setVisible(false);
            }
            for (let t of this.energyTextS) {
                t.setVisible(false);
            }
        }
    }

    displayShop(array: Button[], text: Phaser.GameObjects.Text[]): void{

        for(let b of array){
            b.setVisible();
            b.restoreInteractive();
        }

        for(let t of text){
            t.setVisible(true);
        }
        if(array == this.shop1) {
            for (let i of this.energySym) {
                i.setVisible(true);
                i.setInteractive();
            }
            for (let t of this.energyCostText) {
                t.setVisible(true);
                t.setInteractive();
            }
        }
        else if(array == this.shopT) {
            for (let i of this.energyShopT) {
                i.setVisible(true);
            }
            for (let t of this.energyCostT) {
                t.setVisible(true);
            }
        }
        else if(array == this.shopS){
            for (let i of this.energyShopS) {
                i.setVisible(true);
            }
            for (let t of this.energyTextS) {
                t.setVisible(true);
            }
        }
    }

    updateShop1(bought: boolean): void{
        let player = this.turn.getCurrentPlayer();
        let energy = player.getEnergy();
        let regenCost = player.getEnergyCost("nano");
        let wmodCost = player.getEnergyCost("wmod");
        let weaponCost = player.getEnergyCost("weapon");
        let solarCost = player.getEnergyCost("solar");
        let motorCost = player.getEnergyCost("motor");

        let wMods = player.getNrDrones();
        let sMods = player.getNrSolarDrones();
        this.updateEnergyCostText();

        if(bought){
            if(this.data.get("buy") == "w"){
                wMods++;
            }
            else{
                sMods++;
            }
        }

        if(energy < motorCost){
            this.motors.changeButton(this, false, false, player);
            this.motors.removeInteractive();
            this.children.remove(this.shop1Text[4]);
            this.shop1Text[4] = this.add.text(1100, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }

        else if(energy >= motorCost){
            this.motors.changeButton(this, false, true, player);
            this.motors.restoreInteractive();
            this.children.remove(this.shop1Text[4]);
            this.shop1Text[4] = this.add.text(1115, 1080 - 50, "Engine", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }

        if(wMods >= 3 || energy < wmodCost){
            this.wModule.changeButton(this,false,false, player);
            this.wModule.removeInteractive();
            if(wMods >= 3) {
                this.children.remove(this.shop1Text[2]);
                this.shop1Text[2] = this.add.text(715, 1080 - 50, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                });
            }
            else{
                this.children.remove(this.shop1Text[2]);
                this.shop1Text[2] = this.add.text(700, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                });
            }



        }
        else if(wMods < 3 && energy >= wmodCost){
            this.wModule.changeButton(this,false,true, player);
            this.wModule.restoreInteractive();
            this.active = true;
            this.children.remove(this.shop1Text[2]);
            this.shop1Text[2] = this.add.text(715, 1080 - 50, "wMod", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }



        if(sMods >= 5 || energy < solarCost){

            if(this.turn.getCurrentPlayer().getNameIdentifier() == "P1"){
                this.solar.changeButton(this,false,false, player);
            }
            else{
                this.solar.changeButton(this,true,false, player);
            }
            this.solar.removeInteractive();
            this.children.remove(this.shop1Text[3]);
            if(sMods >= 5){
                this.shop1Text[3] = this.add.text(920, 1080 - 50, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                })
            }

            else{
                this.shop1Text[3] = this.add.text(900, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                })
            }

        }

        else if(sMods < 5 && energy >= solarCost){
            if(this.turn.getCurrentPlayer().getNameIdentifier() == "P1"){
                this.solar.changeButton(this,false,true, player);
            }
            else{
                this.solar.changeButton(this,true,true, player);
            }
            this.solar.restoreInteractive();
            this.children.remove(this.shop1Text[3]);
            this.shop1Text[3] = this.add.text(915, 1080 - 50, "Solar", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            })
        }

        if(energy < regenCost){
            this.regen.changeButton(this,false,false, player);
            this.regen.removeInteractive();

            this.children.remove(this.shop1Text[0]);
            this.shop1Text[0] = this.add.text(300, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
            if(this.shopSActive){
                this.closeShop(this.shopS, this.shopSText, false);
                this.shop_bg_back2.setVisible(false);
                this.players[0].getDrones()[2].showPiSeq();
                this.players[1].getDrones()[2].showPiSeq();
                this.shopSActive = false;
            }

        }

        else if(energy >= regenCost){
            this.regen.changeButton(this, false, true, player);
            this.regen.restoreInteractive();
            this.children.remove(this.shop1Text[0]);
            this.shop1Text[0] = this.add.text(285, 1080 - 50, "Regenerate", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });


        }

        if(energy < weaponCost){
            this.wExt.changeButton(this,false,false, player);
            this.wExt.removeInteractive();
            this.children.remove(this.shop1Text[1]);
            this.shop1Text[1] = this.add.text(500, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }

        else if(energy >= weaponCost){
            this.wExt.changeButton(this, false,true, player);
            this.wExt.restoreInteractive();
            this.children.remove(this.shop1Text[1]);
            this.shop1Text[1] = this.add.text(515, 1080 - 50, "wExt", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }
    }

    updateShopW(bought: boolean): void
    {
        let player = this.turn.getCurrentPlayer();
        let energy = player.getEnergy();
        let weaponCost = player.getEnergyCost("weapon");
        let drones = player.getDrones();
        let dronesNr = player.getNrDrones();
        let shipActive = drones[0].getNrWeapons();
        let d1Active = drones[1].getNrWeapons();
        let d2Active = drones[2].getNrWeapons();
        if(bought){
            let buy = this.data.get("buy");
            if(buy == "w"){
                dronesNr++;
            }
            else if(buy == "s"){
                shipActive++;
            }
            else if(buy == "d1"){
                d1Active++;
            }
            else if(buy == "d2"){
                d2Active++;
            }
        }

        if(shipActive >= 3 || energy < weaponCost){
            this.ship.changeButton(this, false, false, player);
            this.ship.removeInteractive();
            this.children.remove(this.shopWText[0]);
            if(shipActive >= 3){
                this.shopWText[0] = this.add.text(550-60, 1080 - 250, "max weapons", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopWText[0] = this.add.text(550-40, 1080 - 250, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }

        }
        else if(shipActive < 3 && energy >= weaponCost){
            this.ship.changeButton(this, false, true, player);
            this.ship.restoreInteractive();
            this.children.remove(this.shopWText[0]);

            this.shopWText[0] = this.add.text(550-20, 1080 - 250, "ship", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);

        }

        if(dronesNr < 2 || d1Active >= 3 || energy < weaponCost)
        {
            this.drone1.changeButton(this, false, false, player);
            this.drone1.removeInteractive();
            this.children.remove(this.shopWText[1]);
            if(dronesNr < 2){
                this.shopWText[1] = this.add.text(800-40, 1080 - 250, "not built", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else if(d1Active >= 3){
                this.shopWText[1] = this.add.text(800-60, 1080 - 250, "max weapons", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopWText[1] = this.add.text(800-40, 1080 - 250, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
        }

        else if(dronesNr >= 2 && d1Active < 3 && energy >= weaponCost){
            this.drone1.changeButton(this, false, true, player);
            this.drone1.restoreInteractive();
            this.children.remove(this.shopWText[1]);
            this.shopWText[1] = this.add.text(800-40, 1080 - 250, "drone 1", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);

        }

        if(dronesNr < 3 || d2Active >= 3 || energy < weaponCost)
        {
            this.drone2.changeButton(this, false,false, player);
            this.drone2.removeInteractive();
            this.children.remove(this.shopWText[2]);
            if(dronesNr < 3){
                this.shopWText[2] = this.add.text(1050-40, 1080 - 250, "not built", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else if(d1Active >= 3){
                this.shopWText[2] = this.add.text(1050-60, 1080 - 250, "max weapons", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopWText[2] = this.add.text(1050-40, 1080 - 250, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
        }

        else if(dronesNr >= 3 && d2Active < 3 && energy >= weaponCost){
            this.drone2.changeButton(this, false,true, player);
            this.drone2.restoreInteractive();
            this.children.remove(this.shopWText[2]);
            this.shopWText[2] = this.add.text(1050-40, 1080 - 250, "drone 2", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);

        }
    }

    updateShopT(): void{
        let player = this.turn.getCurrentPlayer();
        let energy = player.getEnergy();
        let weaponCost = player.getEnergyCost("weapon");
        let rocketCost = player.getEnergyCost("rocketl");
        this.updateEnergyCostT();
        if(energy < rocketCost){
            if(player.getNameIdentifier() == "P1"){
                this.rocket.changeButton(this, false, false, player);
            }
            else{
                this.rocket.changeButton(this, true, false, player);
            }
            this.rocket.removeInteractive();
            this.children.remove(this.shopTText[2]);
            this.shopTText[2] = this.add.text(1010, 1080 - 250, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= rocketCost){
            if(player.getNameIdentifier() == "P1"){
                this.rocket.changeButton(this, false, true, player);
            }
            else{
                this.rocket.changeButton(this, true, true, player);
            }
            this.rocket.restoreInteractive();
            this.children.remove(this.shopTText[2]);
            this.shopTText[2] = this.add.text(1020, 1080 - 250, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
    }

    updateShopS(): void{
        let player = this.turn.getCurrentPlayer();
        let energy = player.getEnergy();
        let armorCost = player.getEnergyCost("armor");
        let shieldCost = player.getEnergyCost("shield");
        let rocketCost = player.getEnergyCost("rocket");
        let nanoCost = player.getEnergyCost("nano");
        let adaptCost = player.getEnergyCost("adap");
        this.updateEnergyCostTextS();
        if(energy < armorCost){

            this.armor.changeButton(this, false, false, player);

            this.armor.removeInteractive();
            this.children.remove(this.shopSText[0]);
            this.shopSText[0] = this.add.text(460, 1080 - 250, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= armorCost){
            this.armor.changeButton(this, false, true, player);

            this.armor.restoreInteractive();
            this.children.remove(this.shopSText[0]);
            this.shopSText[0] = this.add.text(470, 1080 - 250, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < shieldCost){

            this.shield.changeButton(this, false, false, player);

            this.shield.removeInteractive();
            this.children.remove(this.shopSText[1]);
            this.shopSText[1] = this.add.text(635, 1080 - 250, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= shieldCost){
            this.shield.changeButton(this, false, true, player);

            this.shield.restoreInteractive();
            this.children.remove(this.shopSText[1]);
            this.shopSText[1] = this.add.text(645, 1080 - 250, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < rocketCost){

            this.rocketS.changeButton(this, false, false, player);

            this.rocketS.removeInteractive();
            this.children.remove(this.shopSText[2]);
            this.shopSText[2] = this.add.text(810, 1080 - 250, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= rocketCost){
            this.rocketS.changeButton(this, false, true, player);

            this.rocketS.restoreInteractive();
            this.children.remove(this.shopSText[2]);
            this.shopSText[2] = this.add.text(820, 1080 - 250, "Hyper", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < nanoCost){

            this.nano.changeButton(this, false, false, player);

            this.nano.removeInteractive();
            this.children.remove(this.shopSText[3]);
            this.shopSText[3] = this.add.text(985, 1080 - 250, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= nanoCost){
            this.nano.changeButton(this, false, true, player);

            this.nano.restoreInteractive();
            this.children.remove(this.shopSText[3]);
            this.shopSText[3] = this.add.text(1000, 1080 - 250, "Nano", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < adaptCost){

            this.adapt.changeButton(this, false, false, player);

            this.adapt.removeInteractive();
            this.children.remove(this.shopSText[4]);
            this.shopSText[4] = this.add.text(1160, 1080 - 250, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= adaptCost){
            this.adapt.changeButton(this, false, true, player);

            this.adapt.restoreInteractive();
            this.children.remove(this.shopSText[4]);
            this.shopSText[4] = this.add.text(1160, 1080 - 250, "Adaptive", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
    }

    updateShopZ(): void{
        let player = this.turn.getCurrentPlayer();
        let zone1 = player.getHealth().zone1Bar.activeBars;
        let zone2 = player.getHealth().zone2Bar.activeBars;

        let zone3 = player.getHealth().zone3Bar.activeBars;
        let zone4 = player.getHealth().zone4Bar.activeBars;

        if(zone1 == 0){
            player.setDestroyedZone("z1");
            this.zone1.changeButton(this, false, false, player);
            this.zone1.removeInteractive();
            this.children.remove(this.shopZText[0]);
            this.shopZText[0] = this.add.text(510, 1080-250, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }
        else if(zone1 > 0){
            this.zone1.changeButton(this, false, true, player);
            this.zone1.restoreInteractive();
            this.children.remove(this.shopZText[0]);
            this.shopZText[0] = this.add.text(510, 1080-250, "Hitzone1", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }
        if(zone2 == 0){
            player.setDestroyedZone("z2");
            this.zone2.changeButton(this, false, false, player);
            this.zone2.removeInteractive();
            this.children.remove(this.shopZText[1]);
            this.shopZText[1] = this.add.text(710, 1080-250, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }
        else if(zone2 > 0){
            this.zone2.changeButton(this, false, true, player);
            this.zone2.restoreInteractive();
            this.children.remove(this.shopZText[1]);
            this.shopZText[1] = this.add.text(710, 1080-250, "Hitzone2", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }
        if(zone3 == 0){
            player.setDestroyedZone("z3");
            this.zone3.changeButton(this, false, false, player);
            this.zone3.removeInteractive();
            this.children.remove(this.shopZText[2]);
            this.shopZText[2] = this.add.text(910, 1080-250, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }
        else if(zone3 > 0){
            this.zone3.changeButton(this, false, true, player);
            this.zone3.restoreInteractive();
            this.children.remove(this.shopZText[2]);
            this.shopZText[2] = this.add.text(910, 1080-250, "Hitzone3", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }
        if(zone4 == 0){
            player.setDestroyedZone("z4");
            this.zone4.changeButton(this, false, false, player);
            this.zone4.removeInteractive();
            this.children.remove(this.shopZText[3]);
            this.shopZText[3] = this.add.text(1110, 1080-250, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }
        else if(zone4 > 0){
            this.zone4.changeButton(this, false, true, player);
            this.zone4.restoreInteractive();
            this.children.remove(this.shopZText[3]);
            this.shopZText[3] = this.add.text(1110, 1080-250, "Hitzone4", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})
        }

    }

    updateShopM(bought: string): void{
        let player = this.turn.getCurrentPlayer();
        let activeL = player.getActiveMotorL(); // placeholder
        let activeP = player.getActiveMotorP(); // placeholder
        let activeR = player.getActiveMotorR(); // placeholder
        let energy = player.getEnergy();
        let cost = player.getEnergyCost("motor");
        if(bought == "L"){
            activeL++;
        }
        else if(bought == "P"){
            activeP++;
        }
        else if(bought == "R"){
            activeR++;
        }
        if(activeL >= 3 || energy < cost){
            this.motorL.changeButton(this, false, false, player);
            this.motorL.removeInteractive();
            this.children.remove(this.shopMText[0]);
            if(activeL >= 3){
                this.shopMText[0] = this.add.text(525, 1080 - 250, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopMText[0] = this.add.text(510, 1080 - 250, "!energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }

        }
        else if(activeL < 3 && energy >= cost){
            this.motorL.changeButton(this, false, true, player);
            this.motorL.restoreInteractive();
            this.children.remove(this.shopMText[0]);
            this.shopMText[0] = this.add.text(520, 1080 - 250, "Laser", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
        if(activeP >= 3 || energy < cost){
            this.motorP.changeButton(this, false, false, player);
            this.motorP.removeInteractive();
            this.children.remove(this.shopMText[1]);
            if(activeP >= 3){
                this.shopMText[1] = this.add.text(800-25, 1080 - 250, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopMText[1] = this.add.text(800-40, 1080 - 250, "!energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }

        }
        else if(activeP < 3 && energy >= cost){
            this.motorP.changeButton(this, false, true, player);
            this.motorP.restoreInteractive();
            this.children.remove(this.shopMText[1]);
            this.shopMText[1] = this.add.text(800-40, 1080 - 250, "Projectile", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
        if(activeR >= 3 || energy < cost){
            this.motorR.changeButton(this, false, false, player);
            this.motorR.removeInteractive();
            this.children.remove(this.shopMText[2]);
            if(activeR >= 3){
                this.shopMText[2] = this.add.text(1025, 1080 - 250, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopMText[2] = this.add.text(1010, 1080 - 250, "!energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
                }).setVisible(true);
            }

        }
        else if(activeR < 3 && energy >= cost){
            this.motorR.changeButton(this, false, true, player);
            this.motorR.restoreInteractive();
            this.children.remove(this.shopMText[2]);
            this.shopMText[2] = this.add.text(1020, 1080 - 250, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2
            }).setVisible(true);
        }
    }

    switchTextures(player: Player): void{
        this.solar.switchArt(this, player);
        this.laser.switchArt(this, player);
        this.projectile.switchArt(this, player);
        this.rocket.switchArt(this, player);

    }

    updateEnergyText(): void{
        // this.children.remove(this.energyT);
        this.energyT.destroy();
        // this.energyT = this.add.text(1920/2-15, 760, "= "+this.turn.getCurrentPlayer().getEnergy(), {
        //     fill: '#3771c8', fontFamily: '"Roboto-Medium"', fontSize: 64, strokeThickness: 2, stroke: '#214478'});
        this.energyT = this.add.text(1920/2-95, 160, "= "+this.turn.getCurrentPlayer().getEnergy(), {
                fill: '#fff', fontFamily: '"Roboto-Medium"', fontSize: 64, strokeThickness: 1, stroke: '#fff'});

    }

    updateEnergyRate(bought: boolean):void{
        let rate = this.turn.getCurrentPlayer().getRegenRate();
        if(bought){
            rate += 25;
        }
        this.infobox.removeTooltipInfo(this.energyRegen);
        this.children.remove(this.energyRegen);

        if(this.turn.getCurrentPlayer().getEnergy() >= 100){
            this.energyRegen = this.add.text(1920/2+70, 170, "(+"+rate+ ")", {
                fill: '#15ff31', fontFamily: '"Roboto"', fontSize: 35, stroke:'#15ff31',  strokeThickness: 2});

        }
        else if(this.turn.getCurrentPlayer().getEnergy() >= 1000){
            this.energyRegen = this.add.text(1920/2+110, 170, "(+"+rate+ ")", {
                fill: '#15ff31', fontFamily: '"Roboto"', fontSize: 35, stroke:'#15ff31',  strokeThickness: 2});

        }
        else{
            this.energyRegen = this.add.text(1920/2+35, 170, "(+"+rate+ ")", {
                fill: '#15ff31', fontFamily: '"Roboto"', fontSize: 35, stroke:'#15ff31',  strokeThickness: 2});

        }

        this.infobox.addTooltipInfo(this.energyRegen, "Your Energy Regeneration.\n" +
            "Receiving:\n" +
            "+50 (from Ship)\n" +
            "+"+(rate + this.turn.getCurrentPlayer().getEnergyMalus() - 50)+" (from Drones)\n" +
            "-"+this.turn.getCurrentPlayer().getEnergyMalus()+" (from destroyed HitZones)");

    }

    // energy display for main shop
    createEnergyCostIcons(): Phaser.GameObjects.Image[]{
        return [
            this.add.image(330, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(530, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(730, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(930, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(1130, 1080-180, "energy_icon").setScale(0.5,0.5)

        ]
    }
    createEnergyCostText(): Phaser.GameObjects.Text[]{
        return [
            this.add.text(350, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("nano"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(550, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("weapon"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(750, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("wmod"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(950, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("solar"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(950, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("motor"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),

        ]
    }

    createEnergyCostIconsS(): Phaser.GameObjects.Image[]{
        return [
            this.add.image(480, 1080-365, "energy_icon").setScale(0.4,0.4),
            this.add.image(655, 1080-365, "energy_icon").setScale(0.4,0.4),
            this.add.image(830, 1080-365, "energy_icon").setScale(0.4,0.4),
            this.add.image(1005, 1080-365, "energy_icon").setScale(0.4,0.4),
            this.add.image(1180, 1080-365, "energy_icon").setScale(0.4,0.4)
        ]
    }
    createEnergyCostTextS(): Phaser.GameObjects.Text[]{
        return [
            this.add.text(450, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("armor"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(650, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("shield"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(850, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("rocket"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(1050, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("nano"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(1250, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("adap"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2})

        ]
    }

    // energy display for choose weapon type
    createEnergyCostIconsT(): Phaser.GameObjects.Image[]{
        return [
            this.add.image(530, 1080-365, "energy_icon").setScale(0.5,0.5),
            this.add.image(780, 1080-365, "energy_icon").setScale(0.5,0.5),
            this.add.image(1030, 1080-365, "energy_icon").setScale(0.5,0.5)
        ]
    }
    createEnergyCostTextT(): Phaser.GameObjects.Text[]{
        return [
            this.add.text(550, 1080-380, "x "+this.turn.getCurrentPlayer().getEnergyCost("weapon"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(800, 1080-380, "x "+this.turn.getCurrentPlayer().getEnergyCost("weapon"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(1050, 1080-380, "x "+this.turn.getCurrentPlayer().getEnergyCost("rocketl"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2})
        ]
    }

    updateEnergyCostT(): void{
        let energy = this.turn.getCurrentPlayer().getEnergy();
        let cost = this.turn.getCurrentPlayer().getEnergyCost("rocketl");
        if(energy < cost){
            this.children.remove(this.energyCostT[2]);
            this.energyCostT[2] = this.add.text(1050, 1080-380, "x "+cost, {
                fill: '#be0120', fontFamily: '"Roboto"', fontSize: 25, stroke:'#be0120', strokeThickness: 2});
        }

        else if(energy >= cost){
            this.children.remove(this.energyCostT[2]);
            this.energyCostT[2] = this.add.text(1050, 1080-380, "x "+cost, {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});
        }
    }


    updateEnergyCostText(): void{
        let type = "";
        for(let i = 0; i < 5; i++){
            this.children.remove(this.energyCostText[i]);
            switch (i) {
                case(0): type = "nano"; break;
                case(1): type = "weapon"; break;
                case(2): type = "wmod"; break;
                case(3): type = "solar"; break;
                case(4): type = "motor"; break;

            }
            if(this.turn.getCurrentPlayer().getEnergy() < this.turn.getCurrentPlayer().getEnergyCost(type)){
                this.energyCostText[i] = this.add.text(350+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
                    fill: '#be0120', fontFamily: '"Roboto"', fontSize: 25, stroke:'#be0120', strokeThickness: 2});
            }
            else if(this.turn.getCurrentPlayer().getEnergy() >= this.turn.getCurrentPlayer().getEnergyCost(type)){

                this.energyCostText[i] = this.add.text(350+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});
            }

        }
    }
    regShield(type):void{

        let test=this.add.sprite(this.turn.getCurrentPlayer().ship.posX, this.turn.getCurrentPlayer().ship.posY, 'shield/00').play('snooze');
        test.alpha=0;
        switch(type){
            case("armor"):test.setTint(0x999999,0x999999,0x999999,0x999999);break;
            case("shield"):test.setTint(0x034CFA,0x034CFA,0x034CFA,0x034CFA);break;
            case("rocket"):test.setTint(0xFD2301,0xFD2301,0xFD2301,0xDA0000);break;
            case("nano"):test.setTint(0x1B1B1B,0x1B1B1B,0x1B1B1B,0x1B1B1B);break;
            case("adap"):test.setTint(0xF9F501,0xF9F501,0xF9F501,0xF9F501);break;
        }


        //test.tint=0xF16F6F;
        test.depth=100;
        test.setScale(0.5,0.5);

        let timeline = this.tweens.timeline(test);



        timeline.add({
            targets: test,
            scaleX: 2,
            scaleY: 2,
            alpha:1,
            ease: 'Sine.easeInOut',
            duration: 800,
        });
        timeline.add({
            targets: test,
            alpha:0,
            ease: 'Sine.easeInOut',
            duration: 400,
        });
        timeline.play();

    }



    updateEnergyCostTextS(): void{
        let type = "";
        for(let i = 0; i < 5; i++){
            this.children.remove(this.energyTextS[i]);
            switch (i) {
                case(0): type = "armor"; break;
                case(1): type = "shield"; break;
                case(2): type = "rocket"; break;
                case(3): type = "nano"; break;
                case(4): type = "adap"; break;

            }
            if(this.turn.getCurrentPlayer().getEnergy() < this.turn.getCurrentPlayer().getEnergyCost(type)){
                this.energyTextS[i] = this.add.text(500+(175*i), 1080-380, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
                    fill: '#be0120', fontFamily: '"Roboto"', fontSize: 20, stroke:'#be0120', strokeThickness: 2});
            }
            else if(this.turn.getCurrentPlayer().getEnergy() >= this.turn.getCurrentPlayer().getEnergyCost(type)){

                this.energyTextS[i] = this.add.text(500+(175*i), 1080-380, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2});
            }

        }
    }

    changeShopColor(player: Player){
        if(player.getNameIdentifier() == "P1"){
            // this.shop_bg.lineStyle(5, 0xAA2222);
            // this.shop_bg.strokeRoundedRect(260, 1080-220, 1400, 250, 32);
            this.shop_bg_out.setTint(0xa02c2c);
            this.roundFG.setTint(0xa02c2c);

        }
        else{
            // this.shop_bg.lineStyle(5, 0x2222AA);
            // this.shop_bg.strokeRoundedRect(260, 1080-220, 1400, 250, 32);
            this.shop_bg_out.setTint(0x214478);
            this.roundFG.setTint(0x214478);
        }
    }

    getOpponentNr(player:Player): string{
        if(player.getNameIdentifier() == "P1"){
            return "2";
        }
        else{
            return "1";
        }

    }

    public anomalyInfoBoxes(type: string){

        let blackBox = this.add.graphics();
        let tip = this.add.text(660, 340, this.getTipText(type), MainScene.getTipFontStyle());

        tip.depth = 100;
        blackBox.depth = 99;

        let width = tip.displayWidth + 50;
        let height = tip.displayHeight < 180 ? 180 : tip.displayHeight * 5;
        blackBox.fillStyle(0x000000, 1);
        blackBox.fillRoundedRect(640, 320, width, height, 32);

        blackBox.alpha = 0.9;
        blackBox.setDepth(0);

        let skip = this.add.text(1180, 435, "skip", {fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2})

        let okBox = new Button(this, 660, 500, "button_shadow", "button_bg","button_fg", "button_resume", 0.5);
        okBox.setOnClick(()=>{
            okBox.setInvisible();
            blackBox.destroy();
            tip.destroy();
            skip.destroy();
            this.system.start();
        });

        okBox.setPosition(1260,450);
        okBox.setScale();
        okBox.setVisible();
    }



    private getTipText(type: string){
        if (type == "erupt"){
            return "A sun eruption is about to come through. Be careful,\n" +
                   "this can cause a lot of damage to your shields. Your\n" +
                   "shields will maybe be destroyed."
        }
        if (type == "worm"){
            return "A worm  hole is going to appear and leave a special \n" +
                   "solar drone for you, called nuclear drone. For more \n" +
                   "information about this drone, just hover your mouse \n" +
                   "over it."
        }
        if (type == "black"){
            return "A black hole will appear. It increases the number of\n" +
                   "projectile misses. So both of you should be careful.\n" +
                   "Your projectiles may not find the right way."
        }
    }

    private static getTipFontStyle()
    {
        return {
            fill: '#fff', fontSize: 20, strokeThickness: 3, stroke: '#000'
        }
    }


}
