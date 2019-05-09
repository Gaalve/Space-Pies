import "phaser"

import {MainScene} from "./scenes/main-scene"
import {GuiScene} from "./scenes/gui-scene"
import {PauseScene} from "./scenes/pause-scene"

const config: GameConfig = {
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainScene, GuiScene,PauseScene],
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