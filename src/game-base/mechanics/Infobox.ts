import Scene = Phaser.Scene;
import {WeaponType} from "./weapon/weapon-type";
import {Player} from "./player";
import type = Mocha.utils.type;
import GameObject = Phaser.GameObjects.GameObject;
import Text = Phaser.GameObjects.Text;
import Graphics = Phaser.GameObjects.Graphics;

export class Infobox
{
    private tooltipStrings: Map<any, string>;
    private scene: Scene;
    private tooltip: Text;
    private box: Graphics;
    private tempStorage: Map<any, string>;
    constructor(scene: Scene)
    {
        this.tooltipStrings = new Map<any, string>();
        this.tempStorage = new Map<any, string>();
        this.scene = scene;
        this.box = this.scene.add.graphics();
        this.tooltip = this.scene.add.text(-100, -100, "No Description", Infobox.getTooltipFontStyle());

        this.box.fillStyle(0x0f0f0f, 0.9);
        this.box.setDepth(99);
        this.box.setDataEnabled();
        this.tooltip.setDepth(100);
    }

    public hideInfobox(object: GameObject, id?: string)
    {
            id ? this.tempStorage.set(id,this.tooltipStrings.get(id)) : this.tempStorage.set(object,this.tooltipStrings.get(object));
            id ? this.tooltipStrings.delete(id) : this.tooltipStrings.delete(object);
            this.tooltip.text = "";
    }

    public unhideInfobox(object: GameObject, id?: string)
    {
        id ? this.tooltipStrings.set(id,this.tempStorage.get(id)) : this.tooltipStrings.set(object,this.tempStorage.get(object));
        id ? this.tempStorage.delete(id) : this.tempStorage.delete(object);
    }

    public addTooltipInfo(object: GameObject, info: string , callbacks?: (()=>void)[], id?: String)
    {
        object.setInteractive();
        id ? this.tooltipStrings.set(id,info) : this.tooltipStrings.set(object, info);
        let textWidth = this.calculateTextWidth(info);

        let xFix = 50;
        object.on('pointermove', (pointer: Phaser.Input.Pointer) =>
        {
            if (!this.getTooltipText(object))
                return;
            let x = pointer.x < 1920/2 ? pointer.x + 20 : pointer.x - textWidth - xFix;
            let y = pointer.y + 20;
            this.tooltip.setPosition(x + 20, y + 20);

            this.box.x = x - this.box.getData('x');
            this.box.y = y - this.box.getData('y');
        });
        object.on('pointerover', (pointer: Phaser.Input.Pointer) =>
        {
            if (!this.getTooltipText(object))
                return;
            this.executeCallback(callbacks, 1);
            if (this.tooltip.text.toString() == this.getTooltipText(object).toString()) return;

            let x = pointer.x < 1920/2 ? pointer.x + 20 : pointer.x - textWidth - xFix;
            let y = pointer.y + 20;
            this.tooltip.setText(this.getTooltipText(object));
            this.tooltip.setPosition(x + 20, y + 20);


            let width = this.tooltip.displayWidth + 50;
            let height = this.tooltip.displayHeight + 40;
            this.box.clear();
            this.box.fillStyle(0x0f0f0f, 0.9);
            this.box.fillRoundedRect(x, y, width, height, 32);
            this.box.setData('y', y);
            this.box.setData('x', x);
        });
        object.on('pointerup', () => {
            this.executeCallback(callbacks, 0);
        });
        object.on('pointerout', () =>
        {
            this.tooltip.setPosition(2500, 2500);
            this.box.setPosition(2500, 2500);
            this.tooltip.text = "";

            this.executeCallback(callbacks, 2);
        })
    }

    private executeCallback(callbacks: (()=>void)[], number: number)
    {
        if (typeof(callbacks) != 'undefined' && callbacks != null)
            if (typeof(callbacks[number]) != 'undefined' && callbacks[number] != null)
                callbacks[number]();

    }


    public removeTooltipInfo(object: GameObject): void{
        this.tooltipStrings.delete(object);
    }


     private calculateTextWidth(info: string)
    {
        let tempTextObject = this.scene.add.text(-1000, -1000, info, Infobox.getTooltipFontStyle());
        let textWidth = tempTextObject.width;
        tempTextObject.destroy();
        return textWidth;
    }

    public getTooltipText(object: GameObject)
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
            case WeaponType.LASER_ARMOR: return "Armor Shield";
            case WeaponType.PROJECTILE_SHIELD: return "Laser Shield";
            case WeaponType.ROCKET: return "Armor Shield, Laser Shield, Rocket Shield";
            case WeaponType.NONE: return "none"; // wrong model is intended!
        }
    }

    static weaponTypeTargetsPiTerm(type: WeaponType, player : Player)
    {
        let targetPlayer = player.getNameIdentifier().indexOf("1") >= 0 ? "p2" : "p1";
        switch (type) {
            case WeaponType.LASER_ARMOR: return "a" + targetPlayer + "()";
            case WeaponType.PROJECTILE_SHIELD: return "s" + targetPlayer + "()";
            case WeaponType.ROCKET: return "a" + targetPlayer + "(), s" + targetPlayer + "(), r"+ targetPlayer + "()";
            case WeaponType.NONE: return "none"; // wrong model is intended!
        }
    }

    static weaponTypeTargetsPiTerm2(type: WeaponType, isP1: boolean)
    {
        let targetPlayer = !isP1 ? "p2" : "p1";
        switch (type) {
            case WeaponType.LASER_ARMOR: return "a" + targetPlayer + "()";
            case WeaponType.PROJECTILE_SHIELD: return "s" + targetPlayer + "()";
            case WeaponType.ROCKET: return "a" + targetPlayer + "(), s" + targetPlayer + "(), r"+ targetPlayer + "()";
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
                return  "a" + playerName.toLowerCase() + "<>, r" + playerName.toLowerCase() + "<>";
            case "s":
                return  "s"+ playerName.toLowerCase() + "<>, r" + playerName.toLowerCase() + "<>";
            case "n":
                return  "a" + playerName.toLowerCase() +"<> s"+ playerName.toLowerCase() + "<>, r" + playerName.toLowerCase() + "<>";
            case "x":
                return  "a" + playerName.toLowerCase() +"<> s"+ playerName.toLowerCase() + "<>, r" + playerName.toLowerCase() + "<>";
            case "r":
                return  "r"+ playerName.toLowerCase() + "<>";

        }

    }
}