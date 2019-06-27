import {BaseShip} from "./base-ship";
import {ShipPart} from "./ship-part";
import {Infobox} from "../Infobox";
import Sprite = Phaser.GameObjects.Sprite;
import {Weapon} from "../weapon";
import {Player} from "../player";
import {Motor} from "../motor";
import {PiSystem} from "../picalc/pi-system";
import {MotorFlame} from "./motor-flame";


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
    public ship_out: Sprite;
    offset: number;

    public motorRocket1: MotorFlame;
    public motorRocket2: MotorFlame;
    public motorRsize1: number;
    public motorRsize2: number;

    public motorLaser1: MotorFlame;
    public motorLaser2: MotorFlame;
    public motorLsize1: number;
    public motorLsize2: number;

    public motorProj1: MotorFlame;
    public motorProj2: MotorFlame;
    public motorPsize1: number;
    public motorPsize2: number;


    private player: Player;
    private system: PiSystem;

    private onScreenText: Phaser.GameObjects.Text;

    public constructor(scene: Phaser.Scene,x: number, y: number, player: Player){
        super(scene, x, y);
        this.player = player;
        this.system = this.player.getSystem();

        this.motorRsize1 = 1.0;
        this.motorRsize2 = 1.0;

        this.motorLsize1 = 1.0;
        this.motorLsize2 = 1.0;

        this.motorPsize1 = 1.0;
        this.motorPsize2 = 1.0;

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

        this.ship_out = scene.add.sprite(x-30,y,"ssb_ship").setScale(1.1,1.1).setTintFill(0xa4444ff);
        this.ship_out.setVisible(false);
        this.offset = -30;

        let infobox = <Infobox> scene.data.get("infoboxx");
        infobox.addTooltipInfo(this.back.normal, "[P2] The back of your Ship.");
        infobox.addTooltipInfo(this.pilot.normal, "[P2] This is Olga!\n" +
            "Bio:\n" +
            "     + baked a cake...\n" +
            "     + ...the best cake in the universe...\n" +
            "     + ...it's way too good... almost god like...\n" +
            "     + ...one can not simply describe the taste of it in words.\n" +
            "     + Olga's cake was stolen and Olga wants it back, at all cost!");
        infobox.addTooltipInfo(this.wingUp.normal, "[P2] Your right wing. Should've upgraded your ship instead of baking cake all day.");
        infobox.addTooltipInfo(this.wingDown.normal, "[P2] The left wing of your Ship. Aren't you a bit jealous of Olaf's ship?");
        infobox.addTooltipInfo(this.hull.normal, "[P2] The hull of your ship. An upgrade is urgently needed.");

        this.motorRocket1 = new MotorFlame(scene);
        this.motorRocket1.tintRed();

        this.motorRocket2 = new MotorFlame(scene);
        this.motorRocket2.tintRed();

        this.motorLaser1 = new MotorFlame(scene);
        this.motorLaser1.tintBlue();

        this.motorLaser2 = new MotorFlame(scene);
        this.motorLaser2.tintBlue();

        this.motorProj1 = new MotorFlame(scene);
        this.motorProj1.tintPurple();

        this.motorProj2 = new MotorFlame(scene);
        this.motorProj2.tintPurple();


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


        this.motorRocket1.setPosition(this.hull.normal.x + 119, this.hull.normal.y + 116);
        this.motorRocket1.setScaleSin(this.motorRsize1, this.sinX*6);

        this.motorRocket2.setPosition(this.hull.normal.x + 119, this.hull.normal.y - 116);
        this.motorRocket2.setScaleSin(this.motorRsize2, this.sinY*4);

        this.motorLaser1.setPosition(this.hull.normal.x + 198, this.hull.normal.y + 18);
        this.motorLaser1.setScaleSin(this.motorLsize1, this.sinX*7);

        this.motorLaser2.setPosition(this.hull.normal.x + 198, this.hull.normal.y - 18);
        this.motorLaser2.setScaleSin(this.motorLsize2, this.sinY*3);

        this.motorProj1.setPosition(this.hull.normal.x + 134, this.hull.normal.y + 70);
        this.motorProj1.setScaleSin(this.motorPsize1, this.sinX*5);

        this.motorProj2.setPosition(this.hull.normal.x + 134, this.hull.normal.y - 70);
        this.motorProj2.setScaleSin(this.motorPsize2, this.sinY*3.5);

        if(this.weapons[0]) this.weapons[0].setPosition(this.hull.normal.x - 75, this.hull.normal.y);
        if(this.weapons[1]) this.weapons[1].setPosition(this.hull.normal.x, this.hull.normal.y - 110);
        if(this.weapons[2]) this.weapons[2].setPosition((this.hull.normal.x), this.hull.normal.y + 110);
        this.ship_out.setPosition(this.hull.normal.x + this.offset, this.hull.normal.y);
        this.onScreenText ? this.onScreenText.setPosition(posX + 165, posY + this.onScreenText.width/2) : null;
    }

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

    setShipOutVisible(bool: boolean): void{
        this.ship_out.setVisible(bool);
    }

}