import "phaser"

import {MainScene} from "./scenes/main-scene"
import {GuiScene} from "./scenes/gui-scene"
import {ShopSceneP1} from "./scenes/shop-sceneP1";
import {ShopSceneP2} from "./scenes/shop-sceneP2"
import {chooseSceneP1} from "./scenes/choose-sceneP1";
import {chooseSceneP2} from "./scenes/choose-sceneP2";
import {PauseScene} from "./scenes/pause-scene"

const config: GameConfig = {
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainScene, GuiScene, ShopSceneP1, ShopSceneP2, chooseSceneP1, chooseSceneP2, PauseScene],
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