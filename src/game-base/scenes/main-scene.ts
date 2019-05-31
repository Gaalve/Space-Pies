import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";

import {PiSystem} from "../mechanics/picalc/pi-system";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {PiTerm} from "../mechanics/picalc/pi-term";
import {PiSymbol} from "../mechanics/picalc/pi-symbol";
import {Drone} from "../mechanics/drone";
import Sprite = Phaser.GameObjects.Sprite;

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
    // private energy_bg: Phaser.GameObjects.Rectangle;

    private shop1: [Button, Button, Button, Button, Button, Button, Button];
    private shopZ: [Button, Button, Button, Button];
    private shopT: [Button, Button, Button];
    private shopW: [Button, Button, Button, Button];
    private skip: Button;
    private wModule: Button;
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
    private shop1Active: boolean;
    private shopWActive: boolean;
    private shopTActive: boolean;
    private shopZActive: boolean;
    private shop1Text: Phaser.GameObjects.Text[];
    private shopZText: Phaser.GameObjects.Text[];
    private shopTText: Phaser.GameObjects.Text[];
    private shopWText: Phaser.GameObjects.Text[];
    private active: boolean = true;
    private energy: Phaser.GameObjects.Image;
    private energyT: Phaser.GameObjects.Text;
    private energySym: Phaser.GameObjects.Image[];
    private energyCostText: Phaser.GameObjects.Text[];





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

    create(): void {
        this.system = new PiSystem(this, 50,50,50,true);
        this.data.set("system", this.system);
        this.pem = this.add.particles("parts");
        this.pem.setDepth(5);
        this.players = [new Player(this, 280, 540, "P1", true, this.system, this.pem), new Player(this, 1650, 540, "P2", false, this.system, this.pem)];
        this.turn = new Turn(this, this.players);
        let system = this.system;
        let startShop = system.add.replication(system.add.channelIn('shopp1','*').process('ShopP1', () =>{
            if(this.turn.getCurrentRound() != 1){
                this.switchTextures(this.turn.getCurrentPlayer());
            }
            //this.updateShopW(false);
            this.changeShopColor(this.turn.getCurrentPlayer());
            this.displayShop(this.shop1, this.shop1Text);
            this.updateShop1(false);
            this.shop1Active = true;
            this.shop_bg_back.setVisible(true);
            this.shop_bg_out.setVisible(true);
            this.updateEnergyText();
            this.energy.setVisible(true);
            this.energyT.setVisible(true);
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
        this.shop_bg_back.setAlpha(0.6);
        this.add.existing(this.shop_bg_back);
        this.add.existing(this.shop_bg_out);
        // this.shop_bg = this.add.graphics();
        // this.shop_bg.fillStyle(0x000, 0.6);
        // this.shop_bg.lineStyle(5, 0xAA2222);
        // this.shop_bg.fillRoundedRect(260, 1080-220, 1400, 250, 32);
        // this.shop_bg.strokeRoundedRect(260, 1080-220, 1400, 250, 32);
        //this.shop_bg = this.add.rectangle(1920/2, 1080 - 100, 1400, 250, 0x000, 0.6).setVisible(false).setStrokeStyle(5,0xffff);
        //this.energy_bg = this.add.rectangle(130, 1080- 100, 200, 200, 0x000, 0.6).setVisible(true);
        this.energy = this.add.image(1920/2-50, 800, "energy_icon");
        this.energyT = this.add.text(1920/2-15, 770, "= "+this.turn.getCurrentPlayer().getEnergy(), {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});
        //this.add.rectangle(1920-130, 1080- 100, 200, 200, 0x000, 0.6).setVisible(true);

        this.shop = new Button(this, 1920/2, 500, "button_shadow",
            "button_bg", "button_fg", "button_shop",
            ()=>{
                this.system.pushSymbol(this.system.add.channelOut("shopp1", "*").nullProcess());
                this.shop.removeInteractive();
                this.shop.setInvisible();
                this.openShop.setVisible(false);
                this.shop1Active = true;
            });
        this.shop.removeInteractive();
        this.shop.setInvisible();

        this.openShop = this.add.text(1920/2-50, 550, "shop", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2}).setVisible(false);


        this.buttonOption = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_options",
            ()=>{
            this.scene.pause();
            this.scene.run('PauseScene');
            this.scene.setVisible(true,"PauseScene");

            }
        );
        this.buttonOption.setPosition(1880, 40);

        this.createShop1();
        this.createChooseZones();
        this.createChooseType();
        this.createChooseMod();


        //Weapons in Pi Calculus
        //Creating Weapons and Weaponmods###############################################
        //Weapons in Pi Calc
        for(let i = 1; i<3; i++){
            for(let j = 0; j < 3; j++){
                this.buildWeaponsPi(i,j);
            }
        }
        //extra functions to resolve existing channels w1, w2, w3 after attack phase
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("w1", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("w2", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("w3", "").nullProcess()));

        //locks for attack phase in Pi Calc
        for(let i = 1; i < 3; i++){
            this.buildLocksPi(i);
        }
        //extra functions to resolve existing channels nolock1, nolock2, nolock3 after attack phase
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock1", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock2", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock3", "").nullProcess()));

        //create 1 weapon for each player on ship
        this.system.pushSymbol(this.system.add.channelOut("wmod10","").channelOut("wext100", "shieldp2").nullProcess());
        this.system.pushSymbol(this.system.add.channelOut("wmod20", "").channelOut("wext200", "shieldp1").nullProcess());

        //Creating Energy Drones#######################################################
        for(let i = 1; i < 3; i++){
            this.buildEnergyDrones(i);
            this.buildSLocks(i);
        }
        //extra functions to resolve existing channels e0 - e4 and nosolar0 - nosolar4 after energy phase
        for(let i = 0; i < 5; i++) {
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("e" + i.toString(), "").nullProcess()));
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelOut("nosolar" + i.toString(), "0").nullProcess()));
        }

        //create 1 energy drone for each player (gain 3 energy per turn)
        this.system.pushSymbol(this.system.add.channelOut("newsolar10", "solar1").nullProcess());
        this.system.pushSymbol(this.system.add.channelOut("newsolar20", "solar2").nullProcess());

        this.system.start();
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.shop.updateStep();
            this.buttonOption.updateStep();
            if(this.shop1Active){
                this.skip.updateStep();
                this.close.updateStep();
                this.armor.updateStep();
                this.shield.updateStep();
                this.wModule.updateStep();
                this.wExt.updateStep();
                this.solar.updateStep();
            }

            if(this.shopZActive){
                this.zone1.updateStep();
                this.zone2.updateStep();
                this.zone3.updateStep();
                this.zone4.updateStep();
            }

            if(this.shopTActive){
                this.laser.updateStep();
                this.projectile.updateStep();
                this.rocket.updateStep();
            }

            if(this.shopWActive){
                this.ship.updateStep();
                this.drone1.updateStep();
                this.drone2.updateStep();
                this.close2.updateStep();

            }



        }
        this.players[0].update(delta);
        this.players[1].update(delta);
    }

    /**
     * builds all weaponmods and weapons in pi calculus
     * @param player
     * @param drone
     */
    buildWeaponsPi(player : number, drone : number) : void{
        let p = player.toString();
        let d = drone.toString();
        let weapon = this.system.add.term("Weapon" + p + d, undefined);

        let droneRef: Drone = this.players[player - 1].getDrones()[drone];
        let sum = this.system.add.sum([this.system.add.channelIn("lock" + p,"").
                                                channelOutCB("w1","", (_, at) => {
                                                    droneRef.getWeapons()[0].createBullet(at == 'miss')}).        //function for weapon animation
                                                channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
                                                channelOutCB("w2", "", (_, at) => {
                                                    droneRef.getWeapons()[1].createBullet(at == 'miss')}).
                                                channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
                                                channelOutCB("w3", "", (_, at) => {
                                                    droneRef.getWeapons()[2].createBullet(at == 'miss')}).
                                                next(weapon),
                                              this.system.add.channelInCB("wext" + p + d + "0", "w1", (wClass) => {
                                                    this.players[player - 1].getDrones()[drone].addWeapon(wClass);
                                                    }).
                                                next(weapon),
                                              this.system.add.channelInCB("wext" + p + d + "1", "w2", (wClass) => {
                                                    this.players[player - 1].getDrones()[drone].addWeapon(wClass);
                                                    }).
                                                next(weapon),
                                              this.system.add.channelInCB("wext" + p + d + "2", "w3", (wClass) => {
                                                    this.players[player - 1].getDrones()[drone].addWeapon(wClass);
                                                    }).
                                                next(weapon)]);
        weapon.symbol = sum;

        this.system.pushSymbol(this.system.add.channelInCB("wmod" + p + d, "", () => {
                                                    this.players[player - 1].createDrone(drone);
                                                    }).
                                                channelOut("newlock" + p + d, "lock" + p).
                                                next(weapon));
    }

    /**
     * builds the necessary locks for all weaponmods
     * @param player
     */

    buildLocksPi(player : number) : void{
        let p = player.toString();

        let rlock = this.system.add.term("RLock" + p, undefined);
        let sum = this.system.add.sum([this.system.add.channelIn("unlock" + p, "").
                                                channelOut("nolock1", "").
                                                channelOut("nolock2", "").
                                                channelOut("nolock3", "").
                                                channelOut("attackp" + p + "end", "").
                                                next(rlock),
                                              this.system.add.channelIn("newlock" + p + "0", "nolock1").
                                                next(rlock),
                                              this.system.add.channelIn("newlock" + p + "1", "nolock2").
                                                next(rlock),
                                              this.system.add.channelIn("newlock" + p + "2", "nolock3").
                                                next(rlock)]);
        rlock.symbol = sum;
        this.system.pushSymbol(rlock);
    }

    /**
     * builds the energy drones
     * @param player
     */
    buildEnergyDrones(player : number) : void{
        let p = player.toString();

        let drone = this.system.add.term("Drone" + p, undefined);
        let sum = this.system.add.sum([this.system.add.channelIn("energy" + p, "").
                                                channelOut("e0", "1").
                                                channelOut("e1", "1").
                                                channelOut("e2", "1").
                                                channelOut("e3", "1").
                                                channelOut("e4", "1").
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "0", "e0", () =>{
                                                  this.players[player - 1].createSolarDrone(0);
                                                  }).
                                                channelOut("newslock" + p + "0", "solar" + p).
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "1", "e1", () =>{
                                                  this.players[player - 1].createSolarDrone(1);
                                                  }).
                                                channelOut("newslock" + p + "1", "solar" + p).
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "2", "e2", () =>{
                                                  this.players[player - 1].createSolarDrone(2);
                                                  }).
                                                channelOut("newslock" + p + "2", "solar" + p).
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "3", "e3", () =>{
                                                  this.players[player - 1].createSolarDrone(3);
                                                  }).
                                                channelOut("newslock" + p + "3", "solar" + p).
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "4", "e4", () =>{
                                                  this.players[player - 1].createSolarDrone(4);
                                                  }).
                                                channelOut("newslock" + p + "4", "solar" + p).
                                                next(drone)]);

        drone.symbol = sum;
        this.system.pushSymbol(drone);
    }

    /**
     * builds the necessary pi calc terms to regain energy
     * @param player
     */
    buildSLocks(player : number) : void{
        let p = player.toString();

        let slock = this.system.add.term("SLock" + p, undefined);
        let sum = this.system.add.sum([this.system.add.channelIn("startephase" + p, "").
                                                channelOut("energy" + p, "").
                                                channelInCB("nosolar0", "", (x) => {
                                                    this.players[player - 1].gainEnergy(x, 3);
                                                    }).
                                                channelInCB("nosolar1", "", (x) => {
                                                    this.players[player - 1].gainEnergy(x, 3);
                                                    }).
                                                channelInCB("nosolar2", "", (x) => {
                                                    this.players[player - 1].gainEnergy(x, 3);
                                                    }).
                                                channelInCB("nosolar3", "", (x) => {
                                                    this.players[player - 1].gainEnergy(x, 3);
                                                    }).
                                                channelInCB("nosolar4", "", (x) => {
                                                    this.players[player - 1].gainEnergy(x, 3);
                                                    }).
                                                    next(slock),
                                              this.system.add.channelIn("newslock" + p + "0", "nosolar0").
                                                next(slock),
                                              this.system.add.channelIn("newslock" + p + "1", "nosolar1").
                                                next(slock),
                                              this.system.add.channelIn("newslock" + p + "2", "nosolar2").
                                                next(slock),
                                              this.system.add.channelIn("newslock" + p + "3", "nosolar3").
                                                next(slock),
                                              this.system.add.channelIn("newslock" + p + "4", "nosolar4").
                                                next(slock)]);
        slock.symbol = sum;
        this.system.pushSymbol(slock);
    }

    private createShop1(): void
    {
        this.armor = this.setButton(350, 1080-100, "button_armor", ()=>{
            this.data.set("type", "armor");
            this.closeShop(this.shop1, this.shop1Text, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.shop1Active = false;
            this.shopZActive = true;


        });


        this.shield = this.setButton(550, 1080-100, "button_shield", ()=>{
            this.data.set("type", "shield");
            this.closeShop(this.shop1, this.shop1Text, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.shop1Active = false;
            this.shopZActive = true;

        });

        this.wExt = new Button(this, 750, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{
            this.closeShop(this.shop1, this.shop1Text, false);
            this.displayShop(this.shopT, this.shopTText);
            this.shop1Active = false;
            this.shopTActive = true;
                //system.pushSymbol(createWMod)
        });

        this.wModule = new Button(this, 950, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{
            let player = this.turn.getCurrentPlayer();
            player.payEnergy(player.getEnergyCost());
            player.raiseEnergyCost(1);
            this.updateEnergyText();
            this.data.set("buy", "w");
            //this.updateShopW(true);
            this.updateShop1(true);

            this.system.pushSymbol(this.system.add.channelOut('wmod'+ player.getNameIdentifier().charAt(1)+ player.getNrDrones(),'*' ).nullProcess());


        });



        this.solar = this.setButton(1150, 1080-100, "ssr_solar_drone", ()=>{
                let system = this.system;
                let player = this.turn.getCurrentPlayer();
                player.payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                //this.updateShopW(false);
                this.data.set("buy", "s");
                this.updateShop1(true);

                system.pushSymbol(system.add.channelOut("newsolar"+ player.getNameIdentifier().charAt(1)+player.getNrSolarDrones(), "solar"+player.getNameIdentifier().charAt(1)).nullProcess())

        });
        this.solar.setAlt(this, 1150, 1080-100, "ssb_solar_drone");


        this.close = new Button(this, 1350, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=>{
                this.closeShop(this.shop1, this.shop1Text, true);
                this.openShop.setVisible(true);
                this.shop.setVisible();
                this.shop.restoreInteractive();
                this.shop1Active = false;
            });

        this.skip = new Button(this, 1550, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
                if(this.turn.clickable){
                    this.turn.Attackturn();
                    this.closeShop(this.shop1, this.shop1Text, true);
                    this.shop1Active = false;
                    this.energy.setVisible(false);
                    this.energyT.setVisible(false);
                }
        });


        this.shop1 = [this.armor, this.shield, this.wExt, this.wModule, this.solar, this.close, this.skip];
        this.shop1Text = [this.add.text(315, 1080-50, "Armor", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(515, 1080-50, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(715, 1080-50, "wExt", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(915, 1080-50, "wMod", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1115, 1080-50, "Solar", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1315, 1080-50, "close", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1525, 1080-50, "skip", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false)
        ];

        this.energySym = this.createEnergyCostIcons();
        this.energyCostText = this.createEnergyCostText();
        this.closeShop(this.shop1, this.shop1Text, true);

        /*this.shieldText = this.add.text(1920-500, 330, "Shield", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});*/

    }


    createChooseZones(): void{
        let player = this.turn.getCurrentPlayer();
        this.zone1 = new Button(this, 500, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(this.data.get("type") == "armor"){
                    let createArmor = (this.system.add.channelOut('rarmorp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z1','*' ).nullProcess());
                    this.system.pushSymbol(createArmor)
                }
                else{
                    let createShield = (this.system.add.channelOut('rshieldp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z1','*' ).nullProcess());
                    this.system.pushSymbol(createShield)
                }
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                this.updateShop1(false);
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopZActive = false;

            });

        this.zone2 = new Button(this, 800, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(this.data.get("type") == "armor"){
                    let createArmor = (this.system.add.channelOut('rarmorp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z2','*' ).nullProcess());
                    this.system.pushSymbol(createArmor)
                }
                else{
                    let term = (this.system.add.channelOut('rshieldp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z2','*' ).nullProcess());
                    this.system.pushSymbol(term)                }
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                this.updateShop1(false);
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopZActive = false;
            });

        this.zone3 = new Button(this, 1100, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(this.data.get("type") == "armor"){
                    let term = (this.system.add.channelOut('rarmorp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z3','*' ).nullProcess());
                    this.system.pushSymbol(term)
                }

                else{
                    let term = (this.system.add.channelOut('rshieldp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z3','*' ).nullProcess());
                    this.system.pushSymbol(term)
                }

                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                this.updateShop1(false);
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopZActive = false;
            });
        this.zone4 = new Button(this, 1400, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                if(this.data.get("type") == "armor"){
                    let term = (this.system.add.channelOut('rarmorp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z4','*' ).nullProcess());
                    this.system.pushSymbol(term)
                }


                else{
                    let term = (this.system.add.channelOut('rshieldp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z4','*' ).nullProcess());
                    this.system.pushSymbol(term)
                }

                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                this.updateShop1(false);
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopZActive = false;
            });

            this.shopZ = [this.zone1, this.zone2, this.zone3, this.zone4];
            this.shopZText = [
                this.add.text(450, 1080-50, "Hitzone1", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
                this.add.text(750, 1080-50, "Hitzone2", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
                this.add.text(1050, 1080-50, "Hitzone3", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
                this.add.text(1350, 1080-50, "Hitzone4", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            ];
            this.closeShop(this.shopZ, this.shopZText, false);

    }

    private createChooseType(): void{
        this.laser = new Button(this, 600, 1080-100, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_las",
            () => {
                this.data.set("type", "armorp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.laser.setAlt(this, 600, 1080-100, "ssb_weap_las");

        this.projectile = new Button(this, 960, 1080-100, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_pro",
            () => {
                this.data.set("type", "shieldp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.projectile.setAlt(this, 960, 1080-100, "ssb_weap_pro");

        this.rocket = new Button(this, 1320, 1080-100, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_rock",
            () => {
                this.data.set("type", "rocketp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.rocket.setAlt(this, 1320, 1080-100, "ssb_weap_rock");

        this.shopT = [this.laser, this.projectile, this.rocket];
        this.shopTText = [
            this.add.text(600-30, 1080-50, "Laser", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(960-50, 1080-50, "Projectile", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1285, 1080-50, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),

        ];
        this.closeShop(this.shopT, this.shopTText, false);
    }

    createChooseMod(): void{
        this.ship = new Button(this, 500, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_space_shuttle",
            ()=>{
                let player = this.turn.getCurrentPlayer();
                player.payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                let term = "wext"+player.getNameIdentifier().charAt(1) + "0" + player.getDrones()[0].getNrWeapons();
                this.updateShop1(false);
                //this.updateShopW(true);
                this.data.set("buy", "s");
                this.system.pushSymbol(this.system.add.channelOut(term, this.data.get("type")+this.getOpponentNr(player)).nullProcess());
                this.closeShop(this.shopW, this.shopWText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopWActive = false;
                //system.pushSymbol(createWMod)
        });
        this.drone1 = new Button(this, 800, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{
                let player = this.turn.getCurrentPlayer();
                let term = "wext"+player.getNameIdentifier().charAt(1) + "1" + player.getDrones()[1].getNrWeapons();
                player.payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                this.updateShop1(false);
                //this.updateShopW(true);
                this.data.set("buy", "d1");
                this.system.pushSymbol(this.system.add.channelOut(term, this.data.get("type")+this.getOpponentNr(player)).nullProcess());
                this.closeShop(this.shopW, this.shopWText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopWActive = false;
        });

        this.drone2 = new Button(this, 1100, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{
                let player = this.turn.getCurrentPlayer();
                let term = "wext"+player.getNameIdentifier().charAt(1) + "2" + player.getDrones()[2].getNrWeapons();
                player.payEnergy(player.getEnergyCost());
                this.updateEnergyText();
                this.updateShop1(false);
                //this.updateShopW(true);
                this.data.set("buy", "d2");
                this.system.pushSymbol(this.system.add.channelOut(term, this.data.get("type")+this.getOpponentNr(player)).nullProcess());
                this.closeShop(this.shopW, this.shopWText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopWActive = false;
        });
        this.close2 = new Button(this, 1400, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=>{
                this.closeShop(this.shopW, this.shopWText, false);
                this.displayShop(this.shop1, this.shop1Text);

        });

        this.shopW = [this.ship, this.drone1, this.drone2, this.close2];
        this.shopWText = [
            this.add.text(500-30, 1080-50, "ship", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(800-40, 1080-50, "drone 1", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1100-40, 1080-50, "drone 2", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1400-30, 1080-50, "close", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
        ];
        this.closeShop(this.shopW, this.shopWText, false);
    }

    setButton(x : number, y : number, pic : string, onclick: Function = ()=>{}) : Button{
        return new Button(this, x, y, "button_shadow",
            "button_bg", "button_fg", pic, onclick);

    }

    closeShop(array: Button[], text: Phaser.GameObjects.Text[],closeBg: boolean): void{
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
            }
            for (let t of this.energyCostText) {
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
            }
            for (let t of this.energyCostText) {
                t.setVisible(true);
            }
        }
    }

    updateShop1(bought: boolean): void{
        let player = this.turn.getCurrentPlayer();
        let energy = player.getEnergy();
        let energyCost = player.getEnergyCost();
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
        if(wMods >= 3 || energy < energyCost){
            this.wModule.changeButton(this,false,false, player);
            this.wModule.removeInteractive();
            if(wMods >= 3) {
                this.children.remove(this.shop1Text[3]);
                this.shop1Text[3] = this.add.text(920, 1080 - 50, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                });
            }
            else{
                this.children.remove(this.shop1Text[3]);
                this.shop1Text[3] = this.add.text(900, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                });
            }



        }
        else if(wMods < 3 && energy >= energyCost){
            this.wModule.changeButton(this,false,true, player);
            this.wModule.restoreInteractive();
            this.active = true;
            this.children.remove(this.shop1Text[3]);
            this.shop1Text[3] = this.add.text(915, 1080 - 50, "wMod", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }



        if(sMods >= 5 || energy < energyCost){

            if(this.turn.getCurrentPlayer().getNameIdentifier() == "P1"){
                this.solar.changeButton(this,false,false, player);
            }
            else{
                this.solar.changeButton(this,true,false, player);
            }
            this.solar.removeInteractive();
            this.children.remove(this.shop1Text[4]);
            if(sMods >= 5){
                this.shop1Text[4] = this.add.text(1115, 1080 - 50, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                })
            }

            else{
                this.shop1Text[4] = this.add.text(1100, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                })
            }

        }

        else if(sMods < 5 && energy >= energyCost){
            if(this.turn.getCurrentPlayer().getNameIdentifier() == "P1"){
                this.solar.changeButton(this,false,true, player);
            }
            else{
                this.solar.changeButton(this,true,true, player);
            }
            this.solar.restoreInteractive();
            this.children.remove(this.shop1Text[4]);
            this.shop1Text[4] = this.add.text(1120, 1080 - 50, "Solar", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            })
        }

        if(energy < energyCost){
            this.armor.changeButton(this,false,false, player);
            this.armor.removeInteractive();
            this.shield.changeButton(this,false, false, player);
            this.shield.removeInteractive();
            this.wExt.changeButton(this,false,false, player);
            this.wExt.removeInteractive();

            for(let i = 0; i < 3; i++){
                this.children.remove(this.shop1Text[i]);
                this.shop1Text[i] = this.add.text((315 + (200*i))-10, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                });
            }

        }

        else if(energy >= energyCost){
            this.armor.changeButton(this, false, true, player);
            this.shield.changeButton(this, false, true, player);
            this.wExt.changeButton(this, false,true, player);
            this.armor.restoreInteractive();
            this.shield.restoreInteractive();
            this.wExt.restoreInteractive();
            this.children.remove(this.shop1Text[0]);
            this.shop1Text[0] = this.add.text(315, 1080 - 50, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
            this.children.remove(this.shop1Text[1]);
            this.shop1Text[1] = this.add.text(515, 1080 - 50, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
            this.children.remove(this.shop1Text[2]);
            this.shop1Text[2] = this.add.text(715, 1080 - 50, "wExt", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }
    }

    updateShopW(bought: boolean): void
    {
        let player = this.turn.getCurrentPlayer();
        let energy = player.getEnergy();
        let energyCost = player.getEnergyCost();
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

        if(shipActive >= 3 || energy < energyCost){
            this.ship.changeButton(this, false, false, player);
            this.ship.removeInteractive();
            this.children.remove(this.shopWText[0]);
            this.shopWText[0] = this.add.text(500-60, 1080 - 50, "max weapons", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);

        }
        else if(shipActive < 3 && energy >= energyCost){
            this.ship.changeButton(this, false, true, player);
            this.ship.restoreInteractive();
        }

        if(dronesNr < 2 || d1Active >= 3 || energy < energyCost)
        {
            this.drone1.changeButton(this, false, false, player);
            this.drone1.removeInteractive();
            this.children.remove(this.shopWText[1]);
            if(dronesNr < 2){
                this.shopWText[1] = this.add.text(800-40, 1080 - 50, "not built", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                }).setVisible(true);
            }
            else if(d1Active >= 3){
                this.shopWText[1] = this.add.text(800-60, 1080 - 50, "max weapons", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopWText[1] = this.add.text(800-40, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                }).setVisible(true);
            }
        }

        else if(dronesNr >= 2 && d1Active < 3 && energy >= energyCost){
            this.drone1.changeButton(this, false, true, player);
            this.drone1.restoreInteractive();
            this.children.remove(this.shopWText[1]);
            this.shopWText[1] = this.add.text(800-40, 1080 - 50, "drone 1", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);

        }

        if(dronesNr < 3 || d2Active >= 3 || energy < energyCost)
        {
            this.drone2.changeButton(this, false,false, player);
            this.drone2.removeInteractive();
            this.children.remove(this.shopWText[2]);
            if(dronesNr < 3){
                this.shopWText[2] = this.add.text(1100-40, 1080 - 50, "not built", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                }).setVisible(true);
            }
            else if(d1Active >= 3){
                this.shopWText[2] = this.add.text(1100-60, 1080 - 50, "max weapons", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                }).setVisible(true);
            }
            else{
                this.shopWText[2] = this.add.text(1100-40, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                }).setVisible(true);
            }
        }

        else if(dronesNr >= 3 && d2Active < 3 && energy >= energyCost){
            this.drone2.changeButton(this, false,true, player);
            this.drone2.restoreInteractive();
            this.children.remove(this.shopWText[2]);
            this.shopWText[2] = this.add.text(1100-40, 1080 - 50, "drone 2", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
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
        this.children.remove(this.energyT);
        // this.energyT = this.add.text(1920/2-15, 760, "= "+this.turn.getCurrentPlayer().getEnergy(), {
        //     fill: '#3771c8', fontFamily: '"Roboto-Medium"', fontSize: 64, strokeThickness: 2, stroke: '#214478'});
        this.energyT = this.add.text(1920/2-15, 760, "= "+this.turn.getCurrentPlayer().getEnergy(), {
                fill: '#fff', fontFamily: '"Roboto-Medium"', fontSize: 64, strokeThickness: 1, stroke: '#fff'});
    }


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
            this.add.text(350, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(550, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(750, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(950, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(1150, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),

        ]
    }

    updateEnergyCostText(): void{

        for(let i = 0; i < 5; i++){
            this.children.remove(this.energyCostText[i]);
            if(this.turn.getCurrentPlayer().getEnergy() < this.turn.getCurrentPlayer().getEnergyCost()){
                this.energyCostText[i] = this.add.text(350+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(), {
                    fill: '#be0120', fontFamily: '"Roboto"', fontSize: 25, stroke:'#be0120', strokeThickness: 2});
            }
            else if(this.turn.getCurrentPlayer().getEnergy() >= this.turn.getCurrentPlayer().getEnergyCost()){

                this.energyCostText[i] = this.add.text(350+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(), {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});
            }

        }
    }

    changeShopColor(player: Player){
        if(player.getNameIdentifier() == "P1"){
            // this.shop_bg.lineStyle(5, 0xAA2222);
            // this.shop_bg.strokeRoundedRect(260, 1080-220, 1400, 250, 32);
            this.shop_bg_out.setTint(0xa02c2c);

        }
        else{
            // this.shop_bg.lineStyle(5, 0x2222AA);
            // this.shop_bg.strokeRoundedRect(260, 1080-220, 1400, 250, 32);
            this.shop_bg_out.setTint(0x214478);

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

}
