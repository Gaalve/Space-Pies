import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";
import {Infobox} from "../Infobox";
import Sprite = Phaser.GameObjects.Sprite;
import {Weapon} from "../weapon";
import {Player} from "../player";
import {Motor} from "../motor";


export class BlueShip extends BaseShip{

    back: ShipPart;
    pilot: ShipPart;
    wingUp: ShipPart;
    wingDown: ShipPart;
    hull: ShipPart;
    x : number;
    y : number;
    durationX : number;
    durationY : number;
    sinX : number;
    sinY : number;
    private weapons: Weapon[];
    private weaponSinX: number;
    private weaponSinY: number;
    public motorL1: Sprite;
    public motorL2: Sprite;
    private motorP1: Sprite;
    private motorP2: Sprite;
    private motorR1: Sprite;
    private motorR2: Sprite;

    private onScreenText: Phaser.GameObjects.Text;

    public constructor(scene: Phaser.Scene,x: number, y: number, player: Player){
        super(scene, x, y);


        this.back = new ShipPart(scene, x, y, "ssbr/ssb_back", "ssbr/ssb_des_back",
            79, 0, 36, 6,1);

        this.pilot = new ShipPart(scene, x, y, "ssbr/ssb_pilot", "ssbr/ssb_des_pilot",
            -149, 0, -121, 8,1);

        this.wingUp = new ShipPart(scene, x, y, "ssbr/ssb_wing_up", "ssbr/ssb_des_wing_up",
            -19, -112, -20, -92,1);

        this.wingDown = new ShipPart(scene, x, y, "ssbr/ssb_wing_down", "ssbr/ssb_des_wing_down",
            -19, 112, -40, 104,1);

        this.hull = new ShipPart(scene, x, y, "ssbr/ssb_hull", "ssbr/ssb_des_hull",
            -46, 0, -37, 13,2);

        this.motorL1 = scene.add.sprite (0,0, "fire_light");
        this.motorL2 = scene.add.sprite (0,0, "fire_light");
        this.motorP1 = scene.add.sprite (0,0, "fire_light");
        this.motorP2 = scene.add.sprite (0,0, "fire_light");
        this.motorR1 = scene.add.sprite (0,0, "fire_light");
        this.motorR2 = scene.add.sprite (0,0, "fire_light");

        let infobox = <Infobox> scene.data.get("infoboxx");
        infobox.addTooltipInfo(this.back.normal, "[P2] The back of your Ship.");
        infobox.addTooltipInfo(this.pilot.normal, "[P2] This is Olga!\n" +
            "Bio:\n" +
            "     + baked a cake...\n" +
            "     + ...the best cake in the universe...\n" +
            "     + ...it's way too good... almost god like...\n" +
            "     + ...one can not simply describe the taste of it in words.\n" +
            "     + Olga's cake was stolen and Olga wants it back, at all costs!");
        infobox.addTooltipInfo(this.wingUp.normal, "[P2] Your right wing.");
        infobox.addTooltipInfo(this.wingDown.normal, "[P2] The left wing of your Ship.");
        infobox.addTooltipInfo(this.hull.normal, "[P2] The hull of your ship.");

        this.x =  x;
        this.y = y;
        this.durationX = 1250;
        this.durationY = 750;
        this.sinX = 0;
        this.sinY = 0;
        this.weaponSinX = 0;
        this.weaponSinY = 0;
        this.weapons = this.weapons = player.getDrones()[0].getWeapons();
        this.setAllPartPosition();
    }


    toDestroyedShip(): void {
        this.back.toDestroyedPart();
        this.pilot.toDestroyedPart();
        this.wingDown.toDestroyedPart();
        this.wingUp.toDestroyedPart();
        this.hull.toDestroyedPart();
    }


    setAllPartPosition(): void {
        let posX = (this.posX + Math.sin(this.sinX) * 15);
        // noinspection JSSuspiciousNameCombination
        let posY = (this.posY + Math.cos(this.sinY) * 15);

        this.back.setPosition(posX, posY);
        this.pilot.setPosition(posX, posY);
        this.wingUp.setPosition(posX, posY);
        this.wingDown.setPosition(posX, posY);
        this.hull.setPosition(posX, posY);
        this.motorL1.setPosition(this.hull.normal.x + 225, this.hull.normal.y - 18).setScale(0.8,0.8).setTint(0x00BFFF);
        this.motorL2.setPosition(this.hull.normal.x + 225, this.hull.normal.y + 18).setScale(0.8,0.8).setTint(0x00BFFF);
        this.motorP1.setPosition(this.hull.normal.x + 160, this.hull.normal.y - 70).setScale(0.8,0.8).setTint(0xCD00CD);
        this.motorP2.setPosition(this.hull.normal.x + 160, this.hull.normal.y + 70).setScale(0.8,0.8).setTint(0xCD00CD);
        this.motorR1.setPosition(this.hull.normal.x + 145, this.hull.normal.y - 115).setScale(0.8,0.8).setTint(0xFF0000);
        this.motorR2.setPosition(this.hull.normal.x + 145, this.hull.normal.y + 115).setScale(0.8,0.8).setTint(0xFF0000);

        if(this.weapons[0]) this.weapons[0].setPosition(this.hull.normal.x - 75, this.hull.normal.y);
        if(this.weapons[1]) this.weapons[1].setPosition(this.hull.normal.x, this.hull.normal.y - 110);
        if(this.weapons[2]) this.weapons[2].setPosition((this.hull.normal.x), this.hull.normal.y + 110);

        this.onScreenText ? this.onScreenText.setPosition(posX + 165, posY + this.onScreenText.width/2) : null;
    }

 //   motorIncreaseSize(){
 //      this.system.pushSymbol(
  //        this.system.add.channelInCB('increasesizelaser12', '', () => this.motorL1.setScale(1.0,1.0)).
 //         channelInCB('increasesizelaser13', '',() => this.motorL1.setScale(1.2, 1.2)).nullProcess()
  //     );
 //   };
    toDestroyedBack(): void {
        this.back.toDestroyedPart();
    }

    toDestroyedHull(): void {
        this.hull.toDestroyedPart();
    }

    toDestroyedPilot(): void {
        this.pilot.toDestroyedPart();
    }

    toDestroyedWingDown(): void {
        this.wingDown.toDestroyedPart();
    }

    toDestroyedWingUp(): void {
        this.wingUp.toDestroyedPart();
    }

    public addWeapon(weapon: Weapon)
    {
        this.weapons.push(weapon);
    }

    update(delta: number, weapon?: Weapon): void {
        this.back.update(delta);
        this.pilot.update(delta);
        this.hull.update(delta);
        this.wingUp.update(delta);
        this.wingDown.update(delta);

        this.sinX += delta/ this.durationX;
        this.sinY += delta/ this.durationY;

        this.sinX %= 2*Math.PI;
        this.sinY %= 2*Math.PI;

        this.motorAnimated();

        this.setAllPartPosition();
    }

    setOnScreenText(text){
        this.onScreenText = text;
    }
    motorAnimated(){


    };

     setMotorL11  (){
        this.motorL1.setScale(1.0,1.0);
    }
    setMotorL12(){
        this.motorL1.setScale(1.2, 1.2);
    }
    getMotorL2(){
        return this.motorL2;
    }

}