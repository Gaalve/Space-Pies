import {TestBase} from "./test-base";

export class TestEnvironment {
    public readonly scene: Phaser.Scene;
    private tests: TestBase[];
    private finishedTests: TestBase[];
    private started: boolean;
    private onFinish: Function;
    private success: boolean;

    public constructor(scene: Phaser.Scene, onFinish: Function){
        this.scene = scene;
        this.tests = [];
        this.finishedTests = [];
        this.onFinish = onFinish;
        this.success = true;
    }

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

    private callOnFinish(){
        if (!this.started) return;
        if(this.finishedTests.length == this.tests.length && this.tests.length > 0){
            console.log(this.getStateAsMessage());
            this.onFinish();
        }
    }

    public didSucceed(): boolean{
        if(this.finishedTests.length == this.tests.length) return this.success;
        return false;
    }

    public getStateAsMessage(): string{
        let amount: number = 0;
        for(let idx in this.tests){
            if (this.tests[idx].didSucceed()) amount++;
        }
        let msg : string = 'TE: ' + amount + '/' + this.tests.length + ' Test succeeded:\n';
        for(let idx in this.tests){
            msg += this.tests[idx].getStateAsMessage() + '\n';
        }
        return msg;
    }

    public start(): void{
        this.started = true;
        console.log("Running tests");
        this.callOnFinish();
    }

    public setOnFinishCallback(callback: Function): void{
        this.onFinish = callback;
    }


}