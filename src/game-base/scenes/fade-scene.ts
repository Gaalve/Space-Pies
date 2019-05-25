import Sprite = Phaser.GameObjects.Sprite;

export class FadeScene extends Phaser.Scene {


    private static transitionDuration: number = 4;
    private timer: number;
    private shutdown: string;
    private start: string;
    private next: boolean;
    private sprite: Sprite;

    constructor() {
        super({
            key: "FadeScene",
            active: false
        })
    }


    create(data: {shut: string, start: string}): void {
        this.sprite = new Sprite(this, 1920/2, 1080/2, 'atlas', 'button_bg');
        this.sprite.setScale(500);
        this.sprite.setTint(0x000000);
        this.add.existing(this.sprite);
        this.next = false;
        this.timer = 0;
        this.shutdown = data.shut;
        this.start = data.start;
    }


    update(time: number, delta: number): void {
        this.timer += delta/1000;
        if(this.timer < FadeScene.transitionDuration/3){
            let alpha = this.timer / (FadeScene.transitionDuration/3);
            this.sprite.setAlpha(alpha);
        }
        else if (this.timer >= 2*FadeScene.transitionDuration/3){
            let alpha = 1 - (this.timer - 2*FadeScene.transitionDuration/3) / (FadeScene.transitionDuration/3);
            this.sprite.setAlpha(alpha);
            if(this.timer > FadeScene.transitionDuration){
                this.sprite.setAlpha(0);
                this.scene.remove('FadeScene');
            }
        }
        else {
            this.sprite.setAlpha(1);
            if(this.next) return;
            this.next = true;
            this.sprite.setAlpha(1);
            this.scene.remove(this.shutdown);
            this.scene.launch(this.start);
        }
    }
}
