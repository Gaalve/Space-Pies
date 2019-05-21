import "phaser"

import {MainScene} from "./scenes/main-scene"
import {GuiScene} from "./scenes/gui-scene"
import {ShopSceneP1} from "./scenes/shop-sceneP1";
import {ShopSceneP2} from "./scenes/shop-sceneP2"
import {chooseSceneP1} from "./scenes/choose-sceneP1";
import {chooseSceneP2} from "./scenes/choose-sceneP2";
import {PauseScene} from "./scenes/pause-scene"
import {Background} from "./scenes/background";
import {ChooseTypeSceneP1} from"./scenes/chooseType-sceneP1"
import {ChooseTypeSceneP2} from "./scenes/chooseType-sceneP2";
import {ScenePiAnimation} from "./scenes/ScenePiAnimation";

const config: GameConfig = {
    width: 1920,
    height: 1080,
    backgroundColor: 0x220b28,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Background, MainScene,  GuiScene, ShopSceneP1, ShopSceneP2, chooseSceneP1,ChooseTypeSceneP2, ChooseTypeSceneP1,chooseSceneP2, PauseScene, ScenePiAnimation],
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