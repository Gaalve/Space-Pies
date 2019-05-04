import {PiSystem} from "../mechanics/picalc/pi-system";

export class PiCalcTests {

    static runTests(scene: Phaser.Scene): void{
        console.log("Running tests");
        let seconds: number = 0;
        scene.time.delayedCall(1000*seconds++, ()=>{this.runTestPiSequential1(scene)}, [], this);
        scene.time.delayedCall(1000*seconds++, ()=>{this.runTestPiSequential2(scene)}, [], this);
        scene.time.delayedCall(1000*seconds++, ()=>{this.runTestPiSequentialND(scene)}, [], this);
        scene.time.delayedCall(1000*seconds++, ()=>{this.runTestPiSequentialNDStatistic(scene)}, [], this);
    }

    static runTestPiSequential1(scene: Phaser.Scene): void{
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequential#1: success");
            system.stop();
        });
        system.add.channelOut("x", "*").nullProcess();
        system.start();
    }

    static runTestPiSequential2(scene: Phaser.Scene): void{

        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.add.channelIn("x", "*").channelOut("x", "*").process("Out", ()=>{
            console.log("runTestPiSequential#2: success");
            system.stop();
        });
        system.add.channelOut("x", "*").channelIn("x", "*").nullProcess();
        system.start();
    }

    static runTestPiSequentialND(scene: Phaser.Scene): void{

        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[1]: success");
            system.stop();
        });
        system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[2]: success");
            system.stop();
        });
        system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[3]: success");
            system.stop();
        });
        system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[4]: success");
            system.stop();
        });
        system.add.channelOut("x", "*").nullProcess();
        system.start();
    }

    static runTestPiSequentialNDStatistic(scene: Phaser.Scene, runs: number = 0, hits: number[] = [0,0,0,0]): void{
        if(runs >= 20) {
            this.runTestPiSequentialNDStatisticResult(runs, hits);
            return;
        }
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[0] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        });
        system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[1] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        });
        system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[2] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        });
        system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[3] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        });
        system.add.channelOut("x", "*").nullProcess();
        system.start();

    }

    static runTestPiSequentialNDStatisticResult(runs: number, hit: number[]): void{
        console.log("runTestPiSequentialNDStatistic Runs: "+runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[0]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[1]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[2]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[3]/runs);
    }


    static runTestPiSequentialParallel(scene: Phaser.Scene): void{
    }


}
