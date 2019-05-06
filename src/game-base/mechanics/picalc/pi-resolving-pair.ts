import {PiChannelOut} from "./pi-channel-out";
import {PiResolvable} from "./pi-resolvable";
import {PiSymbol} from "./pi-symbol";
import {PiAction} from "./pi-action";

export class PiResolvingPair {
    public readonly left: PiResolvable;
    public readonly leftAction: PiAction;
    public readonly right: PiResolvable;
    public readonly rightAction: PiAction;
    public constructor(left: PiResolvable, leftAction: PiAction, right: PiResolvable, rightAction: PiAction){
        this.left = left;
        this.leftAction = leftAction;
        this.right = right;
        this.rightAction = rightAction;
    }

    public getLeftResolvedSymbol(): PiSymbol{
        return this.leftAction.resolve(this.rightAction);

    }

    public getRightResolvedSymbol(): PiSymbol{
        return this.rightAction.resolve(this.leftAction);
    }
}