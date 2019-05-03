import {PiSymbol} from "./pi-symbol";
import {PiAction} from "./pi-action";
import {PiTerm} from "./pi-term";
import {PiChannelIn} from "./pi-channel-in";
import {PiChannelOut} from "./pi-channel-out";
import {PiProcess} from "./pi-process";
import {PiSum} from "./pi-sum";

export class PiSystem {

    static NextSymbol = class{
        private system: PiSystem;
        private action: PiAction;

        constructor(system: PiSystem, action: PiAction){
            this.system = system;
            this.action = action;
        }

        private nextAction(action: PiAction): this{
            this.action.nextSymbol(action);
            this.action = action;
            return this;
        }

        public channelIn(name: string): this{
            return this.nextAction(new PiChannelIn(this.system, name))
        }

        public channelOut(name: string): this{
            return this.nextAction(new PiChannelOut(this.system, name))
        }

        public process(name: string, callback: Function): void{
            this.action.nextSymbol(new PiProcess(this.system, name, callback));
        }

    };



    private scene: Phaser.Scene;
    private findResolvingTimeOut: number;
    private resolveTimeOut: number;
    private cleanUpTimeOut: number;


    private existing: PiSymbol[];                   // all existing symbols
    private currentSums: PiSum[];
    private terms: PiTerm[];                        // all defined pi-terms
    private currentActions: PiAction[];             // all current Actions that are be blocking
    private potentialTriggeringActions: PiAction[]; // all current Actions that can be resolved
    private active: PiSymbol[];                     // current Symbols that will get triggered in the cleanUpPhase


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

    }


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

    private phaseFindResolvingActions(): void{
        let startT = this.scene.time.now;
        /** Idee:
         * + finde alle out-channels und in-channels und packe diese in jeweilige Listen
         * + vergleiche namen von in- und out-channels
         * + bei namensgleichheit erstelle pi-resolving
         * + füge restliche symbole mit gleichen namen zu pi-resolving hinzu
         */
        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.resolveTimeOut - execTime, ()=>{this.phaseResolveActions()}, [], this);
    }

    private phaseResolveActions(): void{
        let startT = this.scene.time.now;

        /** Idee:
         * + nimm zufälligen resolving-container
         */

        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.cleanUpTimeOut - execTime, ()=>{this.phaseCleanUpActive()}, [], this);
    }

    private phaseCleanUpActive(): void{
        let startT = this.scene.time.now;

        let execTime = this.scene.time.now - startT;
        this.scene.time.delayedCall(this.findResolvingTimeOut - execTime, ()=>{this.phaseFindResolvingActions()}, [], this);
    }

}