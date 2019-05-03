import {PiAction} from "./pi-action";
import {PiSystem} from "./pi-system";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";

export abstract class PiReplication extends PiAction{
    private constructor(system: PiSystem, isInput: boolean, name: string, inOutPut: string){
        super(system, "REPLICATION[DEV]", "[NONE]", true);
        if(isInput){
            this.next = new PiChannelIn(system, name, inOutPut);
        }
        else{
            this.next = new PiChannelOut(system, name, inOutPut);
        }
    }

    // public static replicationOnIn(system: PiSystem, name: string, input: string): PiReplication{
    //     return new this(system, true, name, input);
    // }
    //
    // public static replicationOnOut(system: PiSystem, name: string, output: string): PiReplication{
    //     return new this(system, false, name, output);
    // }


}