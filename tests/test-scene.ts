/** Scene for user interface elements. */
import "phaser"
import {PiCalcTests} from "./pi-calc-tests.test";
import DESTROY = Phaser.Core.Events.DESTROY;
import {TestEnvironment} from "./test-environment";

export class TestScene extends Phaser.Scene {

    constructor() {
        super({
            key: "TestScene",
            active: true
        })
    }

    create(): void {
        let te = new TestEnvironment(this, ()=>{} );
        te.setOnFinishCallback(()=>{
            if(te.didSucceed()) this.game.events.emit("success");
            else this.game.events.emit("fail");
        });
        PiCalcTests.startTests(this, te);
    }

}
