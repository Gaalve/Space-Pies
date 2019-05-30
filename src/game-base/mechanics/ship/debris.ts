import Scene = Phaser.Scene;

export class Debris extends Phaser.GameObjects.Sprite{

    private speedX: number;
    private speedY: number;
    private speedR: number;

    public constructor(scene: Scene, x: number, y: number){
        super(scene, x, y, 'debris/debris_'+Math.floor(Math.random()*10));
        this.speedX = Math.random()*2-1;
        this.speedY = Math.random()*2-1;
        this.rotation = Math.random() * 2 * Math.PI;
        this.speedR = 0;
        if(Math.random() < 0.5) this.speedR = Math.random()*0.01 - 0.005;
        this.speedX *= 0.4;
        this.speedY *= 0.4;

        scene.add.existing(this);
    }

    public update(delta: number): void{
        this.x += this.speedX;
        this.y += this.speedY;
        this.setRotation(this.rotation + this.speedR);
    }
}