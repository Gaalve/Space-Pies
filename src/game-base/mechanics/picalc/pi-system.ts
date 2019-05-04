import {PiSymbol} from "./pi-symbol";
import {PiSum} from "./pi-sum";
import {PiSystemAdd} from "./pi-system-add";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiResolvingPair} from "./pi-resolving-pair";
import {PiReplication} from "./pi-replication";
import {PiResolvable} from "./pi-resolvable";

export class PiSystem {

    private scene: Phaser.Scene;
    private findResolvingTimeOut: number;
    private resolveTimeOut: number;
    private cleanUpTimeOut: number;


    private existing: PiSymbol[];                   // all existing symbols; may get delete later

    private curChannelIn: PiChannelIn[];
    private curChannelOut: PiChannelOut[];
    private potentiallyResolving: PiResolvingPair[]; // all current Channels that can be resolved
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
        this.potentiallyResolving = [];
        this.curReplications = [];
        this.curSums = [];
        this.curActiveSymbols = [];
        this.activeSymbolsQueue = [];

        /**
         * Blocking
         * Potentially Resolving
         * Active (Triggering)
         * Removing
         */


        this.running = false;

    }

    /**
     * Adds a symbol as concurrent term.
     * @param symbol
     */
    public addSymbol(symbol: PiSymbol): void{
        if(this.existing.indexOf(symbol)==-1){
            this.existing.push(symbol);
        }
        else {
            console.log("Symbol already exists: "+symbol.getName());
        }
        if (symbol instanceof PiChannelIn) this.curChannelIn.push(symbol);
        else if (symbol instanceof PiChannelOut) this.curChannelOut.push(symbol);
        else if (symbol instanceof PiSum) this.curSums.push(symbol);
        else if (symbol instanceof PiReplication) this.curReplications.push(symbol);
        else this.curActiveSymbols.push(symbol);
    }


    /**
     * Remove active symbol from the list. Should be used after the symbol got triggered.
     * @param symbol
     */
    private removeActiveSymbol(symbol: PiSymbol): void{
        // let idx: number = this.curActiveSymbols.indexOf(symbol, 0);
        // if(idx == -1){
        //     console.log("Error! Symbol is not active");
        // }
        // else {
        //     this.curActiveSymbols.splice(idx, 1);
        // }
        PiSystem.removeFromList(this.curActiveSymbols, symbol);
    }


    private static removeFromList(list: any[], item: any){
        let idx: number = list.indexOf(item, 0);
        if(idx == -1){
            console.log("Error! Symbol is not active");
        }
        else {
            list.splice(idx, 1);
        }
    }

    private moveResolvable(resolvable: PiResolvable){
        if (resolvable instanceof PiChannelIn) PiSystem.removeFromList(this.curChannelIn, resolvable);
        else if (resolvable instanceof PiChannelOut) PiSystem.removeFromList(this.curChannelOut, resolvable);
        else if (resolvable instanceof PiSum) PiSystem.removeFromList(this.curSums, resolvable);
        else console.log("Error: Tried to move unknown Resolvable");
        this.curActiveSymbols.push(resolvable);
    }



    /**
     * Resolves to channels. Should only be called by pi-resolving!
     * @param resolvablePair
     */
    private resolve(resolvablePair: PiResolvingPair): void{
        this.moveResolvable(resolvablePair.left);
        this.moveResolvable(resolvablePair.right);

        this.activeSymbolsQueue.push(resolvablePair.getLeftResolvedSymbol());
        this.activeSymbolsQueue.push(resolvablePair.getRightResolvedSymbol());
    }

    /**
     * First phase:
     *
     * Find blocking input and output channels and add the as potentially resolving channels
     *
     * Calls the second phase.
     */
    private phaseFindResolvingActions(): void{
        let startT = this.scene.time.now;
        for (let idxIn in this.curChannelIn){
            let curIn: PiChannelIn = this.curChannelIn[idxIn];
            for (let idxOut in this.curChannelOut){
                let curOut: PiChannelIn = this.curChannelOut[idxIn];
                if(curIn.getName() == curOut.getName()) this.potentiallyResolving.push(new PiResolvingPair(curIn, curOut));
            }
        }
        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.resolveTimeOut - execTime, ()=>{this.phaseResolveActions()}, [], this);
    }

    /**
     * Second phase:
     *
     * 1. Pick a random pair of potentially resolving channels,
     * 2. Check if both of them are unresolved:
     *      2.1 If true: resolve the pair:
     *      2.1.1 Move the pair from curChannel to activeSymbols (marks both channels as resolved)
     *      2.1.2 Add the following symbol of both channels to activeSymbolQueue
     * 3. Remove the pair
     * 4. Repeat until no potentially resolving channels exists.
     *
     * Calls the third phase.
     */
    private phaseResolveActions(): void{
        let startT = this.scene.time.now;

        while(this.potentiallyResolving.length > 0){
            let randIdx = Math.floor(Math.random() * this.potentiallyResolving.length);
            console.log("Resolving: "+this.potentiallyResolving[randIdx].left.getSymbolSequence());
            console.log("and: "+this.potentiallyResolving[randIdx].right.getSymbolSequence());
            let resolvablePair: PiResolvingPair = this.potentiallyResolving[randIdx];
            if(resolvablePair.canResolve()) this.resolve(resolvablePair);
            this.potentiallyResolving.splice(randIdx, 1);
        }

        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.cleanUpTimeOut - execTime, ()=>{this.phaseTriggerSymbols()}, [], this);
    }

    /**
     * Third phase:
     *
     * 1. Trigger all active symbols
     *      1.1 Processes will call their callback function
     *      1.2 Every other Symbol will do nothing
     * 2. Delete triggered symbols
     * 3. Add Symbols from activeSymbolsQueue to curActiveSymbols (make Symbols active)
     *
     * Calls the first phase.
     */
    private phaseTriggerSymbols(): void{
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

    /**
     * Starts the Pi-Calc-System by calling the first phase.
     */
    public start(): void{
        console.log("Starting Pi-Calc-Simulation");
        this.running = true;
        this.scene.time.delayedCall(this.findResolvingTimeOut, ()=>{this.phaseFindResolvingActions()}, [], this);
    }

    /**
     * Stops the Pi-Calc-System after the third phase has ended.
     */
    public stop(): void{
        this.running = false;
    }

}