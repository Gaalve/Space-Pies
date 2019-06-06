import {TestBase} from "./test-base";

export class TestEnvironment {
    public readonly scene: Phaser.Scene;
    private readonly tests: TestBase[];
    private finishedTests: TestBase[];
    private started: boolean;   // true if testing started
    private onFinish: Function; // function to call when finished
    private success: boolean;

    public constructor(scene: Phaser.Scene, onFinish: Function){
        this.scene = scene;
        this.tests = [];
        this.finishedTests = [];
        this.onFinish = onFinish;
        this.success = true;
    }

    // getter methods

    // setter methods

    public setOnFinishCallback(callback: Function): void{
        this.onFinish = callback;
    }

    // functionality methods

    public start(): void{
        this.started = true;
        console.log("Running tests");
        this.callOnFinish();
    }

    private callOnFinish(){
        if (!this.started) return;
        if(this.finishedTests.length == this.tests.length && this.tests.length > 0){
            console.log(this.getStateAsMessage());
            this.onFinish();
        }
    }

    // assisting methods

    public addTest(test: TestBase): void{
        this.tests.push(test);
    }

    public finishTest(test: TestBase, success: boolean): void{
        if (this.tests.indexOf(test) > -1){
            if(this.finishedTests.indexOf(test) > -1) throw new Error('Test already finished.');
            else {
                this.finishedTests.push(test);
                console.log(test.getStateAsMessage());
                if(!success) this.success = false;
                this.callOnFinish();
            }
        }
        else {
            throw new Error('Finished unknown test!');
        }
    }

    public didSucceed(): boolean{
        if(this.finishedTests.length == this.tests.length) return this.success;
        return false;
    }

    // return result for test set
    public getStateAsMessage(): string{

        let amount: number = 0; // number of succeeded tests

        // raise amount for every succeeded test
        for(let idx in this.tests){
            if (this.tests[idx].getSucceeded()) amount++;
        }

        let msg : string = 'TE: ' + amount + '/' + this.tests.length + ' test(s) succeeded:\n';

        // add single test output
        for(let idx in this.tests){
            msg += this.tests[idx].getStateAsMessage() + '\n';
        }

        return msg;
    }

}