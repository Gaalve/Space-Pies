import {Turn} from "../mechanics/turn";
import {Player} from "../mechanics/player";
import {Button} from "../mechanics/button";

import {PiSystem} from "../mechanics/picalc/pi-system";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {PiTerm} from "../mechanics/picalc/pi-term";
import {PiSymbol} from "../mechanics/picalc/pi-symbol";
import {Drone} from "../mechanics/drone";

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

    constructor() {
        super({
            key: "MainScene",
            active: false
        })
    }

    preload(): void {
        // this.load.pack(
        //     "preload",
        //     "assets/pack.json",
        //     "preload"
        // )

        this.load.spritesheet('bleedingbar', 'assets/sprites/bleedingbar.png', { frameWidth: 19, frameHeight: 42, spacing: 5, startFrame: 0, endFrame: 42, margin: 0});


    }

    create(): void {
        this.system = new PiSystem(this, 1,1,1,true);
        this.data.set("system", this.system);
        this.pem = this.add.particles("parts");
        this.pem.setDepth(5);
        this.players = [new Player(this, 280, 540, "P1", true, this.system, this.pem), new Player(this, 1650, 540, "P2", false, this.system, this.pem)];
        this.turn = new Turn(this, this.players);
        this.data.set('P1', this.players[0]);
        this.data.set('P2', this.players[1]);
        this.buttonEndTurn = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_skip",
            ()=>{
                if(this.turn.clickable){
                    openShop1.setVisible(false).removeInteractive();
                    openShop2.setVisible(false).removeInteractive();
                    this.turn.Attackturn();
                }
                });
        this.buttonEndTurn.setPosition(1920/2, 500);

        const openShop1 = this.add.text(910, 600, "shop",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(false);

        const openShop2 = this.add.text(910, 600, "shop",{
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2}).setVisible(false);

        this.scene.get('ShopSceneP1').events.on("skip", function () {
            this.scene.sleep("ShopSceneP1");
            openShop1.setVisible(true);
            openShop1.setInteractive()
        },this);


        this.scene.get('ShopSceneP2').events.on("skip", function () {
            this.scene.sleep("ShopSceneP2");
            openShop2.setVisible(true);
            openShop2.setInteractive()
        },this);

        openShop1.on('pointerup', function (){
            this.scene.run('ShopSceneP1');

            openShop1.setVisible(false);
            openShop1.removeInteractive();
        },this);

        openShop2.on('pointerup', function (){

            this.scene.run('ShopSceneP2');


            openShop2.setVisible(false);
            openShop2.removeInteractive();
        },this);

        this.buttonOption = new Button(this, 100, 100, "button_shadow",
            "button_bg", "button_fg", "button_options",
            ()=>{
            this.scene.pause();
            this.scene.run('PauseScene');
            this.scene.setVisible(true,"PauseScene");

            }
        );
        this.buttonOption.setPosition(1880, 40);

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

        //locks for attack phase
        for(let i = 1; i < 3; i++){
            this.buildLocksPi(i);
        }

        //extra functions to resolve existing channels nolock1, nolock2, nolock3 after attack phase
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock1", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock2", "").nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn("nolock3", "").nullProcess()));

        //create 1 weapon for each player on ship
        this.system.pushSymbol(this.system.add.channelOut("wmod10","").channelOut("wext101", "shieldp2").nullProcess());
        this.system.pushSymbol(this.system.add.channelOut("wmod20", "").channelOut("wext201", "shieldp1").nullProcess());

    //#####################Testing
        //this.system.pushSymbol(this.system.add.channelOut("wmod11", "").channelOut("wext111", "armor").nullProcess());
        //this.system.pushSymbol(this.system.add.channelOut("wmod12", "").channelOut("wext121", "rocket").nullProcess());
    //#####################Testing


        this.system.start();
    }


    update(time: number, delta: number): void {
        this.timeAccumulator += delta;
        while (this.timeAccumulator >= this.timeUpdateTick) {
            this.timeAccumulator -= this.timeUpdateTick;
            this.buttonEndTurn.updateStep();
            this.buttonOption.updateStep();
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


        // TODO: fix: non existent weapons can shoot (and always hit)

        let droneRef: Drone = this.players[player - 1].getDrones()[drone];

        let sum = this.system.add.sum([this.system.add.channelIn("lock" + p,"").
                                                channelOutCB("w1","", (_, at) => {
                                                    droneRef.getWeapons()[0].createBullet(at == 'miss')}).        //function for weapon animation
                                                channelOutCB("w2", "", (_, at) => {
                                                    droneRef.getWeapons()[1].createBullet(at == 'miss')}).
                                                channelOutCB("w3", "", (_, at) => {
                                                    droneRef.getWeapons()[2].createBullet(at == 'miss')}).
                                                next(weapon),
                                              this.system.add.channelInCB("wext" + p + d + "1", "w1", (wClass) => {
                                                    this.players[player - 1].getDrones()[drone].addWeapon(wClass);
                                                    }).
                                                next(weapon),
                                              this.system.add.channelInCB("wext" + p + d + "2", "w2", (wClass) => {
                                                    this.players[player - 1].getDrones()[drone].addWeapon(wClass);
                                                    }).
                                                next(weapon),
                                              this.system.add.channelInCB("wext" + p + d + "3", "w3", (wClass) => {
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

}
