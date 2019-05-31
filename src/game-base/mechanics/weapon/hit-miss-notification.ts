import Sprite = Phaser.GameObjects.Sprite;


export class HitMissNotification extends Sprite{

    private velX: number;
    private velY: number;
    private counter: number;

    constructor(scene: Phaser.Scene, x: number, y: number, hit: boolean, isFirst: boolean) {
        super(scene, x, y, hit ? "not_hit" : "not_miss");
        this.setDepth(12); //TODO
        scene.add.existing(this);
        const velHori = 1;
        this.velX = isFirst ? velHori : -velHori;
        this.velY = -0.6;
        this.counter = 0;
    }

    update(delta: number): void {
        this.counter += delta;
        this.x += this.velX * delta;
        this.y += this.velY * delta;
        this.velX -= this.velX * 0.05 * (delta / 17) ;
        this.velY += 0.02 * delta / 17;

        if(this.counter >= 1000){
            this.setScale(0);
        }
        else if (this.counter >= 500){
            this.setScale( (1000 - this.counter)/500);
        }
        else this.setScale(1);
    }

    shouldRemove(): boolean{
        return this.counter > 1500;
    }
}