import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;


export class MotorFlame {

    private flameBack: Sprite;
    private flameMid: Sprite;
    private flameFront: Sprite;

    public constructor(scene: Scene){
        this.flameBack = scene.add.sprite (0,0, "fire_light");
        this.flameMid = scene.add.sprite (0,0, "fire_light");
        this.flameFront = scene.add.sprite (0,0, "fire_light");

        this.flameBack.setScale(1);
        this.flameMid.setScale(0.8);
        this.flameFront.setScale(0.6);

        this.flameBack.setOrigin(0, 0.5);
        this.flameMid.setOrigin(0, 0.5);
        this.flameFront.setOrigin(0, 0.5);
    }

    public tintRed(){
        this.flameBack.setTint(0xff2a2a);
        this.flameMid.setTint(0xff9955);
        this.flameFront.setTint(0xffdd55);
    }
    public tintBlue(){
        this.flameBack.setTint(0x427ef5);
        this.flameMid.setTint(0x42b0f5);
        this.flameFront.setTint(0x42e6f5);
    }
    public tintPurple(){
        this.flameBack.setTint(0x9642f5);
        this.flameMid.setTint(0xec42f5);
        this.flameFront.setTint(0xf542d1);
    }

    public flipX(){
        this.flameBack.setFlipX(true);
        this.flameMid.setFlipX(true);
        this.flameFront.setFlipX(true);
        this.flameBack.setOrigin(1 , 0.5);
        this.flameMid.setOrigin(1, 0.5);
        this.flameFront.setOrigin(1, 0.5);
    }
    public setAngle(){
        this.flameBack.setAngle(40);
        this.flameMid.setAngle(40);
        this.flameFront.setAngle(40);
    }
    public setAngle320(){
        this.flameBack.setAngle(320);
        this.flameMid.setAngle(320);
        this.flameFront.setAngle(320);
    }

    public setScale(scale: number){
        this.setScaleBack(scale);
        this.setScaleMid(scale);
        this.setScaleFront(scale);
    }

    private setScaleBack(scale: number){
        this.flameBack.setScale(scale);
    }

    private setScaleMid(scale: number){
        this.flameMid.setScale(0.80 * scale);
    }

    private setScaleFront(scale: number){
        this.flameFront.setScale(0.55 * scale);
    }

    public setScaleSin(scale: number, sinX: number){
        this.setScaleBack(this.getSin(sinX * 17) * scale);
        this.setScaleMid(this.getSin(sinX * 20) * scale);
        this.setScaleFront(this.getSin(sinX * 23) * scale);
    }

    private getSin(sinX: number){
        return (Math.sin(sinX) + 1)/2 * 0.15 + 0.85;
    }

    public setPosition(posX: number, posY: number){
        this.flameBack.setPosition(posX, posY);
        this.flameMid.setPosition(posX, posY);
        this.flameFront.setPosition(posX, posY);
    }
}