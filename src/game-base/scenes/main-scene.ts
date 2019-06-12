import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";

import {PiSystem} from "../mechanics/picalc/pi-system";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {Drone} from "../mechanics/drone";
import Sprite = Phaser.GameObjects.Sprite;
import {BattleTimeBar} from "../mechanics/battleTimeBar";
import {BulletInfo} from "../mechanics/weapon/bulletInfo";

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

    private shop1: [Button, Button, Button, Button, Button, Button];
    private shopZ: [Button, Button, Button, Button, Button];
    private shopT: [Button, Button, Button, Button];
    private shopW: [Button, Button, Button, Button];
    private shopS: [Button, Button, Button, Button, Button, Button];
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
    private closeS: Button;
    private back: Button;
    private backT: Button;
    private regen: Button;
    private nano: Button;
    private rocketS: Button;
    private adapt: Button;
    private shop1Active: boolean;
    private shopWActive: boolean;
    private shopTActive: boolean;
    private shopZActive: boolean;
    private shopSActive: boolean;
    private shop1Text: Phaser.GameObjects.Text[];
    private shopZText: Phaser.GameObjects.Text[];
    private shopTText: Phaser.GameObjects.Text[];
    private shopWText: Phaser.GameObjects.Text[];
    private shopSText: Phaser.GameObjects.Text[];
    private active: boolean = true;
    private energy: Phaser.GameObjects.Image;
    private energyT: Phaser.GameObjects.Text;
    private energySym: Phaser.GameObjects.Image[];
    private energyCostText: Phaser.GameObjects.Text[];
    private energyShopT: Phaser.GameObjects.Image[];
    private energyCostT: Phaser.GameObjects.Text[];
    private energyShopS: Phaser.GameObjects.Image[];
    private energyTextS: Phaser.GameObjects.Text[];

    private battleTime: BattleTimeBar;





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
        this.battleTime = new BattleTimeBar(this);
        this.system = new PiSystem(this, 10,10,10,false);
        this.data.set("system", this.system);
        this.pem = this.add.particles("parts");
        this.pem.setDepth(5);
        this.players = [new Player(this, 300, 540, "P1", true, this.system, this.pem), new Player(this, 1620, 540, "P2", false, this.system, this.pem)];
        this.turn = new Turn(this, this.players);
        let system = this.system;
        let startShop = system.add.replication(system.add.channelIn('shopp1','*').process('ShopP1', () =>{
            if(this.turn.getCurrentRound() != 1){
                this.switchTextures(this.turn.getCurrentPlayer());
            }
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
        this.energy = this.add.image(1920/2-50, 800, "energy_icon");
        this.energyT = this.add.text(1920/2-15, 770, "= "+this.turn.getCurrentPlayer().getEnergy(), {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});

        this.shop = new Button(this, 1920/2, 500, "button_shadow",
            "button_bg", "button_fg", "button_shop",
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

        this.creatChooseRegen();
        this.createShop1();
        this.createChooseZones();
        this.createChooseType();
        this.createChooseMod();


        //Weapons in Pi Calculus
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
            for(let j = 0; j < 5; j++){
                if(j > 0) {
                    this.createSolarShields(i, j);
                }
                this.createRepsSolarDrones(i,j);
            }
        }

        //extra functions to resolve existing channels e0 - e4 and nosolar0 - nosolar4 after energy phase
        for(let i = 0; i < 5; i++) {
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("e" + i.toString(), "").nullProcess()));
        }

        //create 1 energy drone for each player (gain 40 energy per turn)
        this.system.pushSymbol(this.system.add.channelOut("newsolar10", "solar10").nullProcess());
        this.system.pushSymbol(this.system.add.channelOut("newsolar20", "solar20").nullProcess());

        //extra function for game sync
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("wait", "").nullProcess()));

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
                this.regen.updateStep();
                this.wModule.updateStep();
                this.wExt.updateStep();
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
        let sum = this.system.add.sum([this.system.add.channelIn("lock" + p + d,"").
                                                channelOutCB("w1","", (_, at) => {
                                                    droneRef.getWeapons()[0].createBullet(at)}).        //function for weapon animation
                                                channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
                                                channelOut("wait","").channelOut("wait","").
                                                channelOutCB("w2", "", (_, at) => {
                                                    droneRef.getWeapons()[1].createBullet(at)}).
                                                channelOut("wait","").channelOut("wait","").channelOut("wait","").channelOut("wait","").
                                                channelOut("wait","").channelOut("wait","").
                                                channelOutCB("w3", "", (_, at) => {
                                                    droneRef.getWeapons()[2].createBullet(at)}).
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
                                                channelOut("newlock" + p + d, "lock" + p + d).
                                                next(weapon));
    }

    /**
     * builds the necessary locks for all weaponmods
     * @param player - number of player
     */

    buildLocksPi(player : number) : void{
        let p = player.toString();
        let bt = this.battleTime;

        let rlock = this.system.add.term("RLock" + p, undefined);

        let sum = this.system.add.sum([this.system.add.channelIn("unlock" + p, "")
                                                    .channelOutCB("nolock1", "", ()=>{bt.setVisible(true); bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB("nolock2", "", ()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB("nolock3", "", ()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB('wait','',()=>{bt.setTime()}).channelOutCB('wait','',()=>{bt.setTime()})
                                                    .channelOutCB("attackp" + p + "end", "",()=>{bt.setVisible(false); bt.resetTime()}).next(rlock),
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
     * @param sd
     */
    buildEnergyDrones(player : number) : void{
        let p = player.toString();

        let drone = this.system.add.term("Drone" + p, undefined);
        let sum = this.system.add.sum([this.system.add.channelIn("startephase" + p, "").
                                                channelOut("e0", "40").
                                                channelOut("e1", "15").
                                                channelOut("e2", "15").
                                                channelOut("e3", "15").
                                                channelOut("e4", "15").
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "0", "e0", () =>{
                                                  this.players[player - 1].createSolarDrone(0);
                                                  }).
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "1", "e1", () =>{
                                                  this.players[player - 1].createSolarDrone(1);
                                                  }).
                                                channelOut("newShield" + p + "1","").
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "2", "e2", () =>{
                                                  this.players[player - 1].createSolarDrone(2);
                                                  }).
                                                channelOut("newShield" + p + "2","").
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "3", "e3", () =>{
                                                  this.players[player - 1].createSolarDrone(3);
                                                  }).
                                                channelOut("newShield" + p + "3","").
                                                next(drone),
                                              this.system.add.channelInCB("newsolar" + p + "4", "e4", () =>{
                                                  this.players[player - 1].createSolarDrone(4);
                                                  }).
                                                channelOut("newShield" + p + "4","").
                                                next(drone),
                                              this.system.add.channelIn("dessol" + p + "1", "solar" + p + "1").
                                                next(drone),
                                              this.system.add.channelIn("dessol" + p + "2", "solar" + p + "2").
                                                next(drone),
                                              this.system.add.channelIn("dessol" + p + "3", "solar" + p + "3").
                                                next(drone),
                                              this.system.add.channelIn("dessol" + p + "4", "solar" + p + "4").
                                                next(drone)
                                            ]);

        drone.symbol = sum;
        this.system.pushSymbol(drone);
    }

    private createRepsSolarDrones(player : number, sd : number){
        let p = player.toString();
        let d = sd.toString();

        /*let rep = this.system.add.term("Solar"+p+d, undefined);
        let solar = this.system.add.channelInCB("solar" + p + d, "",(x)=>{
            this.players[player-1].gainEnergy(x);
        }).next(rep);

        rep.symbol = solar;
        this.system.pushSymbol(rep);*/

        this.system.pushSymbol(
            this.system.add.replication(
                this.system.add.channelInCB("solar" + p + d,"amount", (amount)=>{
                    this.players[player-1].gainEnergy(amount)})
                    .nullProcess()));
    }

    private createSolarShields(player: number, sd: number){
        let p = player.toString();
        let d = sd.toString();
        let x = this.players[player-1].getSolarDrones()[sd].x;
        let y = this.players[player-1].getSolarDrones()[sd].y;

        let shield = this.system.add.term("SolarShield"+p+d, undefined);
        let term = this.system.add.channelIn("newShield"+p+d,"")
            .channelInCB("shieldp"+p,"",()=>{this.players[player-1].getSolarDrones()[sd].health.destroyBar()},
                new BulletInfo(false, x,y), 0.6)
            .channelInCB("armorp"+p,"",()=>{this.players[player-1].getSolarDrones()[sd].health.destroyBar()},
                new BulletInfo(false, x,y),0.6)
            .channelOutCB("dessol"+p+d,"e"+d, ()=>{this.players[player-1].getSolarDrones()[sd].explode()})
            .next(shield);

        shield.symbol = term;
        this.system.pushSymbol(shield);
    }

    private createShop1(): void
    {
        this.regen = new Button(this, 450, 1080-100, "button_shadow",
            "button_bg","button_fg", "button_regen", ()=>{
                this.closeShop(this.shop1, this.shop1Text, false);
                this.displayShop(this.shopS, this.shopSText);
                this.updateShopS();
                this.shop1Active = false;
                this.shopSActive = true;
            });

        this.wExt = new Button(this, 650, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wext",
            ()=>{
            this.closeShop(this.shop1, this.shop1Text, false);
            this.displayShop(this.shopT, this.shopTText);
            this.updateShopT();
            this.shop1Active = false;
            this.shopTActive = true;
                //system.pushSymbol(createWMod)
        });

        this.wModule = new Button(this, 850, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{
            let player = this.turn.getCurrentPlayer();
            player.payEnergy(player.getEnergyCost("wmod"));
            player.raiseEnergyCost("wmod", 15);
            this.updateEnergyText();
            this.data.set("buy", "w");
            //this.updateShopW(true);
            this.updateShop1(true);

            this.system.pushSymbol(this.system.add.channelOut('wmod'+ player.getNameIdentifier().charAt(1)+ player.getNrDrones(),'*' ).nullProcess());


        });



        this.solar = this.setButton(1050, 1080-100, "ssr_solar_drone", ()=>{
                let system = this.system;
                let player = this.turn.getCurrentPlayer();
                player.payEnergy(player.getEnergyCost("solar"));
                player.raiseEnergyCost("solar", 20);
                this.updateEnergyText();
                //this.updateShopW(false);
                this.data.set("buy", "s");
                this.updateShop1(true);

                system.pushSymbol(system.add.channelOut("newsolar"+ player.getNameIdentifier().charAt(1)+player.getSmallestIndexSD(), "solar"+player.getNameIdentifier().charAt(1)+player.getSmallestIndexSD()).nullProcess())

        });
        this.solar.setAlt(this, 1050, 1080-100, "ssb_solar_drone");


        this.close = new Button(this, 1250, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=>{
                this.closeShop(this.shop1, this.shop1Text, true);
                this.openShop.setVisible(true);
                this.shop.setVisible();
                this.shop.restoreInteractive();
                this.shop1Active = false;
            });

        this.skip = new Button(this, 1450, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
                if(this.turn.clickable){
                    // this.turn.Attackturn();
                    this.system.pushSymbol(this.system.add.channelOut("closeshop", "*").nullProcess());
                    this.system.pushSymbol(this.system.add.channelOut(
                        'shopp'+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'end', '').
                    nullProcess());
                    this.closeShop(this.shop1, this.shop1Text, true);
                    this.shop1Active = false;
                    this.energy.setVisible(false);
                    this.energyT.setVisible(false);
                }
        });


        this.shop1 = [this.regen, this.wExt, this.wModule, this.solar, this.close, this.skip];
        this.shop1Text = [
            this.add.text(415, 1080-50, "Regenerate", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(615, 1080-50, "wExt", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(815, 1080-50, "wMod", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1015, 1080-50, "Solar", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1215, 1080-50, "close", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1425, 1080-50, "skip", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false)
        ];

        this.energySym = this.createEnergyCostIcons();
        this.energyCostText = this.createEnergyCostText();
        this.closeShop(this.shop1, this.shop1Text, true);

        /*this.shieldText = this.add.text(1920-500, 330, "Shield", {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, strokeThickness: 2});*/

    }

    creatChooseRegen():void{
        this.armor = this.setButton(450, 1080-100, "button_armor", ()=>{
            this.data.set("type", "armor");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;


        });


        this.shield = this.setButton(650, 1080-100, "button_shield", ()=>{
            this.data.set("type", "shield");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;

        });

        this.rocketS = this.setButton(850, 1080-100, "button_rocket", ()=>{
            this.data.set("type", "rocket");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;


        });


        this.nano = this.setButton(1050, 1080-100, "button_nano", ()=>{
            this.data.set("type", "nano");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;

        });
        this.adapt = this.setButton(1250, 1080-100, "button_adapt", ()=>{
            this.data.set("type", "adap");
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shopZ, this.shopZText);
            this.updateShopZ();
            this.shopSActive = false;
            this.shopZActive = true;


        });

        this.closeS = this.setButton(1450, 1080-100, "button_back", ()=>{
            this.closeShop(this.shopS, this.shopSText, false);
            this.displayShop(this.shop1, this.shop1Text);
            this.shopSActive = false;
            this.shop1Active = true;


        });

        this.shopS = [this.armor, this.shield, this.rocketS, this.nano, this.adapt, this.closeS];

        this.shopSText = [
            this.add.text(415, 1080-50, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(615, 1080-50, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(815, 1080-50, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1015, 1080-50, "Nano", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1200, 1080-50, "Adaptive", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1425, 1080-50, "back", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false)
        ];
        this.energyShopS = this.createEnergyCostIconsS();
        this.energyTextS = this.createEnergyCostTextS();
        this.closeShop(this.shopS, this.shopSText, false);



    }


    createChooseZones(): void{
        let player = this.turn.getCurrentPlayer();
        this.zone1 = new Button(this, 460, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                let type = this.data.get("type");
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z1','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.updateShop1(false);
                this.shop1Active = true;
                this.shopZActive = false;

            });

        this.zone2 = new Button(this, 710, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                let type = this.data.get("type");
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z2','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.updateShop1(false);
                this.shop1Active = true;
                this.shopZActive = false;
            });

        this.zone3 = new Button(this, 960, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                let type = this.data.get("type");
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z3','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.updateShop1(false);
                this.shop1Active = true;
                this.shopZActive = false;
            });
        this.zone4 = new Button(this, 1210, 1080-100, "button_shadow",
            "button_bg", "button_fg", "sym_zone",
            () => {
                let type = this.data.get("type");
                let createArmor = (this.system.add.channelOut("r"+type+"p"+this.turn.getCurrentPlayer().getNameIdentifier().charAt(1)+'z4','*' ).nullProcess());
                this.system.pushSymbol(createArmor);
                this.turn.getCurrentPlayer().payEnergy(player.getEnergyCost(type));
                this.updateEnergyText();
                //this.updateShopW(false);
                this.closeShop(this.shopZ, this.shopZText,false);
                this.displayShop(this.shop1, this.shop1Text);
                this.updateShop1(false);
                this.shop1Active = true;
                this.shopZActive = false;
            });

        this.back = new Button(this, 1460, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_back",
            ()=>{

                    this.closeShop(this.shopZ, this.shopZText, false);
                    this.displayShop(this.shop1, this.shop1Text);
                    this.shopZActive = false;
                    this.shop1Active = true;


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
                this.add.text(1430, 1080-50, "back", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false)
            ];

            this.closeShop(this.shopZ, this.shopZText, false);

    }

    private createChooseType(): void{
        this.laser = new Button(this, 500, 1080-100, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_las",
            () => {
                this.data.set("type", "armorp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.laser.setAlt(this, 500, 1080-100, "ssb_weap_las");

        this.projectile = new Button(this, 800, 1080-100, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_pro",
            () => {
                this.data.set("type", "shieldp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.projectile.setAlt(this, 800, 1080-100, "ssb_weap_pro");

        this.rocket = new Button(this, 1100, 1080-100, "button_shadow",
            "button_bg", "button_fg", "ssr_weap_rock",
            () => {
                this.data.set("type", "rocketp");
                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shopW, this.shopWText);
                this.updateShopW(false);
                this.shopWActive = true;
                this.shopTActive = false;
            });
        this.rocket.setAlt(this, 1100, 1080-100, "ssb_weap_rock");
        this.backT = new Button(this, 1400, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_back",
            ()=>{

                this.closeShop(this.shopT, this.shopTText, false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shopTActive = false;
                this.shop1Active = true;


            });
        this.shopT = [this.laser, this.projectile, this.rocket, this.backT];
        this.shopTText = [
            this.add.text(500-30, 1080-50, "Laser", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(800-50, 1080-50, "Projectile", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1100-30, 1080-50, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1400-30, 1080-50, "back", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false)

        ];
        this.energyShopT = this.createEnergyCostIconsT();
        this.energyCostT = this.createEnergyCostTextT();
        this.closeShop(this.shopT, this.shopTText, false);
    }

    createChooseMod(): void{
        this.ship = new Button(this, 500, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_space_shuttle",
            ()=>{
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
                this.displayShop(this.shop1, this.shop1Text);
                this.updateShop1(false);
                this.shop1Active = true;
                this.shopWActive = false;
                //system.pushSymbol(createWMod)
        });
        this.drone1 = new Button(this, 800, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{
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
                this.displayShop(this.shop1, this.shop1Text);
                this.updateShop1(false);
                this.shop1Active = true;
                this.shopWActive = false;
        });

        this.drone2 = new Button(this, 1100, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_wmod",
            ()=>{
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
                this.displayShop(this.shop1, this.shop1Text);
                this.updateShop1(false);
                this.shop1Active = true;
                this.shopWActive = false;
        });
        this.close2 = new Button(this, 1400, 1080-100, "button_shadow",
            "button_bg", "button_fg", "button_back",
            ()=>{
                this.closeShop(this.shopW, this.shopWText, false);
                this.displayShop(this.shop1, this.shop1Text);
                this.shop1Active = true;
                this.shopWActive = false;
        });

        this.shopW = [this.ship, this.drone1, this.drone2, this.close2];
        this.shopWText = [
            this.add.text(500-30, 1080-50, "ship", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(800-40, 1080-50, "drone 1", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1100-30, 1080-50, "drone 2", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}).setVisible(false),
            this.add.text(1400-30, 1080-50, "back", {
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
            }
            for (let t of this.energyCostText) {
                t.setVisible(true);
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
        if(wMods >= 3 || energy < wmodCost){
            this.wModule.changeButton(this,false,false, player);
            this.wModule.removeInteractive();
            if(wMods >= 3) {
                this.children.remove(this.shop1Text[2]);
                this.shop1Text[2] = this.add.text(820, 1080 - 50, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                });
            }
            else{
                this.children.remove(this.shop1Text[2]);
                this.shop1Text[2] = this.add.text(800, 1080 - 50, "! energy", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                });
            }



        }
        else if(wMods < 3 && energy >= wmodCost){
            this.wModule.changeButton(this,false,true, player);
            this.wModule.restoreInteractive();
            this.active = true;
            this.children.remove(this.shop1Text[2]);
            this.shop1Text[2] = this.add.text(815, 1080 - 50, "wMod", {
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
                this.shop1Text[3] = this.add.text(1020, 1080 - 50, "max", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
                })
            }

            else{
                this.shop1Text[3] = this.add.text(1000, 1080 - 50, "! energy", {
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
            this.shop1Text[3] = this.add.text(1015, 1080 - 50, "Solar", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            })
        }

        if(energy < regenCost){
            this.regen.changeButton(this,false,false, player);
            this.regen.removeInteractive();

            this.children.remove(this.shop1Text[0]);
            this.shop1Text[0] = this.add.text(400, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });


        }

        else if(energy >= regenCost){
            this.regen.changeButton(this, false, true, player);
            this.regen.restoreInteractive();
            this.children.remove(this.shop1Text[0]);
            this.shop1Text[0] = this.add.text(385, 1080 - 50, "Regenerate", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });


        }

        if(energy < weaponCost){
            this.wExt.changeButton(this,false,false, player);
            this.wExt.removeInteractive();
            this.children.remove(this.shop1Text[1]);
            this.shop1Text[1] = this.add.text(600, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            });
        }

        else if(energy >= weaponCost){
            this.wExt.changeButton(this, false,true, player);
            this.wExt.restoreInteractive();
            this.children.remove(this.shop1Text[1]);
            this.shop1Text[1] = this.add.text(615, 1080 - 50, "wExt", {
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
            this.shopWText[0] = this.add.text(500-60, 1080 - 50, "max weapons", {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);

        }
        else if(shipActive < 3 && energy >= weaponCost){
            this.ship.changeButton(this, false, true, player);
            this.ship.restoreInteractive();
            this.children.remove(this.shopWText[0]);
            this.shopWText[0] = this.add.text(500-30, 1080 - 50, "ship", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);

        }

        if(dronesNr < 2 || d1Active >= 3 || energy < weaponCost)
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

        else if(dronesNr >= 2 && d1Active < 3 && energy >= weaponCost){
            this.drone1.changeButton(this, false, true, player);
            this.drone1.restoreInteractive();
            this.children.remove(this.shopWText[1]);
            this.shopWText[1] = this.add.text(800-40, 1080 - 50, "drone 1", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);

        }

        if(dronesNr < 3 || d2Active >= 3 || energy < weaponCost)
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

        else if(dronesNr >= 3 && d2Active < 3 && energy >= weaponCost){
            this.drone2.changeButton(this, false,true, player);
            this.drone2.restoreInteractive();
            this.children.remove(this.shopWText[2]);
            this.shopWText[2] = this.add.text(1100-40, 1080 - 50, "drone 2", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
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
            this.shopTText[2] = this.add.text(1050, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
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
            this.shopTText[2] = this.add.text(1060, 1080 - 50, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
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
        let adaptCost = player.getEnergyCost("adapt");
        this.updateEnergyCostTextS();
        if(energy < armorCost){

            this.armor.changeButton(this, false, false, player);

            this.armor.removeInteractive();
            this.children.remove(this.shopSText[0]);
            this.shopSText[0] = this.add.text(405, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= armorCost){
            this.armor.changeButton(this, false, true, player);

            this.armor.restoreInteractive();
            this.children.remove(this.shopSText[0]);
            this.shopSText[0] = this.add.text(415, 1080 - 50, "Armor", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < shieldCost){

            this.shield.changeButton(this, false, false, player);

            this.shield.removeInteractive();
            this.children.remove(this.shopSText[1]);
            this.shopSText[1] = this.add.text(605, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= shieldCost){
            this.shield.changeButton(this, false, true, player);

            this.shield.restoreInteractive();
            this.children.remove(this.shopSText[1]);
            this.shopSText[1] = this.add.text(615, 1080 - 50, "Shield", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < rocketCost){

            this.rocketS.changeButton(this, false, false, player);

            this.rocketS.removeInteractive();
            this.children.remove(this.shopSText[2]);
            this.shopSText[2] = this.add.text(805, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= rocketCost){
            this.rocketS.changeButton(this, false, true, player);

            this.rocketS.restoreInteractive();
            this.children.remove(this.shopSText[2]);
            this.shopSText[2] = this.add.text(815, 1080 - 50, "Rocket", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < nanoCost){

            this.nano.changeButton(this, false, false, player);

            this.nano.removeInteractive();
            this.children.remove(this.shopSText[3]);
            this.shopSText[3] = this.add.text(1005, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= nanoCost){
            this.nano.changeButton(this, false, true, player);

            this.nano.restoreInteractive();
            this.children.remove(this.shopSText[3]);
            this.shopSText[3] = this.add.text(1015, 1080 - 50, "Nano", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }

        if(energy < adaptCost){

            this.adapt.changeButton(this, false, false, player);

            this.adapt.removeInteractive();
            this.children.remove(this.shopSText[4]);
            this.shopSText[4] = this.add.text(1205, 1080 - 50, "! energy", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }
        else if(energy >= adaptCost){
            this.adapt.changeButton(this, false, true, player);

            this.adapt.restoreInteractive();
            this.children.remove(this.shopSText[4]);
            this.shopSText[4] = this.add.text(1200, 1080 - 50, "Adaptive", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2
            }).setVisible(true);
        }
    }

    updateShopZ(): void{
        let player = this.turn.getCurrentPlayer();
        let zone1 = player.getHealth().zone1Bar.getBars();
        let zone2 = player.getHealth().zone2Bar.getBars();
        let zone3 = player.getHealth().zone3Bar.getBars();
        let zone4 = player.getHealth().zone4Bar.getBars();

        if(zone1 == 0){
            this.zone1.changeButton(this, false, false, player);
            this.zone1.removeInteractive();
            this.children.remove(this.shopZText[0]);
            this.shopZText[0] = this.add.text(410, 1080-50, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2})
        }
        if(zone2 == 0){
            this.zone2.changeButton(this, false, false, player);
            this.zone2.removeInteractive();
            this.children.remove(this.shopZText[1]);
            this.shopZText[1] = this.add.text(660, 1080-50, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2})
        }
        if(zone3 == 0){
            this.zone3.changeButton(this, false, false, player);
            this.zone3.removeInteractive();
            this.children.remove(this.shopZText[2]);
            this.shopZText[2] = this.add.text(910, 1080-50, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2})
        }
        if(zone4 == 0){
            this.zone4.changeButton(this, false, false, player);
            this.zone4.removeInteractive();
            this.children.remove(this.shopZText[3]);
            this.shopZText[3] = this.add.text(1160, 1080-50, "destroyed", {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2})
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

    // energy display for main shop
    createEnergyCostIcons(): Phaser.GameObjects.Image[]{
        return [
            this.add.image(430, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(630, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(830, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(1030, 1080-180, "energy_icon").setScale(0.5,0.5)
        ]
    }
    createEnergyCostText(): Phaser.GameObjects.Text[]{
        return [
            this.add.text(450, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("nano"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(650, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("weapon"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(850, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("wmod"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(1050, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("solar"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),

        ]
    }

    createEnergyCostIconsS(): Phaser.GameObjects.Image[]{
        return [
            this.add.image(430, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(630, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(830, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(1030, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(1230, 1080-180, "energy_icon").setScale(0.5,0.5)
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
            this.add.image(480, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(780, 1080-180, "energy_icon").setScale(0.5,0.5),
            this.add.image(1080, 1080-180, "energy_icon").setScale(0.5,0.5)
        ]
    }
    createEnergyCostTextT(): Phaser.GameObjects.Text[]{
        return [
            this.add.text(500, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("weapon"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(800, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("weapon"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2}),
            this.add.text(1100, 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost("rocketl"), {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2})
        ]
    }

    updateEnergyCostT(): void{
        let energy = this.turn.getCurrentPlayer().getEnergy();
        let cost = this.turn.getCurrentPlayer().getEnergyCost("rocketl");
        if(energy < cost){
            this.children.remove(this.energyCostT[2]);
            this.energyCostT[2] = this.add.text(1100, 1080-200, "x "+cost, {
                fill: '#be0120', fontFamily: '"Roboto"', fontSize: 25, stroke:'#be0120', strokeThickness: 2});
        }

        else if(energy >= cost){
            this.children.remove(this.energyCostT[2]);
            this.energyCostT[2] = this.add.text(1100, 1080-200, "x "+cost, {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});
        }
    }


    updateEnergyCostText(): void{
        let type = "";
        for(let i = 0; i < 4; i++){
            this.children.remove(this.energyCostText[i]);
            switch (i) {
                case(0): type = "nano"; break;
                case(1): type = "weapon"; break;
                case(2): type = "wmod"; break;
                case(3): type = "solar"; break;

            }
            if(this.turn.getCurrentPlayer().getEnergy() < this.turn.getCurrentPlayer().getEnergyCost(type)){
                this.energyCostText[i] = this.add.text(450+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
                    fill: '#be0120', fontFamily: '"Roboto"', fontSize: 25, stroke:'#be0120', strokeThickness: 2});
            }
            else if(this.turn.getCurrentPlayer().getEnergy() >= this.turn.getCurrentPlayer().getEnergyCost(type)){

                this.energyCostText[i] = this.add.text(450+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 25, strokeThickness: 2});
            }

        }
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
                this.energyTextS[i] = this.add.text(450+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
                    fill: '#be0120', fontFamily: '"Roboto"', fontSize: 25, stroke:'#be0120', strokeThickness: 2});
            }
            else if(this.turn.getCurrentPlayer().getEnergy() >= this.turn.getCurrentPlayer().getEnergyCost(type)){

                this.energyTextS[i] = this.add.text(450+(200*i), 1080-200, "x "+this.turn.getCurrentPlayer().getEnergyCost(type), {
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
