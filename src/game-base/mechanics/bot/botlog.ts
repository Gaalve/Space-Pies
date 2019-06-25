import {Bot} from "./bot";

export class Botlog{

    private bot: Bot;
    private logs: Phaser.GameObjects.Text[];
    private heading: Phaser.GameObjects.Text;
    private bg: Phaser.GameObjects.Sprite;
    private nrLogs: number;


    public constructor(bot: Bot){
        this.bot = bot;
        this.logs = [];
        this.nrLogs = 0;

        this.heading = new Phaser.GameObjects.Text(this.bot.scene, 1920/2-250, 1080/2 - 250, "Bot:",
        {fill: '#fff', fontFamily: '"Roboto"', fontSize: 30, strokeThickness: 2});
        this.bot.scene.add.existing(this.heading);

        this.bg = new Phaser.GameObjects.Sprite(this.bot.scene, 1920/2, 1080/2-60, "shop_bg_back");
        this.bot.scene.add.existing(this.bg);
        this.bg.setAlpha(0.6);
        this.bg.setScale(0.4, 1.7);
        this.bg.setDepth(-1);
    }

    public insertLog(log: string): void{
        let newLog = new Phaser.GameObjects.Text(this.bot.scene, 1920/2-250, 1080/2 - 200 + this.nrLogs * 35, log,
        {fill: '#fff', fontFamily: '"Roboto"', fontSize: 24, strokeThickness: 1});
        this.bot.scene.add.existing(newLog);
        this.logs.push(newLog);
        this.nrLogs++;
    }

    public setVisible(): void{
        this.bg.setVisible(true);
        this.heading.setVisible(true);
        for(let text of this.logs) text.setVisible(true);
    }

    public setInvisible(): void{
        this.bg.setVisible(false);
        this.heading.setVisible(false);
        for(let text of this.logs) text.setVisible(false);
    }

    public changeVisible(): void{
        if(this.heading.visible){
            this.setInvisible();
        }else{
            this.setVisible();
        }
    }

    public clearLog(): void{
        for(let text of this.logs){
            text.destroy();
        }
        this.nrLogs = 0;
    }
}