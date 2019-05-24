import Sprite = Phaser.GameObjects.Sprite;

export class Button{

    private hovering: boolean;
    private scale: number;
    private onClick: Function;

    //Textures
    private readonly shadow: Phaser.GameObjects.Sprite;
    private readonly bg: Phaser.GameObjects.Sprite;
    private readonly img: Phaser.GameObjects.Sprite;
    private fg: Phaser.GameObjects.Sprite;

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
        this.shadow.setOrigin(0.5, 0.5);
        this.bg.setOrigin(0.5, 0.5);
        this.img.setOrigin(0.5, 0.5);
        this.fg.setOrigin(0.5, 0.5);
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

    }

    clicked():void{
        this.scale = 0.95;
        this.onClick();
    }

    public setOnClick(onClick: Function){
        this.onClick = onClick;
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
    }

    public setPosition(x: number, y: number): void{
        this.shadow.setPosition(x, y);
        this.bg.setPosition(x, y);
        this.fg.setPosition(x, y);
        this.img.setPosition(x, y);
    }

    public changeButton(scene: Phaser.Scene,x: number, y: number, fgTex: string, onClick: Function = ()=>{}): void{
        scene.children.remove(this.fg)
        this.fg = new Sprite(scene, x, y, fgTex)
        scene.add.existing(this.fg);
        this.onClick = onClick;
    }
}