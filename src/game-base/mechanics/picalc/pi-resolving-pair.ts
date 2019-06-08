import {PiResolvable} from "./pi-resolvable";
import {PiSymbol} from "./pi-symbol";
import {PiAction} from "./pi-action";

export class PiResolvingPair {
    public readonly left: PiResolvable;
    public leftAction: PiAction;
    public readonly right: PiResolvable;
    public rightAction: PiAction;

    public readonly resolvingChance;

    public constructor(left: PiResolvable, leftAction: PiAction, right: PiResolvable, rightAction: PiAction){
        this.left = left;
        this.leftAction = leftAction;
        this.right = right;
        this.rightAction = rightAction;
        this.resolvingChance = leftAction.resolvingChance * rightAction.resolvingChance;
    }

    public getLeftResolvedSymbol(): PiSymbol{
        this.leftAction = this.left.getAction(this.leftAction.getFullName());
        return this.leftAction.resolve(this.rightAction);
    }

    public getRightResolvedSymbol(): PiSymbol{
        this.rightAction = this.right.getAction(this.rightAction.getFullName());
        return this.rightAction.resolve(this.leftAction);
    }

    public contains(resolvable: PiResolvable){
        return this.left == resolvable || this.rightAction == resolvable;
    }
}