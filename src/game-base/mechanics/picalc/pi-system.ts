import {PiSymbol} from "./pi-symbol";
import {PiAction} from "./pi-action";
import {PiTerm} from "./pi-term";
import {PiSum} from "./pi-sum";
import {PiSystemAdd} from "./pi-system-add";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiResolving} from "./pi-resolving";

export class PiSystem {

    private scene: Phaser.Scene;
    private findResolvingTimeOut: number;
    private resolveTimeOut: number;
    private cleanUpTimeOut: number;


    private existing: PiSymbol[];                   // all existing symbols
    private currentSums: PiSum[];
    private terms: PiTerm[];                        // all defined pi-terms
    private currentActions: PiAction[];             // all current Actions that are be blocking
    private potentialTriggeringActions: PiResolving[]; // all current Actions that can be resolved
    private active: PiSymbol[];                     // current Symbols that will get triggered in the cleanUpPhase

    public add = new PiSystemAdd(this);
    private running;

    public constructor(scene: Phaser.Scene, findResolvingTimeOut: number,
                       resolveTimeOut: number, cleanUpTimeOut: number){
        this.scene = scene;
        this.findResolvingTimeOut = findResolvingTimeOut;
        this.resolveTimeOut = resolveTimeOut;
        this.cleanUpTimeOut = cleanUpTimeOut;

        this.existing = [];
        this.currentSums = [];
        this.terms = [];
        this.currentActions = [];
        this.potentialTriggeringActions = [];
        this.active = [];

        this.running = false;

    }

    // public add: NextSymbol;

    public addSymbol(symbol: PiSymbol): void{
        if(this.existing.indexOf(symbol)==-1){
            this.existing.push(symbol);
        }
        else {
            console.log("Symbol already exists: "+symbol.getName());
        }
        if (symbol instanceof PiAction){
            this.currentActions.push(symbol);
        }
        else if (symbol instanceof PiSum){
            this.currentSums.push(symbol);
        }
        else {
            this.active.push(symbol);
        }
    }

    private canResolve(resolve: PiResolving){
        return this.currentActions.indexOf(resolve.chanIn)>-1 && this.currentActions.indexOf(resolve.chanOut)>-1
    }

    private removeCurrentAction(action: PiAction): void{
        let idx: number = this.currentActions.indexOf(action, 0);
        if(idx == -1){
            console.log("Error! removed Action that is not active");
        }
        else {
            this.currentActions.splice(idx, 1);
        }
    }

    private removeActive(symbol: PiSymbol): void{
        let idx: number = this.active.indexOf(symbol, 0);
        if(idx == -1){
            console.log("Error! removed Symbol that is not active");
        }
        else {
            this.active.splice(idx, 1);
        }
    }

    public resolveAction(chanIn: PiChannelIn, chanOut: PiChannelOut): void{
        this.removeCurrentAction(chanIn);
        this.removeCurrentAction(chanOut);
        this.addSymbol(chanIn.resolve(chanOut.getOutputName()));
        this.addSymbol(chanOut.resolve());
    }

    private phaseFindResolvingActions(): void{
        let startT = this.scene.time.now;
        /** Idee:
         * + finde alle out-channels und in-channels und packe diese in jeweilige Listen
         * + vergleiche namen von in- und out-channels
         * + bei namensgleichheit erstelle pi-resolving
         */

        let ins: PiChannelIn[] = [];
        let outs: PiChannelOut[] = [];
        for (let idx in this.currentActions){
            console.log("FindResolving: "+this.currentActions[idx].getSymbolSequence());
            if(this.currentActions[idx] instanceof PiChannelIn) ins.push(this.currentActions[idx]);
            else if(this.currentActions[idx] instanceof PiChannelOut) outs.push(this.currentActions[idx]);
        }

        for (let idxIn in ins){
            let curIn: PiChannelIn = ins[idxIn];
            for (let idxOut in outs){
                let curOut: PiChannelIn = outs[idxIn];
                if(curIn.getName() == curOut.getName()) this.potentialTriggeringActions.push(new PiResolving(curIn, curOut));
            }
        }


        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.resolveTimeOut - execTime, ()=>{this.phaseResolveActions()}, [], this);
    }

    private phaseResolveActions(): void{
        let startT = this.scene.time.now;

        /** Idee:
         * + nimm zufälligen resolving-container
         */

        while(this.potentialTriggeringActions.length > 0){
            let randIdx = Math.floor(Math.random() * this.potentialTriggeringActions.length);
            console.log("Resolving: "+this.potentialTriggeringActions[randIdx].chanIn.getSymbolSequence());
            console.log("and: "+this.potentialTriggeringActions[randIdx].chanOut.getSymbolSequence());
            let resolve: PiResolving = this.potentialTriggeringActions[randIdx];
            if(this.canResolve(resolve)) resolve.resolve(this);
            this.potentialTriggeringActions.splice(randIdx, 1);
        }


        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.cleanUpTimeOut - execTime, ()=>{this.phaseCleanUpActive()}, [], this);

    }

    private phaseCleanUpActive(): void{
        let startT = this.scene.time.now;
        for(let idx in this.active){
            //console.log("Triggering: "+this.active[idx].getSymbolSequence());
            this.active[idx].trigger();
            this.removeActive(this.active[idx]);
        }

        let execTime = this.scene.time.now - startT;
        if(this.running)this.scene.time.delayedCall(this.findResolvingTimeOut - execTime, ()=>{this.phaseFindResolvingActions()}, [], this);
    }

    public start(): void{
        console.log("Starting Pi-Calc-Simulation");
        this.running = true;
        this.scene.time.delayedCall(this.findResolvingTimeOut, ()=>{this.phaseCleanUpActive()}, [], this);
    }

    public stop(): void{
        this.running = false;
    }

}