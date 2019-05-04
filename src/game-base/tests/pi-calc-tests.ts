import {PiSystem} from "../mechanics/picalc/pi-system";

export class PiCalcTests {

    static runTests(scene: Phaser.Scene): void{
        console.log("Running tests");
        scene.time.delayedCall(0, ()=>{this.runTestPiSequential1(scene)}, [], this);
        scene.time.delayedCall(0, ()=>{this.runTestPiSequential2(scene)}, [], this);
        scene.time.delayedCall(0, ()=>{this.runTestPiSequentialND(scene)}, [], this);
        scene.time.delayedCall(0, ()=>{this.runTestPiSequentialNDStatistic(scene)}, [], this);
        scene.time.delayedCall(0, ()=>{this.runTestPiSum(scene)}, [], this);
        scene.time.delayedCall(0, ()=>{this.runTestPiSum2(scene)}, [], this);
        // scene.time.delayedCall(0, ()=>{this.runTestPiSequentialParallel(scene)}, [], this);
    }

    static runTestPiSequential1(scene: Phaser.Scene): void{
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequential#1: success");
            system.stop();
        }));
        system.addSymbol(system.add.channelOut("x", "*").nullProcess());
        system.start();
    }

    static runTestPiSequential2(scene: Phaser.Scene): void{

        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.addSymbol(system.add.channelIn("x", "*").channelOut("x", "*").process("Out", ()=>{
            console.log("runTestPiSequential#2: success");
            system.stop();
        }));
        system.addSymbol(system.add.channelOut("x", "*").channelIn("x", "*").nullProcess());
        system.start();
    }

    static runTestPiSequentialND(scene: Phaser.Scene): void{

        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[1]: success");
            system.stop();
        }));
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[2]: success");
            system.stop();
        }));
        system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[3]: success");
            system.stop();
        });
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            console.log("runTestPiSequentialND[4]: success");
            system.stop();
        }));
        system.addSymbol(system.add.channelOut("x", "*").nullProcess());
        system.start();
    }

    static runTestPiSequentialNDStatistic(scene: Phaser.Scene, runs: number = 0, hits: number[] = [0,0,0,0]): void{
        if(runs >= 20) {
            this.runTestPiSequentialNDStatisticResult(scene, runs, hits);
            return;
        }
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[0] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        }));
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[1] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        }));
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[2] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        }));
        system.addSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[3] += 1;
            system.stop();
            scene.time.delayedCall(1, ()=>{this.runTestPiSequentialNDStatistic(scene, runs, hits)}, [], this);
        }));
        system.addSymbol(system.add.channelOut("x", "*").nullProcess());
        system.start();

    }

    static runTestPiSequentialNDStatisticResult(scene: Phaser.Scene, runs: number, hit: number[]): void{
        console.log("runTestPiSequentialNDStatistic Runs: "+runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[0]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[1]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[2]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[3]/runs);
    }

    static runTestPiSum(scene: Phaser.Scene): void{
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.addSymbol(system.add.sum([
            system.add.channelIn('x', '*').process("Out", ()=>{
                console.log("runTestPiSum[1]: success");
                system.stop();
            }),
            system.add.channelIn('y', '*').process("Out", ()=>{
                console.log("runTestPiSum[2]: success");
                system.stop();
            }),
            system.add.channelIn('z', '*').process("Out", ()=>{
                console.log("runTestPiSum[3]: success");
                system.stop();
            })
        ]));
        system.addSymbol(system.add.channelOut('x', '*').nullProcess());
        system.addSymbol(system.add.channelOut('y', '*').nullProcess());
        system.addSymbol(system.add.channelOut('z', '*').nullProcess());
        system.start();
    }

    static runTestPiSum2(scene: Phaser.Scene): void{
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.addSymbol(system.add.sum([
            system.add.channelOut('x', '*').process("Out", ()=>{
                console.log("runTestPiSum2[1]: success");
                system.stop();
            }),
            system.add.channelOut('y', '*').process("Out", ()=>{
                console.log("runTestPiSum2[2]: success");
                system.stop();
            }),
            system.add.channelOut('z', '*').process("Out", ()=>{
                console.log("runTestPiSum2[3]: success");
                system.stop();
            })
        ]));
        system.addSymbol(system.add.channelIn('x', '*').nullProcess());
        system.addSymbol(system.add.channelIn('y', '*').nullProcess());
        system.addSymbol(system.add.channelIn('z', '*').nullProcess());
        system.start();
    }

    static runTestPiSequentialParallel(scene: Phaser.Scene): void{
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.addSymbol(
            system.add.channelIn("x", "*").concurrent([
                    system.add.channelOut('y', '*').nullProcess(),
                    system.add.channelIn('y', '*').process('Out', ()=>{
                        console.log("runTestPiSequentialParallel: success");
                        system.stop();
                    })
                ]
            )
        );
        system.addSymbol(
            system.add.channelOut('x', '*').nullProcess()
        );
        system.start();
    }




}
