import Scene = Phaser.Scene;
import {WeaponType} from "./weapon/weapon-type";
import {Player} from "./player";
import type = Mocha.utils.type;

export class Infobox
{
    private tooltipStrings = new Map<any,String>();
    private scene;

    constructor(scene: Scene)
    {
        this.scene = scene;
    }

    public addTooltipInfo(object: any, info: String , callbacks?: Function[])
    {
        let existingObject = this.tooltipStrings.get(object);
        if (typeof (existingObject) != 'undefined' && existingObject != null )
            this.tooltipStrings.delete(existingObject);
        object.setInteractive();
        this.tooltipStrings.set(object, info);
        let tooltip;
        let rounded;
        let textWidth = this.calculateTextWidth(info);
        object.on('pointermove', () =>
        {
            let xFix = 50;
            let x = this.scene.game.input.mousePointer.x < 1920/2 ? this.scene.game.input.mousePointer.x + 20 : this.scene.game.input.mousePointer.x - textWidth - xFix;
            let y = this.scene.game.input.mousePointer.y + 20;
            tooltip != null || typeof (tooltip) != 'undefined' ? tooltip.destroy() : tooltip;
            tooltip = this.scene.add.text(x + 20, y + 20, this.getTooltipText(object).toString(), Infobox.getTooltipFontStyle());
            rounded != null || typeof (rounded) != 'undefined' ? rounded.destroy() : rounded;
            rounded = this.scene.add.graphics();

            tooltip.depth = 100;
            rounded.depth = 99;

            let width = tooltip.displayWidth + 50
            let height = tooltip.displayHeight < 100 ? 100 : tooltip.displayHeight * 1.5;
            rounded.fillStyle("#0f0f0f", 1);
            //  32px radius on the corners
            rounded.fillRoundedRect(x, y, width, height, 32);

            rounded.alpha = 0.9;

            this.executeCallback(callbacks, 1);

            //  Using an object to define a different radius per corner
            // rounded.fillRoundedRect(360, 240, 400, 300, { tl: 12, tr: 12, bl: 12, br: 0 });

            // tooltip.style.setBackgroundColor("#000000");
        })
        object.on('pointerup', () => {
            this.executeCallback(callbacks, 0);
        })
        object.on('pointerout', () =>
        {
            tooltip != null ? tooltip.destroy() : null;
            rounded.destroy();
            this.executeCallback(callbacks, 2);
        })
    }

    private executeCallback(callbacks: Function[], number: number)
    {
        if (typeof(callbacks) != 'undefined' && callbacks != null)
            if (typeof(callbacks[number]) != 'undefined' && callbacks[number] != null)
                callbacks[number]();

    }



    private calculateTextWidth(info: String)
    {
        let tempTextObject = this.scene.add.text(-1000, -1000, info, Infobox.getTooltipFontStyle());
        let textWidth = tempTextObject.width;
        tempTextObject.destroy();
        return textWidth;
    }

    public getTooltipText(object: any)
    {
        return this.tooltipStrings.get(object);
    }

    static weaponTypeToString(type: WeaponType)
    {
        switch (type) {
            case WeaponType.LASER_ARMOR: return "laser";
            case WeaponType.PROJECTILE_SHIELD: return "projectile";
            case WeaponType.ROCKET: return "rocket";
            case WeaponType.NONE: return "none"; // wrong model is intended!
        }
    }

    static weaponTypeAbbreviation(type: WeaponType)
    {
        switch (type) {
            case WeaponType.LASER_ARMOR: return "a";
            case WeaponType.PROJECTILE_SHIELD: return "s";
            case WeaponType.ROCKET: return "r";
            case WeaponType.NONE: return "none"; // wrong model is intended!
        }
    }


    static weaponTypeTargetsToString(type: WeaponType)
    {
        switch (type) {
            case WeaponType.LASER_ARMOR: return "armor, rocket";
            case WeaponType.PROJECTILE_SHIELD: return "shield, rocket";
            case WeaponType.ROCKET: return "armor, shield";
            case WeaponType.NONE: return "none"; // wrong model is intended!
        }
    }

    static weaponTypeTargetsPiTerm(type: WeaponType, player : Player)
    {
        let targetPlayer = player.getNameIdentifier().indexOf("1") >= 0 ? "p2" : "p1";
        switch (type) {
            case WeaponType.LASER_ARMOR: return "a" + targetPlayer + "(), r" + targetPlayer + "()";
            case WeaponType.PROJECTILE_SHIELD: return "s" + targetPlayer + "(), r" + targetPlayer + "()";
            case WeaponType.ROCKET: return "a" + targetPlayer + "(), s" + targetPlayer + "()";
            case WeaponType.NONE: return "none"; // wrong model is intended!
        }
    }

    private static getTooltipFontStyle()
    {
        return {
            fill: '#fff', fontSize: 20, strokeThickness: 3, stroke: '#000'
        }
    }

    static getOppositeTerm(string: String, playerName : String)
    {
        switch (string[0])
        {
            case "l":
                return  string[1] == "o" ? "lock<>" : "l"+ playerName.toLowerCase() + "<>";
            case "a":
                return  "s" + playerName.toLowerCase() + "<>, r" + playerName.toLowerCase() + "<>";
            case "s":
                return  "s"+ playerName.toLowerCase() + "<>, r" + playerName.toLowerCase() + "<>";
            case "r":
                return  "s"+ playerName.toLowerCase() + "<>, a" + playerName.toLowerCase() + "<>";

        }

    }
}