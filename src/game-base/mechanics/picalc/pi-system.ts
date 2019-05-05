import {PiSymbol} from "./pi-symbol";
import {PiSum} from "./pi-sum";
import {PiSystemAdd} from "./pi-system-add";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiResolvingPair} from "./pi-resolving-pair";
import {PiReplication} from "./pi-replication";
import {PiResolvable} from "./pi-resolvable";
import {PiTerm} from "./pi-term";

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

    private enableDebugLogging: boolean;

    public add = new PiSystemAdd(this);

    private running;

    public constructor(scene: Phaser.Scene, findResolvingTimeOut: number,
                       resolveTimeOut: number, cleanUpTimeOut: number, enableDebugLogging: boolean){
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


        this.enableDebugLogging = enableDebugLogging;
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
        else if (!(symbol instanceof PiTerm)){
            console.log("Warning: Symbol already exists: "+symbol.getName());
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
        PiSystem.removeFromList(this.curActiveSymbols, symbol);
    }

    /**
     * Removes the item from the list or prints a warning to the console, if it is not contained within the list.
     * @param list
     * @param item
     */
    private static removeFromList(list: any[], item: any): void{
        let idx: number = list.indexOf(item, 0);
        if(idx == -1){
            console.log("Warning! Symbol is not active");
        }
        else {
            list.splice(idx, 1);
        }
    }

    /**
     * Returns the index of the item or -1, if it is not contained within the list.
     * @param list
     * @param item
     */
    private static containedInList(list: any[], item: any): boolean{
        return list.indexOf(item, 0) > -1;
    }

    /**
     * Moves the resolvable to curActiveSymbols (marks it as not active)
     * @param resolvable
     */
    private moveResolvable(resolvable: PiResolvable){
        if (resolvable instanceof PiChannelIn) PiSystem.removeFromList(this.curChannelIn, resolvable);
        else if (resolvable instanceof PiChannelOut) PiSystem.removeFromList(this.curChannelOut, resolvable);
        else if (resolvable instanceof PiSum) PiSystem.removeFromList(this.curSums, resolvable);
        else if (resolvable instanceof PiReplication) PiSystem.removeFromList(this.curReplications, resolvable);
        else console.log("Error: Tried to move unknown Resolvable");
        this.curActiveSymbols.push(resolvable);
    }


    /**
     * Return true if the resolbable is active.
     * @param resolvable
     */
    private isResolvableActive(resolvable: PiResolvable): boolean{
        if (resolvable instanceof PiChannelIn) return PiSystem.containedInList(this.curChannelIn, resolvable);
        else if (resolvable instanceof PiChannelOut) return PiSystem.containedInList(this.curChannelOut, resolvable);
        else if (resolvable instanceof PiSum) return PiSystem.containedInList(this.curSums, resolvable);
        else if (resolvable instanceof PiReplication) return PiSystem.containedInList(this.curReplications, resolvable);
        else console.log("Error: Tried to find unknown Resolvable");
        return false;
    }

    /**
     * Returns true if both resolvables are currently active.
     * @param resolvablePair
     */
    private isResolvePairActive(resolvablePair: PiResolvingPair): boolean{
        return this.isResolvableActive(resolvablePair.left) && this.isResolvableActive(resolvablePair.right);
    }


    /**
     * Resolves to channels. Should only be called by pi-resolving!
     * @param resolvablePair
     */
    private resolve(resolvablePair: PiResolvingPair): void{

        if(!this.isResolvePairActive(resolvablePair)) {
            // if(this.enableDebugLogging ) console.log("Can not resolve pair: not active: "+resolvablePair.left.getFullName()+" and "+resolvablePair.right.getFullName());
            return;
        }
        this.moveResolvable(resolvablePair.left);
        this.moveResolvable(resolvablePair.right);

        this.activeSymbolsQueue.push(resolvablePair.getLeftResolvedSymbol());
        this.activeSymbolsQueue.push(resolvablePair.getRightResolvedSymbol());
    }


    private addAllResolvablePair(left: PiResolvable, right: PiResolvable): void{
        let actionsLeft = left.getAllActions();
        let actionsRight = right.getAllActions();

        for(let leftIdx in actionsLeft){
            let lAction = actionsLeft[leftIdx];
            for (let rightIdx in actionsRight){
                let rAction = actionsRight[rightIdx];
                if(lAction.canResolve(rAction)){
                    this.potentiallyResolving.push(new PiResolvingPair(left, lAction, right, rAction));
                }
            }
        }

    }

    /**
     * First phase:
     *
     * Find blocking input and output channels and add the as potentially resolving channels
     *
     * Calls the second phase.
     */
    private phaseFindResolvingActions(): void{
        // if(this.enableDebugLogging) console.log("phase 1");
        let startT = this.scene.time.now;

        let allResolvables: PiResolvable[] = [];
        allResolvables = allResolvables.concat(this.curChannelIn, this.curChannelOut, this.curSums, this.curReplications);
        for (let i = 0; i < allResolvables.length; i++) {
            for (let j = 0; j < allResolvables.length; j++) {
                if(i != j){
                    this.addAllResolvablePair(allResolvables[i], allResolvables[j]);
                }
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
        // if(this.enableDebugLogging) console.log("phase 2");
        let startT = this.scene.time.now;

        while(this.potentiallyResolving.length > 0){
            let randIdx = Math.floor(Math.random() * this.potentiallyResolving.length);
            if (this.enableDebugLogging) console.log("Resolving: "+this.potentiallyResolving[randIdx].left.getSymbolSequence());
            if (this.enableDebugLogging) console.log("and: "+this.potentiallyResolving[randIdx].right.getSymbolSequence());
            let resolvablePair: PiResolvingPair = this.potentiallyResolving[randIdx];
            this.resolve(resolvablePair);
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
        // if(this.enableDebugLogging) console.log("phase 3");
        let startT = this.scene.time.now;
        for(let idx in this.curActiveSymbols){
            if (this.enableDebugLogging) console.log("Triggering Symbol: " + this.curActiveSymbols[idx].getFullName());
            this.curActiveSymbols[idx].trigger();
            this.removeActiveSymbol(this.curActiveSymbols[idx]);
        }

        for(let idx in this.activeSymbolsQueue){
            if (this.enableDebugLogging) console.log("Adding Symbol to active from queue: " + this.activeSymbolsQueue[idx].getFullName());
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
        if (this.enableDebugLogging) console.log("Starting Pi-Calc-Simulation");
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