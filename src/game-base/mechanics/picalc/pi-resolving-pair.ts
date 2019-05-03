import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiSystem} from "./pi-system";

export class PiResolvingPair {
    public readonly chanIn: PiChannelIn;
    public readonly chanOut: PiChannelOut
    public constructor(chanIn: PiChannelIn, chanOut: PiChannelOut){
        this.chanIn = chanIn;
        this.chanOut = chanOut;
    }

    public resolve(system: PiSystem){
        system.resolveAction(this.chanIn, this.chanOut);
    }
}