import {PiSystem} from "../mechanics/picalc/pi-system";

export class PiCalcTests {

    static runTests(scene: Phaser.Scene): boolean{
        console.log("Running tests");
        if(!this.runTestPiSequential(scene))return false;
        if(!this.runTestPiSequentialParallel(scene))return false;
        return true;
    }

    static runTestPiSequential(scene: Phaser.Scene): boolean{
        let system: PiSystem = new PiSystem(scene, 1, 1, 1);
        system.add.channelIn("x", "*").process("Out", ()=>{console.log("runTestPiSequential: success")});
        system.add.channelOut("x", "*").nullProcess();
        system.start();
        return true;
    }

    static runTestPiSequentialParallel(scene: Phaser.Scene): boolean{

        return true;
    }
}
