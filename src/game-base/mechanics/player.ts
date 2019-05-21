import {Drone} from "./drone";
import {PiSystem} from "./picalc/pi-system";
import {Ship} from "./ship";
import {Health} from "./health/health";
import {Animation} from "./animation/Animation";
import {ScenePiAnimation} from "../scenes/ScenePiAnimation";

export class Player {
    private nameIdentifier: string;
    private firstPlayer: boolean;
    private drones : [Drone, Drone, Drone];
    private scene : Phaser.Scene;
    private system : PiSystem;
    private ship : Ship;
    private activatedDrones : number;
    private health : Health;


    public constructor(scene: Phaser.Scene, x: number, y: number, nameIdentifier: string, isFirstPlayer: boolean, piSystem : PiSystem){
        this.nameIdentifier = nameIdentifier;
        this.firstPlayer = isFirstPlayer;
        this.system = piSystem;
        this.ship = new Ship(scene, x, y, this);
        this.drones = [new Drone(scene, x, y, this, 0), new Drone(scene, x, y, this, 1), new Drone(scene, x, y, this,2 )];
        this.scene = scene;
        this.activatedDrones = 1;
        this.drones[0].addWeapon("p");
        this.system = piSystem;
        this.health = new Health(scene, this, piSystem);

        // z1 starts with 1 shield
        this.health.addToHz(piSystem, 'rshield', 'z1');
        this.health.addToHz(piSystem, 'rshield', 'z1');
        this.health.addToHz(piSystem, 'rarmor', 'z1');

        // z2 starts with 1 shield
        this.health.addToHz(piSystem, 'rshield', 'z2');
        this.health.addToHz(piSystem, 'rarmor', 'z2');
        this.health.addToHz(piSystem, 'rarmor', 'z2');

        // z3 starts with 1 armor
        this.health.addToHz(piSystem, 'rshield', 'z3');
        this.health.addToHz(piSystem, 'rarmor', 'z3');
        this.health.addToHz(piSystem, 'rshield', 'z3');

        // z4 starts with 1 armor
        this.health.addToHz(piSystem, 'rarmor', 'z4');
        this.health.addToHz(piSystem, 'rarmor', 'z4');
        this.health.addToHz(piSystem, 'rshield', 'z4');

        if(this.nameIdentifier == "P1"){
            this.system.pushSymbol(this.system.add.channelIn("wmod1","*").process("cD11", () => {
                this.createDrone(1);
            }));
        }else {
            this.system.pushSymbol(this.system.add.channelIn("wmod2", "*").process("cD21", () => {
                this.createDrone(1);
            }));
        }

    }


    getNameIdentifier(): string{
        return this.nameIdentifier;
    }

    isFirstPlayer(): boolean{
        return this.firstPlayer;
    }

    getNrDrones(): number{
        return this.activatedDrones;
    }
    getDrones(): Drone[]{
        return this.drones;
    }

    getSystem() : PiSystem{
        return this.system;
    }

    /**
    activate weapon drone that will be able to mount up to three weapons
     */
    createDrone(index : number) : void{
        this.activatedDrones = this.activatedDrones + 1;
        this.drones[index].piTermWExtensions();
        this.drones[index].setVisible(true);

        if(index == 1){
            if(this.nameIdentifier == "P1"){
                this.system.pushSymbol(this.system.add.channelIn('wmod1', '*').process("cD12", ()=>{this.createDrone(2)}));
            }else{
                this.system.pushSymbol(this.system.add.channelIn('wmod2', '*').process("cD22", ()=>{this.createDrone(2)}));
            }
        }
    }

    /**
	push pi terms for weapons to the pi system. Has to be done each round again
	 */
    pushWeapons() : void{
        for(let drone of this.drones) {
            if(drone.getNrWeapons() == 1) {
                this.system.pushSymbol(
                    this.system.add.channelIn("lock", "*").
                    channelOut(drone.getWeapons()[0].getPiTerm(), "*").nullProcess()
                );
            } else if (drone.getNrWeapons() == 2) {
                this.system.pushSymbol(
                    this.system.add.channelIn("lock", "*").
                    channelOut(drone.getWeapons()[0].getPiTerm(), "*").
                    channelOut(drone.getWeapons()[1].getPiTerm(), "*").nullProcess()
                );
                let animationScene = this.scene.scene.get("AnimationScene");
                animationScene.add.text(drone.getWeapons()[0].getX(), drone.getWeapons()[0].getY(), drone.getWeapons()[0].getPiTerm());
            } else if (drone.getNrWeapons() == 3) {
                let action = this.system.add.channelIn("lock", "*").
                channelOut(drone.getWeapons()[0].getPiTerm(), "*").
                channelOut(drone.getWeapons()[1].getPiTerm(), "*").
                channelOut(drone.getWeapons()[2].getPiTerm(), "*").nullProcess();

                this.system.pushSymbol(action);
                let animationScene = <ScenePiAnimation> this.scene.scene.get("AnimationScene");
                let text = animationScene.add.text(drone.getWeapons()[0].getX(), drone.getWeapons()[0].getY(), action.getSymbolSequence().replace("lock(*).", ""));
                let animation = new Animation(null, animationScene, 1920/2, 300, text);
                animationScene.addAnimation(animation);
                // text.x = -1000 + Math.sin(Math.PI/2 )*(1920/2 + 1000);

            }
        }
        this.unlockWeapons();
    }

    /**
    unlock the existing weapons in attack phase to deal damage to the opponents hit-points
     */
    unlockWeapons() : void{
        for(let i = 0; i < this.activatedDrones; i++){
            this.system.pushSymbol(this.system.add.channelOut("lock", "*").nullProcess());
        }
    }

    getPiSystem() : PiSystem
    {
        return this.system;
    }

}