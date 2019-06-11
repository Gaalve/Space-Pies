import "phaser"
import {PiSystem} from "../src/game-base/mechanics/picalc/pi-system";
import {TestEnvironment} from "./test-environment";
import {TestBase} from "./test-base";
import "../src/phaser";
import "mocha";
import Scene = Phaser.Scene;
import {TestScene} from "./test-scene";
import READY = Phaser.Scenes.Events.READY;
import DESTROY = Phaser.Core.Events.DESTROY;


describe('test', function() {

    let game : Phaser.Game;

    it('should return true when the pi system works', function () {
        const config: GameConfig = {
            type: Phaser.HEADLESS,
            scene: [TestScene],
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                    gravity: { y: 0 }
                }
            },
            autoFocus: false,
            context: null,
            fps: {
                forceSetTimeOut: true
            }
        };
        game = new Phaser.Game(config);
        game.events.emit(READY);
        let success = undefined;
        let loop = true;
        game.events.on("success", ()=>{success = true; loop = false;});
        game.events.on("fail", ()=>{success = false; loop = false;});
        while (loop){
            game.headlessStep(0,1);
        }
        if(!success) throw new Error("PiSystem is not working correctly");
        console.log("Pi-Calc-System working: "+success);
    });
});

export class PiCalcTests {


    static async wait(){
        return new Promise(() => {
            setTimeout(() => {
            }, 10000);
        });
    }

    static startTests(gui: Scene, te: TestEnvironment){
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiChannelCallback1(gui, te)}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiChannelCallback2(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiSequential1(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiSequential2(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiSequentialND(gui, te);}, [], this);
        // gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiSequentialNDStatistic(gui);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiSum(gui, te);}, [], this);

        // we only want chanIns in Sum (to improve performance) so we skip this test
        // gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiSum2(gui, te);}, [], this);

        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiSequentialParallel(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiReplication1(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiReplication2(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiTerm(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiTermRecursion(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiRename(gui, te);}, [], this);

        // we only want chanIns in Sum (to improve performance) so we skip this test
        // we can not rename chanIns, so this test wont work
        // gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiRenameSum(gui, te);}, [], this);

        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiRenameConc(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiScopeRename(gui, te);}, [], this);
        gui.time.delayedCall(1,() =>{PiCalcTests.runTestPiShieldTest(gui, te);}, [], this);


        // for (let i = 0.0; i < 20.0; i++) {
        //     gui.time.delayedCall(1, () => {PiCalcTests.runStatisticsRandomnessManipulationStart(gui,
        //         0, (100 - i * 5)/100, 0, 0, 10000, te)},
        //         [], this);
        // }


        te.start();
    }

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
        system.setOnDeadlockCallback(()=>{test.success(); system.stop();});
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
                            system.stop();
                        })
                ))
        );

        system.pushSymbol(
            system.add.channelOut('rshield', '*').channelOut('rshield', '*').channelOut('rshield', '*').
            channelOut('s', '*').channelOut('s', '*').channelOut('s', '*').nullProcess()
        );

        system.start();
    }


    /**
     * Runs a statistics test for randomness manipulation.
     * @param scene - the scene, duh
     * @param otherSuccessAmount - amount success symbols (+1); could represent shields on the ship
     * @param failBaseResolvingChance - chance for not resolving fail symbol; could represent ship's evasion chance
     * @param otherFailAmount - amount of additional fail symbols; could represent ship's engines
     * @param otherFailResolvingChance - resolving chance for additional fail symbols
     * @param tries - The amount of tries for this experiment,
     * @param testEnvironment
     */
    static runStatisticsRandomnessManipulationStart(scene: Phaser.Scene, otherSuccessAmount: number,
                                               failBaseResolvingChance: number, otherFailAmount: number,
                                               otherFailResolvingChance: number, tries: number, testEnvironment: TestEnvironment): void{
        let test = new TestBase(testEnvironment, 'PiManipulationStatistic', 0);
        let amountSuccess: number = 0;
        let amountFail: number = 0;
        this.runStatisticsRandomnessManipulation(scene, otherSuccessAmount, failBaseResolvingChance,
            otherFailAmount, otherFailResolvingChance, tries, amountSuccess, amountFail, test);
    }

    static runStatisticsRandomnessManipulation(scene: Phaser.Scene, otherSuccessAmount: number,
                                               failBaseResolvingChance: number, otherFailAmount: number,
                                               otherFailResolvingChance: number, tries: number,
                                               amountSuccess: number, amountFail: number, test: TestBase): void{

        if (amountFail + amountSuccess >= tries){
            console.log('Hit-Chance: '+amountSuccess/tries);
            console.log('Hits: '+amountSuccess + ' / ' + tries);
            console.log('Fails: '+amountFail + ' / ' + tries);
            console.log('Base-Fail-Chance: '+failBaseResolvingChance);
            test.success();
            return;
        }

        let sys: PiSystem = new PiSystem(scene, 1, 1, 1, false);
        sys.setOnDeadlockCallback(()=>{
            sys.stop();
            this.runStatisticsRandomnessManipulation(scene, otherSuccessAmount,
                failBaseResolvingChance, otherFailAmount, otherFailResolvingChance, tries, amountSuccess, amountFail, test);
        });
        sys.pushSymbol(sys.add.channelOut('shield', '').nullProcess()); // one time shot

        sys.pushSymbol(sys.add.channelInCB('shield', '',
            ()=>{amountSuccess++;}).nullProcess());              // shield

        sys.pushSymbol(sys.add.channelInCB('shield', '',
            ()=>{amountFail++}, null, failBaseResolvingChance).nullProcess()); // Evasion

        for (let i = 0; i < otherSuccessAmount; i++) {
            sys.pushSymbol(sys.add.channelInCB('shield', '',
                ()=>{amountSuccess++}).nullProcess());              // additional shield
        }

        for (let i = 0; i < otherFailAmount; i++) {
            sys.pushSymbol(sys.add.channelInCB('shield', '',
                ()=>{amountFail++}, null, otherFailResolvingChance).nullProcess()); // additional Evasion
        }
        sys.start();
    }
}
