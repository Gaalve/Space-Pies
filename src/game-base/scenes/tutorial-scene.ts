import Text = Phaser.GameObjects.Text;
import {TutSubSceneManager} from "../mechanics/tutorial/tut-sub-scene-manager";
import {TutAnimationContainer} from "../mechanics/tutorial/scenes/scene-mechanics/tut-animation-container";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {Infobox} from "../mechanics/Infobox";

export class TutorialScene extends Phaser.Scene {
    private mgr : TutSubSceneManager;
    private animationContainer: TutAnimationContainer;
    private pem: ParticleEmitterManager;
    constructor() {
        super({
            key: "TutorialScene",
            active: false
        })
    }

    preload(): void {
    }


    create(): void {
        this.data.set("infoboxx",new Infobox(this));
        this.mgr = new TutSubSceneManager(this);
        this.pem = this.add.particles("parts");
        this.pem.setDepth(5);
        this.animationContainer = new TutAnimationContainer(this.pem);
        this.data.set("animCont", this.animationContainer);
    }


    update(time: number, delta: number): void {
        this.mgr.update(delta/1000);
    }
}
