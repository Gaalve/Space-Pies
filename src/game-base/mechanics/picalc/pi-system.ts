import {PiSymbol} from "./pi-symbol";
import {PiSum} from "./pi-sum";
import {PiSystemAdd} from "./pi-system-add";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiResolvingPair} from "./pi-resolving-pair";
import {PiReplication} from "./pi-replication";
import {PiResolvable} from "./pi-resolvable";
import {PiAction} from "./pi-action";

export class PiSystem {

    private scene: Phaser.Scene;
    private findResolvingTimeOut: number;
    private resolveTimeOut: number;
    private cleanUpTimeOut: number;

    private reservedNames: string[][];

    // private existing: PiSymbol[];                   // all existing symbols; may get delete later

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


    private phase1changed: boolean;
    private phase2changed: boolean;
    private phase3changed: boolean;
    private deadlock: boolean;
    private onDeadlockFunction: Function;

    public constructor(scene: Phaser.Scene, findResolvingTimeOut: number,
                       resolveTimeOut: number, cleanUpTimeOut: number, enableDebugLogging: boolean){
        this.scene = scene;
        this.findResolvingTimeOut = findResolvingTimeOut;
        this.resolveTimeOut = resolveTimeOut;
        this.cleanUpTimeOut = cleanUpTimeOut;

        // this.existing = [];
        this.curChannelIn = [];
        this.curChannelOut = [];
        this.potentiallyResolving = [];
        this.curReplications = [];
        this.curSums = [];
        this.curActiveSymbols = [];
        this.activeSymbolsQueue = [];

        this.reservedNames = [];

        /**
         * Blocking
         * Potentially Resolving
         * Active (Triggering)
         * Removing
         */


        this.enableDebugLogging = enableDebugLogging;
        this.running = false;


        this.phase1changed = true;
        this.phase2changed = true;
        this.phase3changed = true;

        this.deadlock = false;
        this.onDeadlockFunction = ()=>{};
    }

    private indexOfReservedName(name: string): number{
        for(let idx = 0; idx < this.reservedNames.length; ++idx){
            if(this.reservedNames[idx][0] == name) return idx;
        }
        return -1;
    }

    public newReservedName(name: string): string{
        let idx = this.indexOfReservedName(name);
        let reservedName: string = undefined;
        if(idx > -1){
            let amount = this.reservedNames[idx].length;
            reservedName = name + '\'' + amount;
            this.reservedNames[idx].push(reservedName);
        }
        else{
            reservedName = name+'\'1';
            this.reservedNames.push([name, reservedName]);
        }
        return reservedName;
    }

    /**
     * Adds a symbol as concurrent term.
     * @param symbol
     */
    public pushSymbol(symbol: PiSymbol): void{
        this.phase1changed = true;
        this.phase3changed = true;
        this.deadlock = false;
        // if(this.existing.indexOf(symbol)==-1){ // TODO: can probably be removed
        //     this.existing.push(symbol);
        // }
        // else if (!(symbol instanceof PiTerm)){// exception for PiTerm (Recursions)
        //     console.log("Warning: Symbol already exists: "+symbol.getName());
        // }

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
        else if (resolvable instanceof PiReplication){ // prob a shitty workaround TODO
            // PiSystem.removeFromList(this.curReplications, resolvable);
            // resolvable.trigger();
        }
        else console.log("Error: Tried to move unknown Resolvable"); //TODO
        // this.curActiveSymbols.push(resolvable);
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
        else console.log("Error: Tried to find unknown Resolvable"); //TODO
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
            return;
        }
        this.moveResolvable(resolvablePair.left);
        this.moveResolvable(resolvablePair.right);

        this.curActiveSymbols.push(resolvablePair.leftAction);
        this.curActiveSymbols.push(resolvablePair.rightAction);

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
        let startT = this.scene.time.now;
        this.logPhase1();
        if(this.phase1changed) {
            this.phase1changed = false;
            this.deadlock = true;

            this.curChannelIn.forEach(
                (val1) => {
                    this.curChannelOut.forEach((val2) => {this.addAllResolvablePair(val1, val2);});
                    // this.curSums.forEach((val2) => {this.addAllResolvablePair(val1, val2);}); // Hehe performance drastically improved
                    this.curReplications.forEach((val2) => {this.addAllResolvablePair(val1, val2);});
                }
            );
            this.curChannelOut.forEach(
                (val1) => {
                    this.curSums.forEach((val2) => {this.addAllResolvablePair(val1, val2);});
                    this.curReplications.forEach((val2) => {this.addAllResolvablePair(val1, val2);});
                }
            );


            // TODO: maybe add a boolean to activated full simulation?
            // this.curSums.forEach(
            //     (val1, idx1) => {
            //         this.curSums.forEach((val2, idx2) => {if(idx1 != idx2)this.addAllResolvablePair(val1, val2);});
            //         this.curReplications.forEach((val2) => {this.addAllResolvablePair(val1, val2);});
            //     }
            // );
            // this.curReplications.forEach(
            //     (val1, idx1) => {
            //         this.curReplications.forEach((val2, idx2) => {if(idx1 != idx2)this.addAllResolvablePair(val1, val2);});
            //     }
            // );

            this.phase2changed = this.potentiallyResolving.length > 0;
        }
        let execTime = this.scene.time.now - startT;
        if (execTime < 0) console.warn("Phase 1 (Find) is taking too long");
        this.scene.time.delayedCall(this.resolveTimeOut - execTime, ()=>{this.phaseResolveActions()}, [], this);
    }


    private canResolveWithAnotherPair(pair: PiResolvingPair): boolean{
        if (!this.isResolvePairActive(pair)) return false;
        for (let idx in this.potentiallyResolving){
            let other = this.potentiallyResolving[idx];
            if (pair != other && this.isResolvePairActive(other) && other.resolvingChance > pair.resolvingChance){
                if (other.contains(pair.left) || other.contains(pair.right)) return true;
            }
        }
        return false;
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
        this.logPhase2();
        this.phase2changed = false;
        while(this.potentiallyResolving.length > 0){
            let randChance = Math.random();
            let randIdx = Math.floor(Math.random() * this.potentiallyResolving.length);
            let resolvablePair: PiResolvingPair = this.potentiallyResolving[randIdx];
            if (randChance < resolvablePair.resolvingChance || !this.canResolveWithAnotherPair(resolvablePair)) {
                this.resolve(resolvablePair);
                this.potentiallyResolving.splice(randIdx, 1);
            }
        }

        let execTime = this.scene.time.now - startT;
        if (execTime < 0) console.warn("Phase 2 (Resolve) is taking too long");
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
        this.logPhase3();
        this.phase3changed = false;
        let copy: PiSymbol[] = [];
        for(let idx in this.curActiveSymbols){
            copy.push(this.curActiveSymbols[idx]);
        }
        for(let idx in copy){ // shitty workaround TODO
            this.removeActiveSymbol(copy[idx]);
        }
        for(let idx in copy){ // shitty workaround TODO
            copy[idx].trigger();
        }


        for(let idx in this.activeSymbolsQueue){
            this.pushSymbol(this.activeSymbolsQueue[idx]);
        }
        this.activeSymbolsQueue = [];
        let execTime = this.scene.time.now - startT;
        if (execTime < 0) console.warn("Phase 3 (Trigger) is taking too long");
        if(this.deadlock) this.onDeadlock();
        if(this.running)this.scene.time.delayedCall(this.findResolvingTimeOut - execTime, ()=>{this.phaseFindResolvingActions()}, [], this);
    }

    private logPhase1(){
        if(!this.phase1changed || !this.enableDebugLogging)return;
        let allActiveSymbols: PiSymbol[] = [];
        allActiveSymbols = allActiveSymbols.concat(this.curActiveSymbols,
            this.curReplications, this.curChannelIn, this.curChannelOut, this.curSums);
        console.log('#### Current Active Symbols ####');
        for(let idx in allActiveSymbols){
            console.log(allActiveSymbols[idx].getSymbolSequence());
        }
        console.log('################################');
    }

    private logPhase2(){
        if(!this.phase2changed || !this.enableDebugLogging)return;
        console.log('#### Potentially Resolving ####');
        for(let idx in this.potentiallyResolving){
            console.log(this.potentiallyResolving[idx].left.getFullName() + " => " + this.potentiallyResolving[idx].right.getFullName());
        }
        console.log('################################');
    }

    private logPhase3(){
        if(!this.phase3changed || !this.enableDebugLogging)return;
        console.log('#### Triggering Symbols ####');
        for(let idx in this.curActiveSymbols){
            console.log(this.curActiveSymbols[idx].getFullName());
        }
        console.log('################################');
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

    public setOnDeadlockCallback(callback: Function): void{
        this.onDeadlockFunction = callback;
    }


    private onDeadlock(): void{
        this.onDeadlockFunction();
    }

    public getDebugLogState(): boolean{
        return this.enableDebugLogging;
    }

    public changeDebugLogger() : void{
        this.enableDebugLogging = !this.enableDebugLogging;
    }
}