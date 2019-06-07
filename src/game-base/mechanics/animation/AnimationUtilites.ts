import {HealthType} from "../health/health-type";
import {Animation} from "./Animation";
export class AnimationUtilities
{
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
        let textObject = scene.add.text(text.x, text.y, firstSymbol, {
            fill: '#fff', fontFamily: '"Roboto"', fontSize: 42, fontStyle: 'bold', strokeThickness: 2});
        text.text = term.substr(firstSymbol.length + 1  , term.length);
        return textObject;

    }

    static peekSymbol(text: Phaser.GameObjects.Text, scene: Phaser.Scene) {

        let term = new String(text.text);
        let firstSymbol = term.indexOf("!(") >= 0 ? term.substr(2, term.length - 1) : term.split(".")[0];
        return firstSymbol;

    }

}
