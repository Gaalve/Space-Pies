import {PiSystem} from "../src/game-base/mechanics/picalc/pi-system";
import {TestEnvironment} from "./test-environment";
import {TestBase} from "./test-base";
import "../src/phaser";
import { expect } from "chai";
import "mocha";
import {PiChannelIn} from "../src/game-base/mechanics/picalc/pi-channel-in";
import {PiChannelOut} from "../src/game-base/mechanics/picalc/pi-channel-out";
import {PiSymbol} from "../src/game-base/mechanics/picalc/pi-symbol";
import {PiSum} from "../src/game-base/mechanics/picalc/pi-sum";
import {PiReplication} from "../src/game-base/mechanics/picalc/pi-replication";
import {PiResolvingPair} from "../src/game-base/mechanics/picalc/pi-resolving-pair";


describe('test', function() {

    it('should ', function () {

        let gui: Phaser.Scene = new Phaser.Scene({ });
        let te : TestEnvironment = new TestEnvironment(gui, ()=>{});
        te.setOnFinishCallback(()=>{console.log("Pi-Calc-System working: "+te.didSucceed())});
        PiCalcTests.runTestPiChannelCallback1(gui, te);
        /*PiCalcTests.runTestPiChannelCallback2(gui, te);
        PiCalcTests.runTestPiSequential1(gui, te);
        PiCalcTests.runTestPiSequential2(gui, te);
        PiCalcTests.runTestPiSequentialND(gui, te);
        PiCalcTests.runTestPiSequentialNDStatistic(gui);
        PiCalcTests.runTestPiSum(gui, te);
        PiCalcTests.runTestPiSum2(gui, te);
        PiCalcTests.runTestPiSequentialParallel(gui, te);
        PiCalcTests.runTestPiReplication1(gui, te);
        PiCalcTests.runTestPiReplication2(gui, te);
        PiCalcTests.runTestPiTerm(gui, te);
        PiCalcTests.runTestPiTermRecursion(gui, te);
        PiCalcTests.runTestPiRename(gui, te);
        PiCalcTests.runTestPiScopeRename(gui, te);
        PiCalcTests.runTestPiShieldTest(gui, te);*/
        te.start();
    });
});

export class PiCalcTests {

    static runTestPiChannelCallback1(gui: Phaser.Scene, testEnvironment: TestEnvironment): void{

        let test = new TestBase(testEnvironment, 'PiChannelCallback#1', 0);
        let system : PiSystem = new PiSystem(gui, 1, 1, 1, false);

        system.setOnDeadlockCallback(()=>{test.success(); system.stop();});

        let symbolA = system.add.channelIn("x", "*").channelOutCB("y", '*', ()=>{
            test.fail();
            system.stop();
        }).nullProcess();

        let symbolB = system.add.channelOut("x", "*").nullProcess();

        system.pushSymbol(symbolA);
        system.pushSymbol(symbolB);
        system.start();

        setTimeout(() => {}, 1000);


        //console.log(system.getCurChannelIn()[0].getFullName());
        //console.log(system.getCurChannelOut()[0].getFullName());
        //expect(system.getCurChannelIn().length).to.equal(0);
        expect(system.getCurChannelOut().length).to.equal(1);
        expect(system.getCurChannelOut()[0].getFullName()).to.equal("y<*>");
    }

    static runTestPiChannelCallback2(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{

        let test = new TestBase(testEnvironment, 'PiChannelCallback#2', 0);

        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);

        system.setOnDeadlockCallback(()=>{test.fail()});

        let symbolA = system.add.channelIn("x", "*").channelOutCB("y", '*', ()=>{
            test.success();
            system.stop();
        }).nullProcess();

        let symbolB = system.add.channelOut("x", "*").channelIn('y', '*').nullProcess();

        system.pushSymbol(symbolA);
        system.pushSymbol(symbolB);
        system.start();

        setTimeout(() => {}, 1000);

        expect(system.getCurChannelIn().length).to.equal(0);
        expect(system.getCurChannelOut().length).to.equal(0);
    }

    static runTestPiSequential1(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiSequential#1', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.pushSymbol(system.add.channelOut("x", "*").nullProcess());
        system.start();
    }

    static runTestPiSequential2(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{

        let test = new TestBase(testEnvironment, 'PiSequential#2', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});

        system.pushSymbol(system.add.channelIn("x", "*").channelOut("x", "*").process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.pushSymbol(system.add.channelOut("x", "*").channelIn("x", "*").nullProcess());
        system.start();
    }

    static runTestPiSequentialND(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{

        let test = new TestBase(testEnvironment, 'PiSequentialND', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.add.channelIn("x", "*").process("Out", ()=>{
            test.success();
            system.stop();
        });
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.pushSymbol(system.add.channelOut("x", "*").nullProcess());
        system.start();
    }

    static runTestPiSequentialNDStatistic(scene: Phaser.Scene, runs: number = 0, hits: number[] = [0,0,0,0]): void{
        if(runs >= 20) {
            this.runTestPiSequentialNDStatisticResult(scene, runs, hits);
            return;
        }
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[0] += 1;
            system.stop();
            this.runTestPiSequentialNDStatistic(scene, runs, hits);
        }));
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[1] += 1;
            system.stop();
            this.runTestPiSequentialNDStatistic(scene, runs, hits);
        }));
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[2] += 1;
            system.stop();
            this.runTestPiSequentialNDStatistic(scene, runs, hits);
        }));
        system.pushSymbol(system.add.channelIn("x", "*").process("Out", ()=>{
            runs += 1;
            hits[3] += 1;
            system.stop();
            this.runTestPiSequentialNDStatistic(scene, runs, hits);
        }));
        system.pushSymbol(system.add.channelOut("x", "*").nullProcess());
        system.start();

    }

    static runTestPiSequentialNDStatisticResult(scene: Phaser.Scene, runs: number, hit: number[]): void{
        console.log("runTestPiSequentialNDStatistic Runs: "+runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[0]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[1]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[2]/runs);
        console.log("runTestPiSequentialNDStatistic Hit-Chance[1 of 4]: "+hit[3]/runs);
    }

    static runTestPiSum(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiSum#1', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(system.add.sum([
            system.add.channelIn('x', '*').process("Out", ()=>{
                test.success();
                system.stop();
            }),
            system.add.channelIn('y', '*').process("Out", ()=>{
                test.success();
                system.stop();
            }),
            system.add.channelIn('z', '*').process("Out", ()=>{
                test.success();
                system.stop();
            })
        ]));
        system.pushSymbol(system.add.channelOut('x', '*').nullProcess());
        system.pushSymbol(system.add.channelOut('y', '*').nullProcess());
        system.pushSymbol(system.add.channelOut('z', '*').nullProcess());
        system.start();
    }

    static runTestPiSum2(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiSum#2', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(system.add.sum([
            system.add.channelOut('x', '*').process("Out", ()=>{
                test.success();
                system.stop();
            }),
            system.add.channelOut('y', '*').process("Out", ()=>{
                test.success();
                system.stop();
            }),
            system.add.channelOut('z', '*').process("Out", ()=>{
                test.success();
                system.stop();
            })
        ]));
        system.pushSymbol(system.add.channelIn('x', '*').nullProcess());
        system.pushSymbol(system.add.channelIn('y', '*').nullProcess());
        system.pushSymbol(system.add.channelIn('z', '*').nullProcess());
        system.start();
    }

    static runTestPiSequentialParallel(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiSequentialParallel', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(
            system.add.channelIn("x", "*").concurrent([
                    system.add.channelOut('y', '*').nullProcess(),
                    system.add.channelIn('y', '*').process('Out', ()=>{
                        test.success();
                        system.stop();
                    })
                ]
            )
        );
        system.pushSymbol(
            system.add.channelOut('x', '*').nullProcess()
        );
        system.start();
    }


    static runTestPiReplication1(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let runs = 0;
        let maxRuns = 10;
        let test = new TestBase(testEnvironment, 'PiReplication#1', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(
            system.add.replication(system.add.channelIn("x", "*").process("Out", ()=>{
                if(++runs == maxRuns){
                    test.success();
                    system.stop();
                }
            }))
        );
        for (let i = 0; i < maxRuns; i++) {
            system.pushSymbol(
                system.add.channelOut('x', '*').nullProcess()
            );
        }
        system.start();
    }

    static runTestPiReplication2(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let runs = 0;
        let maxRuns = 10;
        let test = new TestBase(testEnvironment, 'PiReplication#2', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(
            system.add.replication(system.add.channelOut("x", "*").process("Out", ()=>{
                if(++runs == maxRuns){
                    test.success();
                    system.stop();
                }
            }))
        );
        for (let i = 0; i < maxRuns; i++) {
            system.pushSymbol(
                system.add.channelIn('x', '*').nullProcess()
            );
        }
        system.start();
    }

    static runTestPiTerm(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiTerm', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        system.pushSymbol(
            system.add.channelIn('x', '*').term('Term21', system.add.process("Out", ()=>{
                test.success();
                system.stop();
            }))
        );
        system.pushSymbol(
            system.add.channelOut('x', '*').nullProcess()
        );
        system.start();
    }

    static runTestPiTermRecursion(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let runs = 0;
        let maxRuns = 10;
        let test = new TestBase(testEnvironment, 'PiTermRecursion', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});

        let recursion = system.add.term('Recursion', undefined);
        recursion.symbol = system.add.channelOut('x', '*').next(recursion);
        system.pushSymbol(recursion);

        system.pushSymbol(
            system.add.replication(system.add.channelIn("x", "*").process("Out", ()=>{
                if(++runs == maxRuns){
                    test.success();
                    system.stop();
                }
            }))
        );
        system.start();
    }

    static runTestPiRename(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiRename', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});

        system.pushSymbol(system.add.channelIn('x', 'a').channelOut('a', '*').nullProcess());
        system.pushSymbol(system.add.channelOut('x', 'y').nullProcess());
        system.pushSymbol(system.add.channelIn('y', '*').process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.start();
    }

    static runTestPiRenameSum(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiRenameSum', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});

        system.pushSymbol(system.add.channelIn('x', 'a').channelOut('r', '*')
            .sum([system.add.channelOut('a', '*').nullProcess(),
                system.add.channelOut('s', '*').nullProcess()]));
        system.pushSymbol(system.add.channelIn('r', '*').nullProcess());
        system.pushSymbol(system.add.channelOut('x', 'y').nullProcess());
        system.pushSymbol(system.add.channelIn('y', '*').process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.start();
    }

    static runTestPiRenameConc(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiRenameConc', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});

        system.pushSymbol(system.add.channelIn('x', 'a').channelOut('r', '*')
            .concurrent([system.add.channelOut('a', '*').nullProcess(),
                system.add.channelOut('s', '*').nullProcess()]));
        system.pushSymbol(system.add.channelIn('r', '*').nullProcess());
        system.pushSymbol(system.add.channelIn('s', '*').nullProcess());
        system.pushSymbol(system.add.channelOut('x', 'y').nullProcess());
        system.pushSymbol(system.add.channelIn('y', '*').process("Out", ()=>{
            test.success();
            system.stop();
        }));
        system.start();
    }

    static runTestPiScopeRename(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiScopeRename', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.success()});
        system.pushSymbol(system.add.scope('x', system.add.channelIn('x', 'a').channelOut('a', '*').nullProcess()));
        system.pushSymbol(system.add.channelOut('x', 'y').nullProcess());
        system.pushSymbol(system.add.channelIn('y', '*').process("Out", ()=>{
            test.fail();
            system.stop();
        }));
        system.start();
    }


    static runTestPiShieldTest(scene: Phaser.Scene, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiShieldTest', 0);
        let system: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        system.setOnDeadlockCallback(()=>{test.fail()});
        let reg = system.add.term('Reg',
            system.add.sum([
                system.add.channelIn('s', '*').channelOut('regout', '*').channelOut('s1', '*').nullProcess(),

                system.add.channelIn('rshield','*').scope('w1', system.add.scope('reg1',
                    system.add.scope('w2', system.add.scope('reg2',
                            system.add.channelOut('reghelp', 'w1')
                            .channelOut('w1', 'reg1').channelOut('w1', 's2')
                            .channelIn('reg1', '*').channelIn('s2', '*')
                            .channelOut('reghelp', 'w2').channelOut('w2', 'reg2')
                            .channelOut('w2', 's1').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess()
                        ))))
            ]));

        system.pushSymbol(system.add.replication(system.add.channelIn('reghelp', 'w').
        channelIn('w', 'regout').channelIn('w', 's1').next(reg)));

        system.pushSymbol(
            system.add.channelIn('rshield','*').scope('w1', system.add.scope('reg1',
                    system.add.channelOut('reghelp', 'w1')
                        .channelOut('w1', 'reg1').channelOut('w1', 's2')
                        .channelIn('reg1', '*').channelIn('s2', '*').process('CoreExplosion', ()=>{
                            test.success();
                        })
                ))
        );

        system.pushSymbol(
            system.add.channelOut('rshield', '*').channelOut('rshield', '*').channelOut('rshield', '*').
            channelOut('s', '*').channelOut('s', '*').channelOut('s', '*').nullProcess()
        );

        system.start();
    }
}
