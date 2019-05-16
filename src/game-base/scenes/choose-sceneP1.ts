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

    constructor(){
        super({
            key: 'chooseSceneP1',
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
        this.Player1 = this.scene.get('MainScene').data.get('P1');
        let type = this.scene.get('chooseTypeSceneP1').data.get('type');
        let drones = this.Player1.getDrones();
        let droneNr = this.Player1.getNrDrones();
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

        this.background = this.add.image(2150, 500,"shop_bg");
        const text = this.add.text(1920-650, 50, 'choose Weapon Mod', {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 0})

        if(this.m0activeExt >= 3) {
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                () => {
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-600, 250);
            const shipTL = this.add.text(1920-500, 220, 'max reached', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

        }
        if(this.m0activeExt < 3){
            this.shipL = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_space_shuttle",
                ()=>{
                    this.events.emit('shipL');
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.shipL.setPosition(1920-600, 250);
            const shipTL = this.add.text(1920-500, 220, 'ship', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(type == true){
                const piWext1 = this.add.text(1920-350, 220, 'wextp1m0(l).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext1 = this.add.text(1920-350, 220, 'wextp1m0(p).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }


        }

        if(this.m1activeExt >= 3 || droneNr < 2){
            this.drone1L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-600, 450);
            if(droneNr < 2){
                const droneTL = this.add.text(1920-500, 420, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
            else{
                const droneTL = this.add.text(1920-500, 420, 'max reached', {
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
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            this.drone1L.setPosition(1920-600, 450);
            const droneTL = this.add.text(1920-500, 420, 'drone 1', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});
            if(type == true){
                const piWext2 = this.add.text(1920-350, 420, 'wextp1m2(l).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext2 = this.add.text(1920-350, 420, 'wextp1m1(p).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        if(this.m2activeExt >= 3 || droneNr< 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_cancel_red",
                ()=>{
             });
            if(droneNr < 3){
                const droneTL = this.add.text(1920-500, 620, 'mod not built', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            }
            else {
                const droneT2L = this.add.text(1920 - 500, 620, 'max reached', {
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2
                });
            }
            this.drone2L.setPosition(1920-600, 650)

        }
        if(this.m2activeExt < 3 && droneNr >= 3){
            this.drone2L = new Button(this, 500, 500, "button_shadow",
                "button_bg", "button_fg", "button_wext",
                ()=>{
                if(type == true){
                    this.events.emit('drone2L');

                }
                else{
                    this.events.emit('drone2P');

                }
                    this.scene.sleep()
                    //system.pushSymbol(createWMod)
                });
            const droneT2L = this.add.text(1920-500, 620, 'drone2', {
                fill: '#fff', fontFamily: '"Roboto"', fontSize: 40, strokeThickness: 2});

            this.drone2L.setPosition(1920-600, 650)
            if(type == true){
                const piWext3 = this.add.text(1920-350, 620, 'wextp1m2(l).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }
            else{
                const piWext3 = this.add.text(1920-350, 620, 'wextp1m2(p).0',{
                    fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, strokeThickness: 2} )

            }

        }
        this.close = new Button(this, 500, 500, "button_shadow",
            "button_bg", "button_fg", "button_cancel_black",
            ()=> {
                this.scene.sleep()
            });
        this.close.setPosition(1920-600, 850);
        const closeT = this.add.text(1920-500, 820, 'close', {
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