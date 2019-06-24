import {Bot} from "./bot";

export class Botlog{

    private bot: Bot;
    private logs: string[];
    private heading: Phaser.GameObjects.Text;
    private botLog: Phaser.GameObjects.Text;
    private bg: Phaser.GameObjects.Sprite;

    public constructor(bot: Bot){
        this.bot = bot;
        this.logs = [];
        this.heading = new Phaser.GameObjects.Text(this.bot.scene, 1920/2, 1080/2 - 250, "Bot:",
        {fill: '#fff', fontFamily: '"Roboto"', fontSize: 36, strokeThickness: 2});
        this.heading.setOrigin(0.5);
        this.botLog = new Phaser.GameObjects.Text(this.bot.scene, 1920/2, 1080/2 - 200, this.logs,
            {fill: '#fff', fontFamily: '"Roboto"', fontSize: 28, strokeThickness: 2});
        this.botLog.setOrigin(0.5);
        this.bot.scene.add.existing(this.heading);
        this.bot.scene.add.existing(this.botLog);

        this.bg = new Phaser.GameObjects.Sprite(this.bot.scene, 1920/2, 1080/2-60, "shop_bg_back");
        this.bot.scene.add.existing(this.bg);
        this.bg.setAlpha(0.6);
        this.bg.setScale(0.4, 1.7);
        this.bg.setDepth(-1);
    }

    public insertLog(log: string): void{
        this.logs.push(log);
        this.updateLog();
    }

    public updateLog(): void{
        this.botLog.setText(this.logs);
    }

    public setVisible(): void{
        this.bg.visible = true;
        this.heading.visible = true;
        this.botLog.visible = true;
    }

    public setInvisible(): void{
        this.bg.visible = false;
        this.heading.visible = false;
        this.botLog.visible = false;
    }

    public changeVisible(): void{
        if(this.heading.visible){
            this.bg.setVisible(false);
            this.heading.setVisible(false);
            this.botLog.setVisible(false);
        }else{
            this.bg.setVisible(true);
            this.heading.setVisible(true);
            this.botLog.setVisible(true);
        }
    }

    public clearLog(): void{
        this.logs = [];
        this.updateLog();
    }
}