import {PiSystem} from "../mechanics/picalc/pi-system";
import {MainScene} from "./main-scene";
import {Animation} from "../mechanics/animation/Animation";
import {AnimationUtilities} from "../mechanics/animation/AnimationUtilites";
import {WeaponType} from "../mechanics/weapon/weapon-type";
import {HealthType} from "../mechanics/health/health-type";


export class ScenePiAnimation extends Phaser.Scene {

    private system: PiSystem;
    private sequentialAnimations: Array<Animation>;
    private queuedAnimations: Array<Animation>;
    private finishedAnimations: Array<Animation>;
    private _finalCallback: Function;
    private finalAnimations: Array<Animation>;
    private parallelAnimations: Array<Array<Animation>>;

    public weapon1Unlocked: Boolean = false;
    public weapon2Unlocked: Boolean = false;
    public weapon3Unlocked: Boolean = false;
    public weapon1Missed: boolean = false;
    public weapon2Missed: boolean = false;
    public weapon3Missed: boolean = false;

    private unlocked: Boolean = false;
    public ready : Boolean = false;
    public hitzoneUnlocked: Boolean = false;
    public nullProcessesUnlocked : Boolean = false;
    public allWeaponsUnlocked: boolean = false;
    public allWeaponsFired: boolean = false;
    private waitingBatch: Array<Animation>;


    constructor() {
        super({
            key: 'AnimationScene',
            active: true
        });
        this.sequentialAnimations = new Array<Animation>();
        this.finishedAnimations = new Array<Animation>();
        this.finalAnimations = new Array<Animation>();
        this.queuedAnimations = new Array<Animation>();
        this.waitingBatch = new Array<Animation>();
        this.parallelAnimations = new Array<Array<Animation>>();
        this.parallelAnimations[0] = new Array<Animation>();
        this.parallelAnimations[1] = new Array<Animation>();
        this.parallelAnimations[2] = new Array<Animation>();
        this.parallelAnimations[3] = new Array<Animation>();
    }

    preload(): void {
        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        )
    }

    create(): void {
        this.system = this.scene.get('MainScene').data.get("system");
        console.log("ScenePiAnimation ACTIVE!");
    }

    update(time: number, delta: number): void {
        // if (this.sequentialAnimations.length > 0) {
        //     for (let i = 0; i < 1; i++) {
        //
        //         let animation = <Animation>this.sequentialAnimations[i];
        //         if (typeof animation == 'undefined')
        //             continue;
        //         animation.currentTime += delta;
        //         this.animate(animation);
        //     }
        // } else {
        //     if (this.queuedAnimations.length % 2 == 0)
        //         this.sequentialAnimations = this.getAnimationsFromQueue(2);
        // }
        let runningAnimations = this.parallelAnimations[0].length > 0 || this.parallelAnimations[1].length > 0 || this.parallelAnimations[2].length > 0 || this.parallelAnimations[3].length > 0;
        if (this.finishedAnimations.length == 0 && !runningAnimations)
        {
            for (let animation of this.waitingBatch)
                this.addConcurrentAnimation(animation, true, false);
        }
        if (this.finishedAnimations.length > 0) {
            if (this.finishedAnimations.length > 2)
                this.ready = true;
            for (let i = 0; i < this.finishedAnimations.length; i++) {
                let anim = this.finishedAnimations[i];

                if (anim.locked)
                    continue;

                if (anim.stage == 0) {
                    if (anim.id.indexOf("(lock)") >= 0) {
                        let staticLockAnim = this.findAnimationById("<lock>");
                        if (staticLockAnim == null)
                            continue;

                        // anim.locked = true;

                        let newAnim = Animation.clone(anim);

                        let uID = "drone_unlock";
                        let toX = 1920 / 2;
                        let toY = 1080 / 2;


                        let counterAnimText = this.add.text(staticLockAnim.text.x, staticLockAnim.text.y, "lock<*>", staticLockAnim.text.style);
                        let counterAnim = new Animation(uID, this, staticLockAnim.text.x, staticLockAnim.text.y, toX - counterAnimText.width, toY, counterAnimText, 500);
                        counterAnim.stage = 1;
                        counterAnim.move = true;
                        counterAnim.scaleFont = false;
                        counterAnim.interpolate = true;
                        counterAnim.toColor = AnimationUtilities.getReplicationColor();

                        newAnim.id = uID;
                        newAnim.stage = 1;
                        newAnim.move = true;
                        newAnim.scaleFont = false;
                        newAnim.interpolate = true;
                        newAnim.toColor = AnimationUtilities.getReplicationColor();
                        newAnim.toX = toX;
                        newAnim.toY = toY;
                        newAnim.duration = counterAnim.duration;

                        this.addConcurrentAnimation(newAnim, false, false);
                        this.addConcurrentAnimation(counterAnim, false, false);

                        this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                        i = 0;
                    } else if (this.unlocked && this.ready)
                    {
                        if (anim.id.indexOf("(life)") >= 0)
                        {
                            let counterAnim = this.findAnimationByType("weapon", anim.text.text.substr(0, 2));
                            if (counterAnim != null )
                            {
                                if (!this.checkConditionsForSequentialAnimation(counterAnim.weaponNumber)) continue;

                                let newAnim = Animation.clone(anim);
                                let newCounterAnim = Animation.clone(counterAnim);

                                let uID = this.generateGUID();
                                if (counterAnim.weaponNumber != null)
                                    uID = uID + ",weapon" + counterAnim.weaponNumber

                                let toX = 1920 / 2;
                                let toY = 1080 / 2;

                                newAnim.id = uID;
                                newAnim.duration = 500;
                                newAnim.toX = toX - newAnim.text.width;
                                newAnim.toY = toY;
                                newAnim.stage = 1;
                                newAnim.move = true;
                                newAnim.interpolate = true;
                                newAnim.scaleFont = false;
                                newAnim.toColor = AnimationUtilities.getHealthbarColor(AnimationUtilities.stringToHealthtype(newAnim.text.text.substr(0,2)))

                                newCounterAnim.id = uID;
                                newCounterAnim.duration = 500;
                                newCounterAnim.toX = toX;
                                newCounterAnim.toY = toY;
                                newCounterAnim.stage = 1;
                                newCounterAnim.move = true;
                                newCounterAnim.scaleFont = false;
                                newCounterAnim.interpolate = true;
                                newCounterAnim.toColor = newAnim.toColor;

                                this.addConcurrentAnimation(newAnim, false, true);
                                this.addConcurrentAnimation(newCounterAnim, false, true);

                                this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                                this.finishedAnimations.splice(this.finishedAnimations.indexOf(counterAnim), 1);

                                i = 0;
                            }
                        }
                        else if (anim.id.indexOf("(hitzone)") >= 0)
                        {
                            let counterAnim = this.findAnimationById("<hitzone>");
                            if (counterAnim != null && counterAnim.text.text.substr(0, 3) == anim.text.text.substr(0, 3))
                            {
                                if (!this.hitzoneUnlocked)
                                    continue;

                                let newAnim = Animation.clone(anim);
                                let newCounterAnim = Animation.clone(counterAnim);

                                let uID = this.generateGUID() + ",hitzone";
                                let toX = 1920 / 2;
                                let toY = 1080 / 2;

                                newAnim.id = uID;
                                newAnim.duration = 500;
                                newAnim.toX = toX - newAnim.text.width;
                                newAnim.toY = toY;
                                newAnim.stage = 1;
                                newAnim.move = true;
                                newAnim.scaleFont = false;
                                newAnim.interpolate = true;
                                newAnim.toColor = AnimationUtilities.getHealthbarColor(HealthType.HitZoneBar);

                                newCounterAnim.id = uID;
                                newCounterAnim.duration = 500;
                                newCounterAnim.toX = toX;
                                newCounterAnim.toY = toY;
                                newCounterAnim.stage = 1;
                                newCounterAnim.move = true;
                                newCounterAnim.scaleFont = false;
                                newCounterAnim.interpolate = true;
                                newCounterAnim.toColor = newAnim.toColor;

                                this.addConcurrentAnimation(newAnim, false, true);
                                this.addConcurrentAnimation(newCounterAnim, false, true);

                                this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                                this.finishedAnimations.splice(this.finishedAnimations.indexOf(counterAnim), 1);

                                i = 0;
                            }
                        }
                        else if (anim.id.indexOf("0") >= 0)
                        {
                           if (!this.checkConditionsForSequentialAnimation(5)) continue;
                            let newAnim = Animation.clone(anim);

                            let uID = this.generateGUID();
                            let toX = anim.text.x;
                            let toY = anim.text.y - 500;

                            newAnim.id = uID;
                            newAnim.duration = 1000;
                            newAnim.toX = toX;
                            newAnim.toY = toY;
                            newAnim.stage = 2;
                            newAnim.move = true;
                            newAnim.vanish = true;
                            newAnim.scaleFont = false;
                            newAnim.interpolate = true;
                            newAnim.toColor = "#FFFFFF";

                            this.addConcurrentAnimation(newAnim, false, false);

                            this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                            i = 0;
                        }
                        else if (anim.id == "weapon")
                        {
                            if (anim.weaponNumber == 1 && this.findAnimationByType("(life)", anim.text.text.substr(0,2)) == null)
                                if (this.weapon1Missed)
                                {
                                    let newAnim = Animation.clone(anim);

                                    let uID = this.generateGUID();
                                    let toX = anim.text.x;
                                    let toY = anim.text.y;

                                    newAnim.id = uID;
                                    newAnim.duration = 400;
                                    newAnim.toX = toX;
                                    newAnim.toY = toY;
                                    newAnim.stage = 2;
                                    newAnim.move = true;
                                    newAnim.vanish = true;
                                    newAnim.scaleFont = false;
                                    newAnim.interpolate = true;
                                    newAnim.toColor = "#000000";

                                    this.addConcurrentAnimation(newAnim, false, false);

                                    this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                                    i = 0;
                                }
                            if (anim.weaponNumber == 2)
                                if (this.weapon2Unlocked && this.findAnimationByType("(life)", anim.text.text.substr(0,2)) == null)
                                {
                                    let newAnim = Animation.clone(anim);

                                    let uID = this.generateGUID();
                                    let toX = anim.text.x;
                                    let toY = anim.text.y;

                                    newAnim.id = uID;
                                    newAnim.duration = 400;
                                    newAnim.toX = toX;
                                    newAnim.toY = toY;
                                    newAnim.stage = 2;
                                    newAnim.move = true;
                                    newAnim.vanish = true;
                                    newAnim.scaleFont = false;
                                    newAnim.interpolate = true;
                                    newAnim.toColor = "#000000";

                                    this.addConcurrentAnimation(newAnim, false, false);

                                    this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                                    i = 0;
                                }
                            if (anim.weaponNumber == 3 && this.findAnimationByType("(life)", anim.text.text.substr(0,2)) == null)
                                if (this.weapon3Unlocked)
                                {
                                    let newAnim = Animation.clone(anim);

                                    let uID = this.generateGUID();
                                    let toX = anim.text.x;
                                    let toY = anim.text.y;

                                    newAnim.id = uID;
                                    newAnim.duration = 400;
                                    newAnim.toX = toX;
                                    newAnim.toY = toY;
                                    newAnim.stage = 2;
                                    newAnim.move = true;
                                    newAnim.vanish = true;
                                    newAnim.scaleFont = false;
                                    newAnim.interpolate = true;
                                    newAnim.toColor = "#000000";

                                    this.addConcurrentAnimation(newAnim, false, false);

                                    this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                                    i = 0;
                                }
                        }

                    }
                } else if (anim.stage == 1) {
                    let counterAnim = this.findCounterAnimation(anim);
                    if (counterAnim != null) {
                        let newAnim = Animation.clone(anim);
                        let newCounterAnim = Animation.clone(counterAnim);

                        newAnim.fromX = anim.text.x;
                        newAnim.fromY = anim.text.y;
                        newAnim.toX = counterAnim.text.x;
                        newAnim.toY = counterAnim.text.y;
                        newAnim.duration = 200;
                        newAnim.vanish = true;
                        newAnim.move = false;
                        newAnim.stage = 2;

                        newCounterAnim.fromX = anim.text.x;
                        newCounterAnim.fromY = anim.text.y;
                        newCounterAnim.toX = anim.text.x;
                        newCounterAnim.toY = anim.text.y;
                        newCounterAnim.duration = 200;
                        newCounterAnim.vanish = true;
                        newCounterAnim.move = false;
                        newCounterAnim.stage = 2;

                        this.addConcurrentAnimation(newAnim, false, false);
                        this.addConcurrentAnimation(newCounterAnim, false, false);

                        this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
                        this.finishedAnimations.splice(this.finishedAnimations.indexOf(counterAnim), 1);

                        i = 0;
                    }
                } else if (anim.stage == 2) {
                    if (anim.id == "drone_unlock")
                    {
                        this.unlocked = true;
                        this.weapon1Unlocked = true;
                    }
                    if (anim.weaponNumber == 1)
                    {
                        this.weapon2Unlocked = true;
                        if (this.weapon2Missed && this.weapon3Missed)
                            this.hitzoneUnlocked = true;
                    }
                    else if (anim.weaponNumber == 2)
                    {
                        this.weapon3Unlocked = true;
                        if (this.weapon3Missed)
                            this.hitzoneUnlocked = true;
                    }
                    else if (anim.weaponNumber == 3)
                    {
                        this.allWeaponsUnlocked = true
                        this.hitzoneUnlocked = true;
                    }

                    anim.text.destroy();
                    this.finishedAnimations.splice(i, 1);
                    i = 0;
                }
            }
        }
        let animationsQueued = this.parallelAnimations[0].length > 0 || this.parallelAnimations[1].length > 0 || this.parallelAnimations[2].length > 0 || this.parallelAnimations[3].length > 0;
        if (animationsQueued) {
            for (let i = 0; i < this.parallelAnimations.length; i++) {
                let sameStageAnimations = this.parallelAnimations[i];
                for (let j = 0; j < sameStageAnimations.length; j++) {
                    let animation = sameStageAnimations[j];
                    animation.currentTime += delta;


                    if (animation.text.texture.source.length > 0)
                        this.animate(animation);

                    if (animation.currentTime >= animation.duration) {
                        if (animation.callback)
                            animation.callback();
                        let finishedAnimation = sameStageAnimations.splice(j, 1);
                        j = 0;
                        this.finishedAnimations.push(finishedAnimation[0]);
                    }
                }
            }
        }

        this.checkConditionsForSequentialAnimation(6);
        // this.removeFailedWeaponTexts();

    }

    private checkConditionsForSequentialAnimation(weaponNumber: number)
    {
        if (weaponNumber == null) return false;
        if (weaponNumber == 1)
        {
            if (this.weapon1Unlocked && !this.weapon1Missed) return true;
            return false;
        }
        if (weaponNumber == 2)
        {
            if (this.weapon2Unlocked && !this.weapon2Missed) return true;
            if (!this.weapon2Unlocked && this.weapon1Missed) return true;
            return false;
        }
        if (weaponNumber == 3)
        {
            if (this.weapon3Unlocked && !this.weapon3Missed) return true;
            if (!this.weapon3Unlocked && this.weapon2Missed) return true;
            return false;
        }
        // if (weaponNumber == 4)
        // {
        //     if (this.weapon3Missed) return true;
        //     return false;
        // }
        if (weaponNumber == 5)
        {
            if ((this.allWeaponsUnlocked || this.allWeaponsFired) && this.findAnimationContaining("hitzone") == null) return true;
            return false;
        }
        if (weaponNumber == 6)
        {
            if (this.allWeaponsUnlocked)
            {
                this.hitzoneUnlocked = true;
                if (this.findAnimationById("(hitzone)") == null)
                    this.nullProcessesUnlocked = true;
            }
            if (this.weapon3Unlocked && this.weapon3Missed)
                this.hitzoneUnlocked = true;
        }

    }

    private removeFailedWeaponTexts()
    {
        let leftAnimations = null;
        if (!this.weapon1Unlocked && (this.weapon2Unlocked || this.weapon3Unlocked))
        {
            leftAnimations = this.findAllRemainingAnimations(1);
            if (leftAnimations != null)
            for (let animation of leftAnimations)
                this.removeAnimation(animation);
        }
        if (!this.weapon2Unlocked && (this.weapon1Unlocked || this.weapon3Unlocked))
        {
            leftAnimations = this.findAllRemainingAnimations(2);
            if (leftAnimations != null)
                for (let animation of leftAnimations)
                 this.removeAnimation(animation);
        }
        if (!this.weapon3Unlocked && (this.weapon2Unlocked || this.weapon1Unlocked))
        {
            leftAnimations = this.findAllRemainingAnimations(3);
            if (leftAnimations != null)
                for (let animation of leftAnimations)
                    this.removeAnimation(animation);
        }
        if (this.allWeaponsUnlocked)
        {
            if (!this.weapon1Unlocked)
            {
                leftAnimations = this.findAllRemainingAnimations(1);
                if (leftAnimations != null)
                    for (let animation of leftAnimations)
                        this.removeAnimation(animation);
            }


            if (!this.weapon2Unlocked)
            {
                leftAnimations = this.findAllRemainingAnimations(2);
                if (leftAnimations != null)
                    for (let animation of leftAnimations)
                        this.removeAnimation(animation);
            }

            if (!this.weapon3Unlocked)
            {
                leftAnimations = this.findAllRemainingAnimations(3);
                if (leftAnimations != null)
                    for (let animation of leftAnimations)
                        this.removeAnimation(animation);
            }
        }

    }


    private getAnimationsFromQueue(number: number) {
        let animations = new Array<Animation>();
        for (let i = 0; i < this.queuedAnimations.length && i < number; i++)
            animations.push(this.queuedAnimations.pop());
        return animations;
    }

    private generateGUID() {
        const uid = (new Date()).getTime().toString(16) + Math.random().toString(16).substring(2) + "0".repeat(16);
        const guid = uid.substr(0, 8) + '-' + uid.substr(8, 4) + '-4000-8' + uid.substr(12, 3) + '-' + uid.substr(15, 12);
        return guid;
    }

    private findAnimationById(string: String): Animation {
        for (let animation of this.finishedAnimations)
            if (animation.id.indexOf(string.toString()) >= 0)
                if (!animation.locked)
                    return animation;
        return null;
    }

    private animationsLeft() {
        for (let i = 0; i < this.parallelAnimations.length; i++)
            if (this.parallelAnimations[i].length > 0)
                return true;
        for (let i = 0; i < this.parallelAnimations[i].length; i++)
            if (this.finishedAnimations.length > 0)
                return true;
        return false;
    }

    private animate(animation: Animation) {
        let halfDuration = animation.duration;
        if (animation.move) {
            this.moveSin(animation.fromX, animation.toX, animation.fromY, animation.toY, animation.currentTime / animation.duration, animation.text);
        }

        if (animation.scaleFont) {
            let fontScale = !animation.locked ? 50 : 30;
            this.scaleSin(20, 50, animation.currentTime / halfDuration, animation.text);
        }

        if (animation.interpolate) {
            let color = !animation.locked ? animation.toColor : "#006c9b";
            this.colorSin(animation.text.style.color, color, animation.currentTime / animation.duration, animation.text);
        }

        if (animation.rotate) {
            let currentRotation = animation.text.angle;
            this.rotateSin(currentRotation, 0, animation.currentTime / animation.duration, animation.text);
        }

        if (animation.vanish) {
            if (!(animation.text.style.fontSize.substr(0, animation.text.style.fontSize.indexOf("px")), 10 <= 2))
                this.scaleSin(parseInt(animation.text.style.fontSize, 10), 1, animation.currentTime / halfDuration, animation.text);
            else
                animation.text.destroy();
        }
    }

    public addAnimation(animation: Animation) {
        for (let i = 0; i < this.sequentialAnimations.length; i++) {
            // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
            let anim = this.sequentialAnimations[i];
            if (anim.id == animation.id) {
                if (animation.toX >= this.sequentialAnimations[i].toX - this.sequentialAnimations[i].text.height && animation.toX <= this.sequentialAnimations[i].toX + this.sequentialAnimations[i].text.height) {
                    animation.toX += animation.text.width;
                }
            }
        }
        this.sequentialAnimations.push(animation);
    }

    private moveCos(fromX: number, toX: number, fromY: number, toY: number, delta: number, text: Phaser.GameObjects.Text) {
        text.x = toX - Math.cos(delta * Math.PI / 2) * (toX - fromX);
        text.y = toY - Math.cos(delta * Math.PI / 2) * (toY - fromY);
    }

    private moveSin(fromX: number, toX: number, fromY: number, toY: number, delta: number, text: Phaser.GameObjects.Text) {
        text.x = fromX + Math.sin(delta * Math.PI / 2) * (toX - fromX);
        text.y = fromY + Math.sin(delta * Math.PI / 2) * (toY - fromY);
    }

    private rotateCos(fromDegree: number, toDegree: number, delta: number, text: Phaser.GameObjects.Text) {
        text.setAngle(toDegree - Math.cos(delta * Math.PI / 2) * (toDegree - fromDegree));
    }

    private rotateSin(fromDegree: number, toDegree: number, delta: number, text: Phaser.GameObjects.Text) {
        text.setAngle(fromDegree + Math.sin(delta * Math.PI / 2) * (toDegree - fromDegree));
    }


    private scaleCos(from: number, to: number, delta: number, text: Phaser.GameObjects.Text) {
        let stringFontSize = text.style.fontSize.replace("px", "");
        let fontSize = parseInt(stringFontSize);
        fontSize = from + Math.cos(delta * Math.PI / 2) * (to - from);
        text.style.setFontSize(new String(fontSize).replace("", "") + "px");
    }

    private scaleSin(from: number, to: number, delta: number, text: Phaser.GameObjects.Text) {
        let stringFontSize = text.style.fontSize.replace("px", "");
        let fontSize = parseInt(stringFontSize);
        fontSize = from + Math.sin(delta * Math.PI / 2) * (to - from);
        let fontSizeString = new String(fontSize).replace("", "") + "px";
        fontSizeString = fontSizeString == null ? "10px" : fontSizeString;
        let currentFontSize = parseInt(text.style.fontSize.substr(0, text.style.fontSize.indexOf("px")), 10);
        if (currentFontSize > 2)
            text.style.setFontSize(fontSizeString);
    }

    private colorSin(from: string, to: string, delta: number, text: Phaser.GameObjects.Text) {
        let fromRGB = this.getRGB(from);
        let toRGB = this.getRGB(to);
        let newColor = this.interpolate(fromRGB, toRGB, delta);
        if (newColor.indexOf("#0") >= 0)
            var com = null;
        text.style.setColor(newColor);
        text.style.setStroke(newColor, 1);
    }

    private getHex(color: Phaser.Display.Color) {
        return "#" + color.red.toString(16) + color.green.toString(16) + color.blue.toString(16);
    }

    private getRGB(color: String) {
        return Phaser.Display.Color.HexStringToColor(color.toString());
    }

    private interpolate(fromRGB: Phaser.Display.Color, toRGB: Phaser.Display.Color, delta: number) {
        let fromR = fromRGB.red;
        let toR = toRGB.red;
        let fromG = fromRGB.green;
        let toG = toRGB.green;
        let fromB = fromRGB.blue;
        let toB = toRGB.blue;


        let newR = Phaser.Display.Color.ComponentToHex(fromR + Math.sin(delta * Math.PI / 2) * (toR - fromR));
        let newG = Phaser.Display.Color.ComponentToHex(fromG + Math.sin(delta * Math.PI / 2) * (toG - fromG));
        let newB = Phaser.Display.Color.ComponentToHex(fromB + Math.sin(delta * Math.PI / 2) * (toB - fromB));

        newR = newR.indexOf(".") >= 0 ? newR.substr(0, newR.indexOf(".")) : newR;
        newG = newG.indexOf(".") >= 0 ? newG.substr(0, newG.indexOf(".")) : newG;
        newB = newB.indexOf(".") >= 0 ? newB.substr(0, newB.indexOf(".")) : newB;

        newR = newR.length < 2 ? "0" + newR : newR;
        newG = newG.length < 2 ? "0" + newG : newG;
        newB = newB.length < 2 ? "0" + newB : newB;

        return "#" + newR + newG + newB;
    }

    public getTotalAnimationTime() {
        let totalTime = 0;
        for (let i = 0; i < this.sequentialAnimations.length; i++)
            totalTime += this.sequentialAnimations[i].duration * 3;
        return totalTime;
    }


    public addConcurrentAnimation(animation: Animation, adjustX: boolean, adjustY: boolean) {
        let scaleFactor = animation.scaleFont ? 50 / parseInt(animation.text.style.fontSize.substr(0, animation.text.style.fontSize.indexOf("px")), 10) : 1;
        scaleFactor = 2;
        for (let i = 0; i < this.sequentialAnimations.length; i++) {
            let anim = this.sequentialAnimations[i];

            let tolerance = anim.text.displayWidth;
            let collisionOnX =  animation.toX >= anim.toX - tolerance && animation.toX <= anim.toX + tolerance;
            let collisionOnY = animation.toY >= anim.toY - tolerance && animation.toY <= anim.toY + tolerance;
            let widthDelta = anim.getWidthDelta();

            // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
            if (adjustX && anim != animation && collisionOnX)
            {
                animation.toX += (animation.text.width + widthDelta) * scaleFactor;
                anim.toX -= anim.text.width * scaleFactor;
                this.addConcurrentAnimation(animation, adjustX, adjustY);
                return;
            }
            if (adjustY && anim.id != animation.id && collisionOnY)
            {
                animation.toY += anim.text.height * scaleFactor;
                this.addConcurrentAnimation(animation, adjustX, adjustY);
                return;
            }


        }
        for (let i = 0; i < this.parallelAnimations.length; i++) {
            let sameStageAnimations = this.parallelAnimations[i];
            for (let j = 0; j < sameStageAnimations.length; j++) {
                let anim = sameStageAnimations[j];

                let tolerance = anim.text.displayWidth;;
                let collisionOnX =  animation.toX >= anim.toX - tolerance && animation.toX <= anim.toX + tolerance;
                let collisionOnY = animation.toY >= anim.toY - tolerance && animation.toY <= anim.toY + tolerance;
                let widthDelta = anim.getWidthDelta();

                // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
                if (adjustX && anim != animation && collisionOnX)
                {
                    animation.toX += (animation.text.width + widthDelta) * scaleFactor;
                    anim.toX -= anim.text.width * scaleFactor;
                    this.addConcurrentAnimation(animation, adjustX, adjustY);
                    return;
                }
                if (adjustY && anim.id != animation.id && collisionOnY)
                {
                    animation.toY += anim.text.height * scaleFactor;
                    this.addConcurrentAnimation(animation, adjustX, adjustY);
                    return;
                }


            }
        }

        for (let i = 0; i < this.finishedAnimations.length; i++) {
            let anim = this.finishedAnimations[i];

            let tolerance = anim.text.displayWidth;;
            let collisionOnX =  animation.toX >= anim.toX - tolerance && animation.toX <= anim.toX + tolerance;
            let collisionOnY = animation.toY >= anim.toY - tolerance && animation.toY <= anim.toY + tolerance;
            let widthDelta = anim.getWidthDelta();

            // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
            if (adjustX && anim != animation && collisionOnX)
            {
                animation.toX += (animation.text.width + widthDelta) * scaleFactor;
                anim.toX -= anim.text.width * scaleFactor;
                this.addConcurrentAnimation(animation, adjustX, adjustY);
                return;
            }
            if (adjustY && anim.id != animation.id && collisionOnY)
            {
                animation.toY += anim.text.height * scaleFactor;
                this.addConcurrentAnimation(animation, adjustX, adjustY);
                return;
            }
        }

        this.parallelAnimations[animation.stage].push(animation);
    }

    get finalCallback(): Function {
        return this._finalCallback;
    }

    set finalCallback(value: Function) {
        this._finalCallback = value;
    }

    private findCounterAnimation(anim: Animation): Animation {
        for (let animation of this.finishedAnimations)
            if (animation != anim && animation.id == anim.id)
                return animation;
    }

    removeStaticLock() {
        let animation = this.popAnimationById("<lock>");
        animation.resetParams();
        animation.id = this.generateGUID();
        animation.stage = 2;
        animation.duration = 100;
        animation.vanish = true;
        this.addConcurrentAnimation(animation, true, true);
    }

    private popAnimationById(id: string) {
        for (let i = 0; i < this.finishedAnimations.length; i++)
            if (this.finishedAnimations[i].id == id)
                return this.finishedAnimations.splice(i, 1)[0];
        for (let i = 0; i < this.sequentialAnimations.length; i++)
            if (this.finishedAnimations[i].id == id)
                return this.finishedAnimations.splice(i, 1)[0];
        for (let i = 0; i < this.parallelAnimations.length; i++)
            for (let j = 0; j < this.parallelAnimations[i].length; j++)
                if (this.parallelAnimations[i][j].id == id)
                    return this.parallelAnimations[i].splice(j, 1)[0];


    }

    private addToAnimationQueue(animation: Animation, adjustX: boolean, adjustY: boolean) {
        for (let i = 0; i < this.sequentialAnimations.length; i++) {
            let anim = this.sequentialAnimations[i];

            // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
            if (adjustX && anim != animation && animation.toX >= anim.toX - anim.text.width && animation.toX <= anim.toX + anim.text.width)
                animation.toX += anim.text.width;
            if (adjustY && anim.id != animation.id && animation.toY >= anim.toY - anim.text.height && animation.toY <= anim.toY + anim.text.height)
                animation.toY += anim.text.height + 40;

        }
        for (let i = 0; i < this.parallelAnimations.length; i++) {
            let sameStageAnimations = this.parallelAnimations[i];
            for (let j = 0; j < sameStageAnimations.length; j++) {
                let anim = sameStageAnimations[j];

                // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
                if (adjustX && anim != animation && animation.toX >= anim.toX - anim.text.width && animation.toX <= anim.toX + anim.text.width)
                    animation.toX += anim.text.width;
                if (adjustY && anim.id != animation.id && animation.toY >= anim.toY - anim.text.height && animation.toY <= anim.toY + anim.text.height)
                    animation.toY += anim.text.height + 40;

            }
        }

        for (let j = 0; j < this.finishedAnimations.length; j++) {
            let anim = this.finishedAnimations[j];

            // ADJUST XY SO IT DOESN'T OVERLAP WITH OTHER TEXTS
            if (adjustX && anim != animation && animation.toX >= anim.toX - anim.text.width && animation.toX <= anim.toX + anim.text.x)
                animation.toX += anim.text.width;
            if (adjustY && anim.id != animation.id && animation.toY >= anim.toY - anim.text.height && animation.toY <= anim.toY + anim.text.height)
                animation.toY += anim.text.height + 40;
        }
        this.queuedAnimations.push(animation);
    }


    destroyAll() {
        for (let animation of this.queuedAnimations)
            if (animation.text != null)
                animation.text.destroy();
        for (let animation of this.finishedAnimations)
            if (animation.text != null)
                animation.text.destroy();
        for (let animation of this.sequentialAnimations)
            if (animation.text != null)
                animation.text.destroy();
        for (let list of this.parallelAnimations)
            for (let animation of list)
                if (animation.text != null)
                    animation.text.destroy();

    }


    private findAnimationByType(id: string, type: string)
    {
        let shieldType1 = null;
        let shieldType2 = null;
        if (type == "rp")
        {
                shieldType1 = "ap";
                shieldType2 = "sp";
        }
        else if (type == "ap")
        {
            shieldType1 = "ap";
            shieldType2 = "rp";
        }
        else if (type == "sp")
        {
            shieldType1 = "sp";
            shieldType2 = "rp";
        }

        for (let animation of this.finishedAnimations)
            if (animation.id == id && (animation.text.text.substr(0,2) == shieldType1) || (animation.text.text.substr(0,2) == shieldType2))
                if (!animation.locked)
                    return animation;
        return null;
    }

    shoot(weaponType: WeaponType.LASER_ARMOR | WeaponType.PROJECTILE_SHIELD | WeaponType.ROCKET)
    {
        // let abr = AnimationUtilities.getAbbreviation(weaponType);
        // let anim = this.findAnimationByType("weapon", abr);
        // let counterAnim = this.findAnimationByType("(life)", abr);
        // if (counterAnim != null && anim != null)
        // {
        //     let newAnim = Animation.clone(anim);
        //     let newCounterAnim = Animation.clone(counterAnim);
        //
        //     let uID = this.generateGUID();
        //     let toX = 1920 / 2;
        //     let toY = 1080 / 2;
        //
        //     newAnim.id = uID;
        //     newAnim.duration = 500;
        //     newAnim.toX = toX - newAnim.text.width;
        //     newAnim.toY = toY;
        //     newAnim.stage = 1;
        //     newAnim.move = true;
        //
        //     newCounterAnim.id = uID;
        //     newCounterAnim.duration = 500;
        //     newCounterAnim.toX = toX;
        //     newCounterAnim.toY = toY;
        //     newCounterAnim.stage = 1;
        //     newCounterAnim.move = true;
        //
        //     this.addConcurrentAnimation(newAnim, false, true);
        //     this.addConcurrentAnimation(newCounterAnim, false, true);
        //
        //     this.finishedAnimations.splice(this.finishedAnimations.indexOf(anim), 1);
        //     this.finishedAnimations.splice(this.finishedAnimations.indexOf(counterAnim), 1);
        //
        // }
    }

    reinitialize()
    {
        this.sequentialAnimations = new Array<Animation>();
        this.finishedAnimations = new Array<Animation>();
        this.finalAnimations = new Array<Animation>();
        this.queuedAnimations = new Array<Animation>();
        this.parallelAnimations = new Array<Array<Animation>>();
        this.parallelAnimations[0] = new Array<Animation>();
        this.parallelAnimations[1] = new Array<Animation>();
        this.parallelAnimations[2] = new Array<Animation>();
        this.parallelAnimations[3] = new Array<Animation>();
        this.nullProcessesUnlocked = false;
        this.hitzoneUnlocked = false;
        this.weapon1Unlocked = false;
        this.weapon2Unlocked = false;
        this.weapon3Unlocked = false;
        this.weapon1Missed = false;
        this.weapon2Missed = false;
        this.weapon3Missed = false;
        this.allWeaponsUnlocked = false;
        this.allWeaponsFired = false;
        this.ready = false;
        this.unlocked = false;
    }

    private findAllRemainingAnimations(number: number)
    {
        let animations = new Array<Animation>();
        for (let animation of this.finishedAnimations)
            if (animation.weaponNumber != null && animation.weaponNumber == number)
                if (!animation.locked)
                    animations.push(animation);
        return animations.length > 0 ? animations : null;
    }

    private removeAnimation(animation)
    {
        animation.resetParams();
        animation.id = this.generateGUID();
        animation.duration = 200;
        animation.fromX = animation.text.x;
        animation.fromY = animation.text.y;
        animation.toX = animation.text.x;
        animation.toY = animation.text.y;
        animation.duration = 200;
        animation.vanish = true;
        animation.move = false;
        animation.stage = 2;

        this.addConcurrentAnimation(animation, false, false);

        this.finishedAnimations.splice(this.finishedAnimations.indexOf(animation), 1);
    }

    private findAnimationContaining(string: string)
    {
        for (let animation of this.finishedAnimations)
            if (animation.id.indexOf(string) >= 0)
                    return animation;
        return null;
    }

    addToNewBatch(animation: Animation, adjustX: boolean, adjustY: boolean)
    {
        this.waitingBatch.push(animation);
    }
}

