import {PiSymbol} from "./pi-symbol";
import {PiSum} from "./pi-sum";
import {PiSystemAdd} from "./pi-system-add";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiResolving} from "./pi-resolving";
import {PiReplication} from "./pi-replication";

export class PiSystem {

    private scene: Phaser.Scene;
    private findResolvingTimeOut: number;
    private resolveTimeOut: number;
    private cleanUpTimeOut: number;


    private existing: PiSymbol[];                   // all existing symbols; may get delete later

    private curChannelIn: PiChannelIn[];
    private curChannelOut: PiChannelOut[];
    private potentialResolving: PiResolving[]; // all current Channels that can be resolved
    private curReplications: PiReplication[];
    private curSums: PiSum[];
    private curActiveSymbols: PiSymbol[];  // current Symbols that will get triggered in the cleanUpPhase
    private activeSymbolsQueue: PiSymbol[];


    public add = new PiSystemAdd(this);
    private running;

    public constructor(scene: Phaser.Scene, findResolvingTimeOut: number,
                       resolveTimeOut: number, cleanUpTimeOut: number){
        this.scene = scene;
        this.findResolvingTimeOut = findResolvingTimeOut;
        this.resolveTimeOut = resolveTimeOut;
        this.cleanUpTimeOut = cleanUpTimeOut;

        this.existing = [];
        this.curChannelIn = [];
        this.curChannelOut = [];
        this.potentialResolving = [];
        this.curReplications = [];
        this.curSums = [];
        this.curActiveSymbols = [];
        this.activeSymbolsQueue = [];

        this.running = false;

    }

    public addSymbol(symbol: PiSymbol): void{
        if(this.existing.indexOf(symbol)==-1){
            this.existing.push(symbol);
        }
        else {
            console.log("Symbol already exists: "+symbol.getName());
        }
        if (symbol instanceof PiChannelIn){
            this.curChannelIn.push(symbol);
        }
        else if (symbol instanceof PiChannelOut){
            this.curChannelOut.push(symbol);
        }
        else if (symbol instanceof PiSum){
            this.curSums.push(symbol);
        }
        else if (symbol instanceof PiReplication){
            this.curReplications.push(symbol);
        }
        else {
            this.curActiveSymbols.push(symbol);
        }
    }

    /**
     * Returns true if both channels are active.
     * @param resolve - The container of an input and output channel.
     */
    private canResolve(resolve: PiResolving){
        return this.curChannelIn.indexOf(resolve.chanIn)>-1 &&
            this.curChannelOut.indexOf(resolve.chanOut)>-1
    }


    private removeActiveSymbol(symbol: PiSymbol): void{
        let idx: number = this.curActiveSymbols.indexOf(symbol, 0);
        if(idx == -1){
            console.log("Error! Removed Action that is not active");
        }
        else {
            this.curActiveSymbols.splice(idx, 1);
        }
    }

    private moveActiveChannelIn(chanIn: PiChannelIn): void{
        let idx: number = this.curChannelIn.indexOf(chanIn, 0);
        if(idx == -1){
            console.log("Error! Removed Symbol that is not active");
        }
        else {
            this.curChannelIn.splice(idx, 1);
        }
        this.curActiveSymbols.push(chanIn);
    }

    private moveActiveChannelOut(chanOut: PiChannelOut): void{
        let idx: number = this.curChannelOut.indexOf(chanOut, 0);
        if(idx == -1){
            console.log("Error! Removed Symbol that is not active");
        }
        else {
            this.curChannelOut.splice(idx, 1);
        }
        this.curActiveSymbols.push(chanOut);
    }

    public resolveAction(chanIn: PiChannelIn, chanOut: PiChannelOut): void{
        this.moveActiveChannelIn(chanIn);
        this.moveActiveChannelOut(chanOut);


        this.activeSymbolsQueue.push(chanIn.resolve(chanOut.getOutputName()));
        this.activeSymbolsQueue.push(chanOut.resolve());
    }

    private phaseFindResolvingActions(): void{
        let startT = this.scene.time.now;
        /** Idee:
         * + finde alle out-channels und in-channels und packe diese in jeweilige Listen
         * + vergleiche namen von in- und out-channels
         * + bei namensgleichheit erstelle pi-resolving
         */

        for (let idxIn in this.curChannelIn){
            let curIn: PiChannelIn = this.curChannelIn[idxIn];
            for (let idxOut in this.curChannelOut){
                let curOut: PiChannelIn = this.curChannelOut[idxIn];
                if(curIn.getName() == curOut.getName()) this.potentialResolving.push(new PiResolving(curIn, curOut));
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

        while(this.potentialResolving.length > 0){
            let randIdx = Math.floor(Math.random() * this.potentialResolving.length);
            console.log("Resolving: "+this.potentialResolving[randIdx].chanIn.getSymbolSequence());
            console.log("and: "+this.potentialResolving[randIdx].chanOut.getSymbolSequence());
            let resolve: PiResolving = this.potentialResolving[randIdx];
            if(this.canResolve(resolve)) resolve.resolve(this);
            this.potentialResolving.splice(randIdx, 1);
        }


        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.cleanUpTimeOut - execTime, ()=>{this.phaseCleanUpActive()}, [], this);

    }

    private phaseCleanUpActive(): void{
        let startT = this.scene.time.now;
        for(let idx in this.curActiveSymbols){
            console.log("Triggering Symbol: " + this.curActiveSymbols[idx].getFullName());
            this.curActiveSymbols[idx].trigger();
            this.removeActiveSymbol(this.curActiveSymbols[idx]);
        }

        for(let idx in this.activeSymbolsQueue){
            this.addSymbol(this.activeSymbolsQueue[idx]);
        }
        this.activeSymbolsQueue = [];
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