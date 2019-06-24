import Sprite = Phaser.GameObjects.Sprite;
import {Player} from "./player";

export class Button{

    public hovering: boolean;
    private scale: number;
    public onClick: Function;
    private func: Function;
    private active: boolean;
    private activeP2: boolean;

    //Textures
    public readonly shadow: Phaser.GameObjects.Sprite;
    public readonly bg: Phaser.GameObjects.Sprite;
    public readonly img: Phaser.GameObjects.Sprite;
    public readonly fg: Phaser.GameObjects.Sprite;
    public readonly inactive: Phaser.GameObjects.Sprite;
    public alt: Phaser.GameObjects.Sprite;

    //Color Interpolation
    private readonly startColor: Phaser.Display.Color;
    private readonly endColor: Phaser.Display.Color;
    private colorIdx: integer;
    private readonly colorDist: integer;

    public constructor(scene: Phaser.Scene, x: number, y: number, shadowTex: string,
                       bgText: string, imgTex: string, fgTex: string,
                       onClick: Function = ()=>{}) {
        this.scale = 0.95;
        this.shadow = new Sprite(scene, x, y, shadowTex);
        this.bg = new Sprite(scene, x, y, bgText);
        this.img = new Sprite(scene, x, y, imgTex);
        this.fg = new Sprite(scene, x, y, fgTex);
        this.alt = new Sprite(scene, x, y, fgTex);
        this.inactive = new Sprite(scene, x, y, "button_blocked");
        this.shadow.setOrigin(0.5, 0.5);
        this.bg.setOrigin(0.5, 0.5);
        this.img.setOrigin(0.5, 0.5);
        this.fg.setOrigin(0.5, 0.5);
        this.inactive.setOrigin(0.5, 0.5);
        this.alt.setOrigin(0.5,0.5);
        scene.add.existing(this.shadow);
        scene.add.existing(this.bg);
        scene.add.existing(this.img);
        scene.add.existing(this.fg);

        this.startColor = new Phaser.Display.Color(255, 255, 255, 255);
        this.endColor = new Phaser.Display.Color(255,255,51, 255);
        this.colorIdx = 0;
        this.colorDist = 10;

        this.shadow.setInteractive()
            .on('pointerover', () => {this.hovering = true; this.updateStep()}) //makes it feel more reactive
            .on('pointerout', () => this.hovering = false)
            .on('pointerup', () => this.clicked());
        this.onClick = onClick;
        this.func = onClick;
        this.active = true;
        this.activeP2 = false;

    }

    clicked():void{
        this.scale = 0.95;
        this.onClick();
    }

    public setOnClick(onClick: Function){
        this.onClick = onClick;
    }

    public removeInteractive(): void{
        this.onClick = ()=>{};
    }

    public restoreInteractive(): void{
        this.onClick = this.func;
    }

    public setInvisible(): void{
        this.shadow.setVisible(false);
        this.bg.setVisible(false);
        this.img.setVisible(false);
        this.fg.setVisible(false);
        this.inactive.setVisible(false)
        this.alt.setVisible(false)


    }

    public setVisible(): void{
        this.shadow.setVisible(true);
        this.bg.setVisible(true);
        this.img.setVisible(true);
        this.fg.setVisible(true);
        this.inactive.setVisible(true);
        this.alt.setVisible(true)


    }

    public updateStep(): void{
        if (this.hovering) this.scaleUp();
        else this.scaleDown();
        this.setScale();
        let colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(this.startColor, this.endColor, this.colorDist, this.colorIdx);
        let color = Phaser.Display.Color.ObjectToColor(colorObj).color;
        this.shadow.setTintFill(color);
    }

    private scaleDown(): void{
        this.scale -= 0.005;
        if (this.scale <= 0.95) this.scale = 0.95;
        if(this.colorIdx > 0) this.colorIdx--;
    }
    private scaleUp(): void{
        this.scale += 0.005;
        if (this.scale >= 1.00) this.scale = 1.00;
        if(this.colorIdx < this.colorDist) this.colorIdx++;
    }

    private setScale(): void{
        this.shadow.setScale(this.scale, this.scale);
        this.bg.setScale(this.scale, this.scale);
        this.fg.setScale(this.scale, this.scale);
        this.img.setScale(this.scale, this.scale);
        this.alt.setScale(this.scale, this.scale);
        this.inactive.setScale(this.scale, this.scale);
    }

    public setPosition(x: number, y: number): void{
        this.shadow.setPosition(x, y);
        this.bg.setPosition(x, y);
        this.fg.setPosition(x, y);
        this.img.setPosition(x, y);
        this.alt.setPosition(x, y);
        this.inactive.setPosition(x, y);
    }

    public changeButton(scene: Phaser.Scene, alt: boolean, active: boolean, player: Player): void{
        //scene.children.remove(this.fg);

        if(alt){
            if(!active){
                scene.children.replace(this.alt, this.inactive);
                this.active = false;

            }
            else{
                scene.children.replace(this.inactive, this.alt);
                this.active = true;

            }

        }

        else{
            if(!active){
                scene.children.replace(this.fg, this.inactive);
                this.active = false;

            }
            else{
                scene.children.replace(this.inactive, this.fg);
                this.active = true;

            }
        }

    }

    public setAlt(scene: Phaser.Scene, x: number, y: number, fgtex : string): void{
        this.alt = new Sprite(scene, x, y, fgtex);
    }

    public switchArt(scene: Phaser.Scene, player: Player): void{
        if(this.isActive()){
            if(player.getNameIdentifier() == "P1"){
                scene.children.replace(this.alt, this.fg);

            }
            else{
                scene.children.replace(this.fg, this.alt);
            }
        }

        else{
            if(player.getNameIdentifier() == "P1"){
                scene.children.replace(this.inactive, this.fg);

            }
            else{
                scene.children.replace(this.inactive, this.alt);
            }
        }



    }

    isActive(): boolean{
        return this.active;
    }


}