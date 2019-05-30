import "phaser"

import {MainScene} from "./scenes/main-scene"
import {GuiScene} from "./scenes/gui-scene"
import {PauseScene} from "./scenes/pause-scene"
import {Background} from "./scenes/background";
import {ChooseTypeSceneP1} from"./scenes/chooseType-sceneP1"
import {ChooseTypeSceneP2} from "./scenes/chooseType-sceneP2";
import {Intro} from "./scenes/intro";
import {FadeScene} from "./scenes/fade-scene";
import {ChooseZoneSceneP1} from "./scenes/chooseZone-sceneP1";
import {ChooseZoneSceneP2} from "./scenes/chooseZone-sceneP2";

const config: GameConfig = {
    width: 1920,
    height: 1080,
    backgroundColor: 0x220b28,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Intro, Background, MainScene,  GuiScene, ShopSceneP1, ShopSceneP2, chooseSceneP1,ChooseTypeSceneP2, ChooseTypeSceneP1,chooseSceneP2, PauseScene, ChooseZoneSceneP1, ChooseZoneSceneP2, FadeScene],
    //scene: [Background, MainScene,  GuiScene, ShopSceneP1, ShopSceneP2, chooseSceneP1,ChooseTypeSceneP2, ChooseTypeSceneP1,chooseSceneP2, PauseScene, ChooseZoneSceneP1, ChooseZoneSceneP2],

    scene: [Background, MainScene,  GuiScene, PauseScene],
    physics: {
        default: 'arcade'
    },
};

export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config)
    }
}

window.addEventListener("load", () => {
    new Game(config);
});