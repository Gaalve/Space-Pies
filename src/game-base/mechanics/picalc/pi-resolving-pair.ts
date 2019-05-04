import {PiChannelOut} from "./pi-channel-out";
import {PiResolvable} from "./pi-resolvable";
import {PiSymbol} from "./pi-symbol";

export class PiResolvingPair {
    public readonly left: PiResolvable;
    public readonly right: PiResolvable
    public constructor(left: PiResolvable, right: PiResolvable){
        this.left = left;
        this.right = right;
    }

    public canResolve(): boolean{
        return this.left.canResolve(this.right) && this.right.canResolve(this.left);
    }

    public getLeftResolvedSymbol(): PiSymbol{
        return this.left.resolve(this.right);
    }

    public getRightResolvedSymbol(): PiSymbol{
        return this.right.resolve(this.left);
    }
}