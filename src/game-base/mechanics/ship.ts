import {Player} from "./player";
import {BaseShip} from "./ship/base-ship";
import {RedShip} from "./ship/red-ship";
import {BlueShip} from "./ship/blue-ship";
import Scene = Phaser.Scene;
import {Debris} from "./ship/debris";
import {GuiScene} from "../scenes/gui-scene";
import {MainScene} from "../scenes/main-scene";
import {EndSceneP1} from "../scenes/end-sceneP1";


export class Ship{

    private scene: Scene;
    private player: Player;
    public posX : number;
    public posY : number;
    private isRed: boolean;
    private _modularShip: BaseShip;
    private debris: Debris[];

    public constructor (scene : Phaser.Scene, x: number, y: number, player : Player){
        this.scene = scene;
        if(player.getNameIdentifier() == "P1"){
            this.isRed = true;
            this._modularShip = new RedShip(scene, x, y);
        }else{
            this.isRed = false;
            this._modularShip = new BlueShip(scene, x, y);
        }

        this.player = player;
        this.posX = x;
        this.posY = y;
        this.debris = [];


    }

    public explosion(): void{
        this.player.isDead=true;
        //this.scene.scene.sleep('GuiScene');
        this.scene.time.delayedCall(5000, ()=>{this.scene.scene.launch('EndSceneP1');this.scene.scene.bringToTop('EndSceneP1') }, [], this);

        this.scene.time.delayedCall(0, this.explosionAt, [0, 0], this);


        for (let i = 0; i < 90; i++) {
            this.scene.time.delayedCall(170 * i, this.explosionAt, [Math.random()*300 - 150, Math.random()*300 - 150, Math.random()*0.4 + 0.3], this);
        }

        for (let i = 0; i < 30; i++){
            this.scene.time.delayedCall(500 * i, this.createDebris, [], this);
        }

        if(this.isRed) {
            this.exploedP1();
        }else this.exploedP2();
    }

    private createDebris(){
        this.debris.push(new Debris(this.scene, this.posX, this.posY));
    }

    public update(delta: number): void{
        this._modularShip.update(delta);
        for (let idx in this.debris){
            this.debris[idx].update(delta);
        }
    }

    private exploedP1(): void{

        if(this.player.getDrones()[1].visible){
            this.scene.time.delayedCall(3000, this.explosion2At, [300, -300, 0.7, 2.4], this);
            this.scene.time.delayedCall( 3400, ()=>{this.player.getDrones()[1].destroy();
                                                                    for(let w of this.player.getDrones()[1].getWeapons()){
                                                                        w.destroy();
                                                                    }
                                                                    this.player.getDrones()[1].onScreenText.destroy();}, [], this);
            this.scene.time.delayedCall(3400, ()=>{this.debris.push(new Debris(this.scene, this.posX + 300, this.posY - 300))}, [], this);
            this.scene.time.delayedCall(3400, ()=>{this.debris.push(new Debris(this.scene, this.posX + 300, this.posY - 300))}, [], this);
        }
        if(this.player.getDrones()[2].visible){
            this.scene.time.delayedCall(3200, this.explosion2At, [300, 300, 0.7, 2.4], this);
            this.scene.time.delayedCall( 3600, ()=>{this.player.getDrones()[2].destroy();
                                                                    for(let w of this.player.getDrones()[2].getWeapons()){
                                                                        w.destroy();
                                                                    }
                                                                    this.player.getDrones()[2].onScreenText.destroy();}, [], this);
            this.scene.time.delayedCall(3600, ()=>{this.debris.push(new Debris(this.scene, this.posX + 300, this.posY + 300))}, [], this);
            this.scene.time.delayedCall(3600, ()=>{this.debris.push(new Debris(this.scene, this.posX + 300, this.posY + 300))}, [], this);
        }

        this.scene.time.delayedCall(2000, this.explosion2At, [40, -130, 0.85, 2.4], this);
        this.scene.time.delayedCall(2500, ()=>{this._modularShip.toDestroyedWingUp()}, [], this);
        this.scene.time.delayedCall(2700, ()=>{this.player.getDrones()[0].getWeapons()[2].destroy()}, [], this);

        this.scene.time.delayedCall(5000, this.explosion2At, [40, 110, 0.85, 2.4], this);
        this.scene.time.delayedCall(5050, this.explosion2At, [40, 0, 0.85, 1], this);
        this.scene.time.delayedCall(5500, ()=>{this._modularShip.toDestroyedWingDown()}, [], this);
        this.scene.time.delayedCall(5700, ()=>{this.player.getDrones()[0].getWeapons()[1].destroy()}, [], this);

        this.scene.time.delayedCall(8000, this.explosion2At, [-60, -100, 0.85, 2.4], this);
        this.scene.time.delayedCall(8050, this.explosion2At, [-60, 100, 0.85, 2.4], this);
        this.scene.time.delayedCall(8500, ()=>{this._modularShip.toDestroyedBack();}, [], this);
        this.scene.time.delayedCall(8900, ()=>{ this.player.getDrones()[0].onScreenText.destroy();},[], this);

        this.scene.time.delayedCall(11000, this.explosion2At, [165, 0, 0.85, 2.4], this);
        this.scene.time.delayedCall(11500, ()=>{this._modularShip.toDestroyedPilot()}, [], this);

        this.scene.time.delayedCall(12000, ()=>{
            for(let sd of this.player.getSolarDrones()){
                if(sd.visible){
                    sd.explode();
                    sd.health.removeBars();
                }
            }
        },[], this);

        this.scene.time.delayedCall(14000, this.explosion2At, [20, 0, 0.85, 2.4], this);
        this.scene.time.delayedCall(14080, this.explosion2At, [150, 0, 0.85, 1.2], this);
        this.scene.time.delayedCall(14500, ()=>{this._modularShip.toDestroyedHull()}, [], this);
        this.scene.time.delayedCall(14700, ()=>{this.player.getDrones()[0].getWeapons()[0].destroy();}, [], this);


    }

    private exploedP2(): void{

        if(this.player.getDrones()[1].visible){
            this.scene.time.delayedCall(3000, this.explosion2At, [-300, -300, 0.7, 2.4], this);
            this.scene.time.delayedCall( 3400, ()=>{this.player.getDrones()[1].destroy();
                                                                    for(let w of this.player.getDrones()[1].getWeapons()){
                                                                        w.destroy();
                                                                    }
                                                                    this.player.getDrones()[1].onScreenText.destroy();}, [], this);
            this.scene.time.delayedCall(3400, ()=>{this.debris.push(new Debris(this.scene, this.posX - 300, this.posY - 300))}, [], this);
            this.scene.time.delayedCall(3400, ()=>{this.debris.push(new Debris(this.scene, this.posX - 300, this.posY - 300))}, [], this);
        }
        if(this.player.getDrones()[2].visible){
            this.scene.time.delayedCall(3200, this.explosion2At, [-300, 300, 0.7, 2.4], this);
            this.scene.time.delayedCall( 3600, ()=>{this.player.getDrones()[2].destroy();
                                                                    for(let w of this.player.getDrones()[2].getWeapons()){
                                                                        w.destroy();
                                                                    }
                                                                    this.player.getDrones()[2].onScreenText.destroy();}, [], this);
            this.scene.time.delayedCall(3600, ()=>{this.debris.push(new Debris(this.scene, this.posX - 300, this.posY + 300))}, [], this);
            this.scene.time.delayedCall(3600, ()=>{this.debris.push(new Debris(this.scene, this.posX - 300, this.posY + 300))}, [], this);
        }

        this.scene.time.delayedCall(2000, this.explosion2At, [-10, -130, 0.7, 2.4], this);
        this.scene.time.delayedCall(2500, ()=>{this._modularShip.toDestroyedWingUp()}, [], this);
        this.scene.time.delayedCall(2700, ()=>{this.player.getDrones()[0].getWeapons()[2].destroy()}, [], this);

        this.scene.time.delayedCall(5000, this.explosion2At, [-20, 110, 0.7, 2.4], this);
        this.scene.time.delayedCall(5500, ()=>{this._modularShip.toDestroyedWingDown()}, [], this);
        this.scene.time.delayedCall(5700, ()=>{this.player.getDrones()[0].getWeapons()[1].destroy()}, [], this);

        this.scene.time.delayedCall(8050, this.explosion2At, [90, 0, 0.85, 2.0], this);
        this.scene.time.delayedCall(8500, ()=>{this._modularShip.toDestroyedBack();}, [], this);
        this.scene.time.delayedCall(8900, ()=>{ this.player.getDrones()[0].onScreenText.destroy();},[], this);

        this.scene.time.delayedCall(11000, this.explosion2At, [-155, 0, 0.5, 1.8], this);
        this.scene.time.delayedCall(11400, ()=>{this._modularShip.toDestroyedPilot()}, [], this);

        this.scene.time.delayedCall(12000, ()=>{
            for(let sd of this.player.getSolarDrones()){
                if(sd.visible){
                    sd.explode();
                    sd.health.removeBars();
                }
            }
        },[], this);

        this.scene.time.delayedCall(14000, this.explosion2At, [-40, 0, 0.85, 2.4], this);
        this.scene.time.delayedCall(14500, ()=>{this._modularShip.toDestroyedHull()}, [], this);
        this.scene.time.delayedCall(14700, ()=>{this.player.getDrones()[0].getWeapons()[0].destroy()}, [], this);
    }

    private explosionAt(offX: number, offY: number, scale: number = 1): void{
        this.player.explosion.explosionAt(this.posX + offX, this.posY + offY, scale);
    }

    public explosion2At(offX: number, offY: number, lifeScale: number = 1, speedScale: number = 1): void{
        this.player.explosion.explosionAt(this.posX + offX, this.posY + offY, lifeScale, speedScale);
    }

    get modularShip(): BaseShip
    {
        return this._modularShip;
    }

    set modularShip(value: BaseShip)
    {
        this._modularShip = value;
    }
}