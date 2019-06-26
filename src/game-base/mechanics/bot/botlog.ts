import {Bot} from "./bot";

export class Botlog{

    private bot: Bot;
    private logs: Phaser.GameObjects.Text[];
    private heading: Phaser.GameObjects.Text;
    private bg: Phaser.GameObjects.Sprite;
    private nrLogs: number;

    private energyLogo: Phaser.GameObjects.Image;
    private energyText: Phaser.GameObjects.Text;
    private regenText: Phaser.GameObjects.Text;


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

        this.energyLogo = this.bot.scene.add.image(1920/2-125, 200, "energy_icon");
        this.energyText = this.bot.scene.add.text(1920/2-95, 160, "= " + this.bot.botEnergy, {
            fill: '#fff', fontFamily: '"Roboto-Medium"', fontSize: 64, strokeThickness: 1, stroke: '#fff'});
        this.regenText = this.bot.scene.add.text(1920/2+35, 170, "(+"+ this.bot.botRegenRate.toString() + ")", {
            fill: '#15ff31', fontFamily: '"Roboto"', fontSize: 35, stroke:'#15ff31',  strokeThickness: 2});

        this.bot.scene.add.existing(this.energyLogo);
        this.bot.scene.add.existing(this.energyText);
        this.bot.scene.add.existing(this.regenText);

        this.energyLogo.setVisible(false);
        this.energyText.setVisible(false);
        this.regenText.setVisible(false);
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

    public setLogoVisible(): void{
        this.energyLogo.setVisible(true);
        this.energyText.setVisible(true);
        this.regenText.setVisible(true);
    }

    public setLogoInvisible(): void{
        this.energyLogo.setVisible(false);
        this.energyText.setVisible(false);
        this.regenText.setVisible(false);
    }

    public updateEnergy(energy: number, regen: number): void{
        this.energyText.setText("= " + energy);

        this.regenText.setText("(+" + regen + ")");
        if(this.bot.botEnergy >= 100) {
            this.regenText.setX(1920 / 2 + 70);

        }else if(this.bot.botEnergy >= 1000){
            this.regenText.setX(1920 / 2 + 110);
        }
        else{
            this.regenText.setX(1920 / 2 + 35);
        }
    }
}