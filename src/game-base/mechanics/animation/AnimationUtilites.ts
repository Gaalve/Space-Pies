import {HealthType} from "../health/health-type";
import {Player} from "../player";
import {ScenePiAnimation} from "../../scenes/ScenePiAnimation";
import {WeaponType} from "../weapon/weapon-type";
import Scene = Phaser.Scene;

export class AnimationUtilities
{

    static getLockReplicationText()
    {
        return "!(lock<*>)";
    }

    static getReplicationColor()
    {
                return '#ffff00'
    }

    static getPlayerColor(player: Player)
    {
        switch (player.getNameIdentifier())
        {
            case "P1":
                return '#B9433D'
            case "P2":
                return '#365B9B';
        }
    }

    static calculateWidth(onScreenTexts: Phaser.GameObjects.Text[])
{
    let width = 0;
    for (let text of onScreenTexts)
        width += text.width;
    return width;
}

    static getPlayerColorById(string: String)
    {
        switch (string)
        {
            case "P1":
                return '#B9433D'
            case "P2":
                return '#365B9B';
        }
    }

    static healthTypeToString(healthtype : HealthType)
    {
        switch (healthtype)
        {
            case HealthType.ArmorBar:
                return "ap";
            case HealthType.HitZoneBar:
                return "lp";
            case HealthType.ShieldBar:
                return "sp";
            case HealthType.RocketBar:
                return "rp";
            case HealthType.AdaptiveBar:
                return "xp";
            case HealthType.NanoBar:
                return "np";
        }
    }

    static stringToHealthtype(healthtype : String)
    {
        switch (healthtype)
        {
            case "ap":
                return HealthType.ArmorBar;
            case "lp":
                return HealthType.HitZoneBar;
            case "sp":
                return HealthType.ShieldBar;
            case "rp":
                return HealthType.RocketBar;
            case "xp":
                return HealthType.AdaptiveBar;
            case "np":
                return HealthType.NanoBar;
        }
    }

    static getHealthbarColor(healthtype: HealthType) : string{

        switch (healthtype) {
            case HealthType.HitZoneBar:
                return '#67C44F';
            case HealthType.ShieldBar:
                return '#59CAFA';
            case HealthType.ArmorBar:
                return '#C5C5C5';
            case HealthType.AdaptiveBar:
                return '#DCCD90';
            case HealthType.AdaptiveBar2:
                return '#f0f0f0';
            case HealthType.NanoBar:
                return '#8C7070';
            case HealthType.RocketBar:
                return '#B9433D';
        }
        return '#ffffff';
    }

    static getTerm(healthtype: HealthType) : string{

        switch (healthtype) {
            case HealthType.HitZoneBar:
                return "l";
            case HealthType.ShieldBar:
                return "s";
            case HealthType.ArmorBar:
                return "a";
            case HealthType.AdaptiveBar:
                return "x";
            case HealthType.AdaptiveBar2:
                return "x";
            case HealthType.NanoBar:
                return "n";
            case HealthType.RocketBar:
                return "r";
        }
        return "";
    }

    static popSymbol(text: Phaser.GameObjects.Text, scene: Phaser.Scene) {

        let term = new String(text.text);
        let firstSymbol = term.indexOf("!(") >= 0 ? term.substr(2, term.length - 1) : term.split(".")[0];
        let textObject = scene.add.text(text.x, text.y, firstSymbol, this.getFontStyle());
        text.text = term.substr(firstSymbol.length + 1  , term.length);
        textObject.x -= textObject.width;
        return textObject;

    }

    static peekSymbol(text: Phaser.GameObjects.Text, scene: Phaser.Scene) {

        let term = new String(text.text);
        let firstSymbol = term.indexOf("!(") >= 0 ? term.substr(2, term.length - 1) : term.split(".")[0];
        return firstSymbol;

    }

    static popSymbols(number: number, text: Phaser.GameObjects.Text, animationScene: ScenePiAnimation) {
        let term = new String(text.text).split(".");
        let textObjects = new Array<Phaser.GameObjects.Text>();
        for (let i = 0; i < number; i++)
        {
            let textObject = animationScene.add.text(text.x, text.y, term[i], this.getFontStyle());

            textObject.x -= textObject.width;
            textObjects.push(textObject);
        }

        return textObjects;
    }

    static getFontStyle() {
        return {fill: '#fff', fontFamily: '"Roboto"', fontSize: 20, fontStyle: 'bold', strokeThickness: 2};
    }

    static popAllSymbols(onScreenText: Phaser.GameObjects.Text, scene: Scene) {
        let term = new String(onScreenText.text).split(".");
        let textObjects = new Array<Phaser.GameObjects.Text>();
        for (let i = 0; i < term.length; i++)
        {
            let textObject = scene.add.text(onScreenText.x, onScreenText.y, term[i], this.getFontStyle());
            textObject.x += textObject.width;
            textObjects.push(textObject);
        }

        return textObjects;
    }

    static getAbbreviation(weaponType: WeaponType.LASER_ARMOR | WeaponType.PROJECTILE_SHIELD | WeaponType.ROCKET)
    {
        switch(weaponType)
        {
            case WeaponType.LASER_ARMOR:
                return "lp";
            case WeaponType.PROJECTILE_SHIELD:
                return "ap";
            case WeaponType.ROCKET:
                return "rp";
        }
        return null;
    }

    static getWeaponColorById(id: string)
    {
        switch (id)
        {
            case "sp":
                return '#59CAFA';
            case "rp":
                return '#B9433D';
            case "ap":
                return '#C5C5C5';
            case "lp":
                return '#67C44F';
        }
        return null;
    }
}
