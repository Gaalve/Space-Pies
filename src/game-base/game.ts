import "phaser"

import {MainScene} from "./scenes/main-scene"
import {GuiScene} from "./scenes/gui-scene"
import {PauseScene} from "./scenes/pause-scene"
import {Background} from "./scenes/background";
import {Intro} from "./scenes/intro";
import {FadeScene} from "./scenes/fade-scene";
import {EndSceneP1} from "./scenes/end-sceneP1";
import {StartScene} from "./scenes/start-scene";
import {SimplePiCalc} from "./scenes/simple-pi-calc";



const config: GameConfig = {
    width: 1920,
    height: 1080,
    backgroundColor: 0x220b28,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    render: {batchSize: 4096},

    scene: [Intro, Background, MainScene, StartScene,  GuiScene, SimplePiCalc, PauseScene, EndSceneP1, FadeScene],
    //scene: [Background, MainScene,  GuiScene, ShopSceneP1, ShopSceneP2, chooseSceneP1,ChooseTypeSceneP2, ChooseTypeSceneP1,chooseSceneP2, PauseScene, ChooseZoneSceneP1, ChooseZoneSceneP2],

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