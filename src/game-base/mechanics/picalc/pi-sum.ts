import {PiSymbol} from "./pi-symbol";
import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";
import {PiResolvable} from "./pi-resolvable";


export class PiSum extends PiResolvable{

    actions: PiAction[];

    public constructor(system: PiSystem, actions: PiAction[]){
        super(system, "PiSum");
        this.actions = actions;
        this.checkForNameEquality();
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

    private getResolvableIndex(other: PiResolvable){
        for (let i = 0; i < this.actions.length; i++) {
            if (this.actions[i].canResolve(other))return i;
        }
        return -1;
    }

    public canResolve(other: PiResolvable): boolean {
        return this.getResolvableIndex(other) > -1;
    }

    public resolve(other: PiResolvable): PiSymbol {
        return undefined;
    }
}