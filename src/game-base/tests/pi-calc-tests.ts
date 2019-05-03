import {PiSystem} from "../mechanics/picalc/pi-system";

export class PiCalcTests {

    static runTests(scene: Phaser.Scene): void{
        console.log("Running tests");
        let seconds: number = 0;
        scene.time.delayedCall(1000*seconds++, ()=>{this.runTestPiSequential1(scene)}, [], this);
        scene.time.delayedCall(1000*seconds++, ()=>{this.runTestPiSequential2(scene)}, [], this);
        scene.time.delayedCall(1000*seconds++, ()=>{this.runTestPiSequentialParallel(scene)}, [], this);
    }

    static runTestPiSequential1(scene: Phaser.Scene): void{
        console.log("-----------------------------------");
        console.log("Running Test: runTestPiSequential#1");
        console.log("-----------------------------------");
        let system: PiSystem = new PiSystem(scene, 1, 1, 1);
        system.add.channelIn("x", "*").process("Out", ()=>{console.log("runTestPiSequential#1: success")});
        system.add.channelOut("x", "*").nullProcess();
        system.start();

    }

    static runTestPiSequential2(scene: Phaser.Scene): void{
        console.log("-----------------------------------");
        console.log("Running Test: runTestPiSequential#2");
        console.log("-----------------------------------");
        let system: PiSystem = new PiSystem(scene, 1, 1, 1);
        system.add.channelIn("x", "*").channelOut("x", "*").process("Out", ()=>{console.log("runTestPiSequential#2: success")});
        system.add.channelOut("x", "*").channelIn("x", "*").nullProcess();
        system.start();
    }

    static runTestPiSequentialParallel(scene: Phaser.Scene): void{
        console.log("-----------------------------------");
        console.log("Running Test: runTestPiSequentialParallel#1");
        console.log("-----------------------------------");

    }


}
