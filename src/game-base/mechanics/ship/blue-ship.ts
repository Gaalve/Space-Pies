import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";
import {Infobox} from "../Infobox";
import Sprite = Phaser.GameObjects.Sprite;
import {Weapon} from "../weapon";
import {Player} from "../player";
import {Motor} from "../motor";
import {PiSystem} from "../picalc/pi-system";


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
    public motorL11: Sprite; //motor<type><upper/lower><inner/outer>
    public motorL12: Sprite;
    public motorL13: Sprite;
    public motorL14: Sprite;
    public motorL15: Sprite;
    public motorL16: Sprite;

    public motorL21: Sprite;
    public motorL22: Sprite;
    public motorL23: Sprite;
    public motorL24: Sprite;
    public motorL25: Sprite;
    public motorL26: Sprite;

    public motorP11: Sprite;
    private motorP12: Sprite;
    private motorP13: Sprite;
    private motorP14: Sprite;
    private motorP15: Sprite;
    private motorP16: Sprite;

    private motorP21: Sprite;
    private motorP22: Sprite;
    private motorP23: Sprite;
    private motorP24: Sprite;
    private motorP25: Sprite;
    private motorP26: Sprite;

    private motorR11: Sprite;
    private motorR12: Sprite;
    private motorR13: Sprite;
    private motorR14: Sprite;
    private motorR15: Sprite;
    private motorR16: Sprite;

    public motorR21: Sprite;
    public motorR22: Sprite;
    public motorR23: Sprite;
    public motorR24: Sprite;
    public motorR25: Sprite;
    public motorR26: Sprite;

    private player: Player;
    private system: PiSystem;

    private onScreenText: Phaser.GameObjects.Text;

    public constructor(scene: Phaser.Scene,x: number, y: number, player: Player){
        super(scene, x, y);
        this.player = player;
        this.system = this.player.getSystem();

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

        this.motorL16 = scene.add.sprite (0,0, "fire_light").setScale(0.8,0.8).setTint(0xff2a2a);
        this.motorL15 = scene.add.sprite (0,0, "fire_light").setScale(0.7,0.7).setTint(0xaa0000);
        this.motorL14 = scene.add.sprite (0,0, "fire_light").setScale(0.65,0.65).setTint(0xff9955);
        this.motorL13 = scene.add.sprite (0,0, "fire_light").setScale(0.6,0.6).setTint(0xff6600);
        this.motorL12 = scene.add.sprite (0,0, "fire_light").setScale(0.5,0.5).setTint(0xffdd55);
        this.motorL11 = scene.add.sprite (0,0, "fire_light").setScale(0.4,0.4).setTint(0xffcc00);

        this.motorL26 = scene.add.sprite (0,0, "fire_light").setScale(0.8,0.8).setTint(0x00BFFF);
        this.motorL25 = scene.add.sprite (0,0, "fire_light").setScale(0.7,0.7).setTint(0xaa0000);
        this.motorL24 = scene.add.sprite (0,0, "fire_light").setScale(0.65,0.65).setTint(0xff9955);
        this.motorL23 = scene.add.sprite (0,0, "fire_light").setScale(0.6,0.6).setTint(0xff6600);
        this.motorL22 = scene.add.sprite (0,0, "fire_light").setScale(0.5,0.5).setTint(0xffdd55);
        this.motorL21 = scene.add.sprite (0,0, "fire_light").setScale(0.4,0.4).setTint(0xffcc00);

        this.motorP16 = scene.add.sprite (0,0, "fire_light").setScale(0.8,0.8).setTint(0xCD00CD);
        this.motorP15 = scene.add.sprite (0,0, "fire_light").setScale(0.7,0.7).setTint(0xaa0000);
        this.motorP14 = scene.add.sprite (0,0, "fire_light").setScale(0.65,0.65).setTint(0xff9955);
        this.motorP13 = scene.add.sprite (0,0, "fire_light").setScale(0.6,0.6).setTint(0xff6600);
        this.motorP12 = scene.add.sprite (0,0, "fire_light").setScale(0.5,0.5).setTint(0xffdd55);
        this.motorP11 = scene.add.sprite (0,0, "fire_light").setScale(0.4,0.4).setTint(0xffcc00);

        this.motorP26 = scene.add.sprite (0,0, "fire_light").setScale(0.8,0.8).setTint(0xCD00CD);
        this.motorP25 = scene.add.sprite (0,0, "fire_light").setScale(0.7,0.7).setTint(0xaa0000);
        this.motorP24 = scene.add.sprite (0,0, "fire_light").setScale(0.65,0.65).setTint(0xff9955);
        this.motorP23 = scene.add.sprite (0,0, "fire_light").setScale(0.6,0.6).setTint(0xff6600);
        this.motorP22 = scene.add.sprite (0,0, "fire_light").setScale(0.5,0.5).setTint(0xffdd55);
        this.motorP21 = scene.add.sprite (0,0, "fire_light").setScale(0.4,0.4).setTint(0xffcc00);

        this.motorR16 = scene.add.sprite (0,0, "fire_light").setScale(0.8,0.8).setTint(0xff2a2a);
        this.motorR16 = scene.add.sprite (0,0, "fire_light").setScale(0.7,0.7).setTint(0xaa0000);
        this.motorR14 = scene.add.sprite (0,0, "fire_light").setScale(0.65,0.65).setTint(0xff9955);
        this.motorR13 = scene.add.sprite (0,0, "fire_light").setScale(0.6,0.6).setTint(0xff6600);
        this.motorR12 = scene.add.sprite (0,0, "fire_light").setScale(0.5,0.5).setTint(0xffdd55);
        this.motorR11 = scene.add.sprite (0,0, "fire_light").setScale(0.4,0.4).setTint(0xffcc00);

        this.motorR26 = scene.add.sprite (0,0, "fire_light").setScale(0.8,0.8).setTint(0xff2a2a);
        this.motorR25 = scene.add.sprite (0,0, "fire_light").setScale(0.7,0.7).setTint(0xaa0000);
        this.motorR24 = scene.add.sprite (0,0, "fire_light").setScale(0.65,0.65).setTint(0xff9955);
        this.motorR23 = scene.add.sprite (0,0, "fire_light").setScale(0.6,0.6).setTint(0xff6600);
        this.motorR22 = scene.add.sprite (0,0, "fire_light").setScale(0.5,0.5).setTint(0xffdd55);
        this.motorR21 = scene.add.sprite (0,0, "fire_light").setScale(0.4,0.4).setTint(0xffcc00);

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
        this.motorIncreaseSize();
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

        this.motorR21.setPosition(this.hull.normal.x + 250, this.hull.normal.y + 218);
        this.motorR22.setPosition(this.hull.normal.x + 145, this.hull.normal.y + 118);
        this.motorR23.setPosition(this.hull.normal.x + 145, this.hull.normal.y + 118);
        this.motorR24.setPosition(this.hull.normal.x + 145, this.hull.normal.y + 118);
        this.motorR25.setPosition(this.hull.normal.x + 145, this.hull.normal.y + 118);
        this.motorR26.setPosition(this.hull.normal.x + 145, this.hull.normal.y + 118);

        this.motorL11.setPosition(this.hull.normal.x + 213, this.hull.normal.y - 18);
        this.motorL12.setPosition(this.hull.normal.x + 217, this.hull.normal.y - 18);
        this.motorL13.setPosition(this.hull.normal.x + 222, this.hull.normal.y - 18);
        this.motorL14.setPosition(this.hull.normal.x + 223, this.hull.normal.y - 18);
        this.motorL15.setPosition(this.hull.normal.x + 224, this.hull.normal.y - 18);
        this.motorL16.setPosition(this.hull.normal.x + 225, this.hull.normal.y - 18);

        this.motorL21.setPosition(this.hull.normal.x + 213, this.hull.normal.y + 18);
        this.motorL22.setPosition(this.hull.normal.x + 217, this.hull.normal.y + 18);
        this.motorL23.setPosition(this.hull.normal.x + 222, this.hull.normal.y + 18);
        this.motorL24.setPosition(this.hull.normal.x + 223, this.hull.normal.y + 18);
        this.motorL25.setPosition(this.hull.normal.x + 224, this.hull.normal.y + 18);
        this.motorL26.setPosition(this.hull.normal.x + 225, this.hull.normal.y + 18);

        this.motorP11.setPosition(this.hull.normal.x + 160, this.hull.normal.y - 70);
        this.motorP12.setPosition(this.hull.normal.x + 160, this.hull.normal.y - 70);
        this.motorP13.setPosition(this.hull.normal.x + 160, this.hull.normal.y - 70);
        this.motorP14.setPosition(this.hull.normal.x + 160, this.hull.normal.y - 70);
        this.motorP15.setPosition(this.hull.normal.x + 160, this.hull.normal.y - 70);
        this.motorP16.setPosition(this.hull.normal.x + 160, this.hull.normal.y - 70);

        this.motorP21.setPosition(this.hull.normal.x + 160, this.hull.normal.y + 73);
        this.motorP22.setPosition(this.hull.normal.x + 160, this.hull.normal.y + 73);
        this.motorP23.setPosition(this.hull.normal.x + 160, this.hull.normal.y + 73);
        this.motorP24.setPosition(this.hull.normal.x + 160, this.hull.normal.y + 73);
        this.motorP25.setPosition(this.hull.normal.x + 160, this.hull.normal.y + 73);
        this.motorP26.setPosition(this.hull.normal.x + 160, this.hull.normal.y + 73);

        this.motorR11.setPosition(this.hull.normal.x + 145, this.hull.normal.y - 115);
        this.motorR12.setPosition(this.hull.normal.x + 145, this.hull.normal.y - 115);
        this.motorR13.setPosition(this.hull.normal.x + 145, this.hull.normal.y - 115);
        this.motorR14.setPosition(this.hull.normal.x + 145, this.hull.normal.y - 115);
        this.motorR15.setPosition(this.hull.normal.x + 145, this.hull.normal.y - 115);
        this.motorR16.setPosition(this.hull.normal.x + 145, this.hull.normal.y - 115);

        if(this.weapons[0]) this.weapons[0].setPosition(this.hull.normal.x - 75, this.hull.normal.y);
        if(this.weapons[1]) this.weapons[1].setPosition(this.hull.normal.x, this.hull.normal.y - 110);
        if(this.weapons[2]) this.weapons[2].setPosition((this.hull.normal.x), this.hull.normal.y + 110);

        this.onScreenText ? this.onScreenText.setPosition(posX + 165, posY + this.onScreenText.width/2) : null;
    }

    motorIncreaseSize(){
 /*      this.system.pushSymbol(
          this.system.add.channelInCB('increasesizelaser22', '', () =>  {this.motorL11.setScale(1.0, 1.0), this.motorL2.setScale(1.0, 1.0)}).
          channelInCB('increasesizelaser23', '',() => {this.motorL11.setScale(1.2, 1.2), this.motorL2.setScale(1.2, 1.2)}).nullProcess()
       );

        this.system.pushSymbol(
            this.system.add.channelInCB('increasesizeprojectile22', '', () =>  {this.motorP1.setScale(1.0, 1.0), this.motorP2.setScale(1.0, 1.0)}).
            channelInCB('increasesizeprojectile23', '',() => {this.motorP1.setScale(1.2, 1.2), this.motorP2.setScale(1.2, 1.2)}).nullProcess()
        );

        this.system.pushSymbol(
            this.system.add.channelInCB('increasesizerocket22', '', () =>  {this.motorR1.setScale(1.0, 1.0), this.motorR2.setScale(1.0, 1.0)}).
            channelInCB('increasesizerocket23', '',() => {this.motorR1.setScale(1.2, 1.2), this.motorR2.setScale(1.2, 1.2)}).nullProcess()
        ); */
    };
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

        this.setAllPartPosition();
    }

    setOnScreenText(text){
        this.onScreenText = text;
    }

}