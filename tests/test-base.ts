import {TestEnvironment} from "./test-environment";

export class TestBase {

    private environment: TestEnvironment;
    private succeeded: boolean;
    private statusSet: boolean;
    private name: string;

    public constructor(environment: TestEnvironment, name: string, timeout: number){
        this.environment = environment;
        this.name = name;
        /*if (timeout > 0){
            // TODO timeout
        }*/
        this.environment.addTest(this);
        this.succeeded = false;
        this.statusSet = false;
    }

    // getter methods

    public getSucceeded(): boolean{
        return this.succeeded;
    }

    // setter methods

    public setState(succeeded): void{
        if(!this.statusSet){
            this.succeeded = succeeded;
            this.statusSet = true;
            this.environment.finishTest(this, this.succeeded);
        }
    }

    // assisting methoda

    public success(): void{
        this.setState(true);
    }

    public fail(): void{
        this.setState(false);
    }

    public getStateAsMessage(): string{
        if(!this.statusSet) return 'Test \"'+this.name+'\": in progress';
        return 'Test \"'+this.name+'\": '+ (this.succeeded ? 'success' : 'fail');
    }
}