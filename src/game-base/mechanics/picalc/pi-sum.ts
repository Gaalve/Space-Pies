import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";
import {PiResolvable} from "./pi-resolvable";
import {PiSymbol} from "./pi-symbol";


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
}