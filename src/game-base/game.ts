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
import {ScenePiAnimation} from "./scenes/ScenePiAnimation";
import {FullPiScene} from "./scenes/full-pi-scene";
import {ScrollerPlugin} from "./rexPlugins/plugins/scroller-plugin.js";




const config: GameConfig = {
    width: 1920,
    height: 1080,
    backgroundColor: 0x220b28,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    render: {batchSize: 4096},

    plugins: {
        global: [{
            key: 'rexScroller',
            plugin: ScrollerPlugin,
            start: true
        }
        ]
    },

    scene: [Intro, Background, MainScene, StartScene,  SimplePiCalc, ScenePiAnimation, GuiScene, PauseScene, EndSceneP1,  FadeScene, FullPiScene],
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
   var game = new Game(config);

});