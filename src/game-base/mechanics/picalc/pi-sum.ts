import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";
import {PiResolvable} from "./pi-resolvable";
import {PiScope} from "./pi-scope";
import {PiChannelOut} from "./pi-channel-out";


export class PiSum extends PiResolvable{

    actions: PiAction[];

    public constructor(system: PiSystem, actions: PiAction[]){
        super(system, "PiSum");
        this.actions = actions;
        // this.checkForNameEquality(); // only for debugging
    }

    public getSymbolSequence(): string{
        let str = "(";
        let idx: number;
        for(idx = 0; idx < this.actions.length - 1; ++idx){
            str += this.actions[idx].getSymbolSequence();
            str += " + ";
        }
        str += this.actions[idx].getSymbolSequence();
        return str + ")";
    }

    private checkForNameEquality(){
        for(let idx1 in this.actions){
            // if (this.actions[idx1] instanceof PiChannelOut) throw new Error('We do not want output channels in sums (so we can improve the perf)'); // For debugging
            for(let idx2 in this.actions){
                if(idx1 != idx2 &&
                    this.actions[idx1].getName() == this.actions[idx2].getName()){
                    console.log("Error: equal names!");
                }
            }
        }
    }

    public getFullName(): string {
        return this.getSymbolSequence();
    }

    getAllActions(): PiAction[] {
        return this.actions;
    }

    public copy(): PiSum{
        let actionsCopy = [];
        for (let idx in this.actions){
            actionsCopy.push(this.actions[idx].copy());
        }
        return new PiSum(this.system, actionsCopy);
    }

    rename(argName: string, argValue: string): void {
        for(let idx in this.actions){
            this.actions[idx].rename(argName, argValue);
        }
    }

    addScope(scope: PiScope): void {
        for(let idx in this.actions){
            this.actions[idx].addScope(scope);
        }
    }

    alphaRename(argName: string, argValue: string, scope: PiScope): void {
        for(let idx in this.actions){
            this.actions[idx].alphaRename(argName, argValue, scope);
        }
    }

    public getAction(fullName: string): PiAction {
        for (let idx in this.actions){
            if(this.actions[idx].getFullName() == fullName) return this.actions[idx];
        }
        throw new Error("Can't find action.");
    }

    isNameInSequence(name: string): boolean {
        for (let idx in this.actions){
            if(this.actions[idx].isNameInSequence(name)) return true;
        }
        return false;
    }

}