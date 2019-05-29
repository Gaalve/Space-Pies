import {PiSymbol} from "./pi-symbol";
import {PiSystem} from "./pi-system";
import {PiProcess} from "./pi-process";
import {PiResolvable} from "./pi-resolvable";
import {PiScope} from "./pi-scope";

export abstract class PiAction extends PiResolvable{
    protected next: PiSymbol;
    protected inOutPut: string;
    protected isInput: boolean;

    protected isNameScoped: boolean;
    protected isOutputScoped: boolean;

    protected callback: (resolvedName?: string, attachmentOfResolved?: any) => any;

    public attachment;
    public attachmentOfResolved;

    protected constructor(system: PiSystem, name: string, inOutPut: string, isInput: boolean){
        super(system, name.toLowerCase());
        this.inOutPut = inOutPut;
        this.next = new PiProcess(system);
        this.isInput = isInput;
        this.isNameScoped = false;
        this.isOutputScoped = false;
        this.callback = ()=>{};
    }


    public abstract getSymbolSequence(): string;


    public setNextSymbol(symbol: PiSymbol): void{
        this.next = symbol;
    }

    /**
     * Renames the channel name and/or output name to argValue, if they equal argName.
     * Forwards parameters to next symbol.
     * @param argName the name that received the name (argValue)
     * @param argValue the bound name
     *
     * Recap: only free names can be bound, see ./src/game-base/docs/Pi-Kalkül-Doc.pdf, Section: Freie und Gebundene Namen.
     */


    public abstract canResolve(other: PiAction): boolean;

    public abstract resolve(other: PiAction): PiSymbol;

    public getOutputName(): string{
        return this.inOutPut;
    }

    public abstract copy(): PiAction;

    public _getNext(): PiSymbol{
        return this.next;
    }

    public rename(argName: string, argValue: string): void{
        if(this.name == argName && !this.isNameScoped) this.name = argValue;
        if(!this.isInput && this.inOutPut == argName && !this.isOutputScoped) this.inOutPut = argValue;
        this.next.rename(argName, argValue);
    }

    public alphaRename(argName: string, argValue: string, scope: PiScope): void {
        // console.log('Alpha Rename: '+argName+" => "+argValue);
        if(argName == this.name && (this.scopes.indexOf(scope) > -1 || !this.isNameScoped))this.name = argValue;
        if(argName == this.inOutPut && (this.scopes.indexOf(scope) > -1 || !this.isNameScoped))this.inOutPut = argValue;
        this.next.alphaRename(argName, argValue, scope);
    }

    public addScope(scope: PiScope): void {
        if(this.name == scope.scopedName){
            this.isNameScoped = true;
            this.scopes.push(scope);
        }
        else if (this.inOutPut == scope.scopedName){
            this.isOutputScoped = true;
            this.scopes.push(scope);
        }
    }

    public getAction(fullName: string): PiAction {
        if(this.getFullName() == fullName) return this;
        throw new Error("Can't find action. this: "+this.getFullName()+ " other: "+fullName );
    }

    public setCallback(callback: (resolvedName?: string, attachmentOfResolved?: any) => any){
        this.callback = callback;
    }

    trigger(): void {
        super.trigger();
        this.callback(undefined, this.attachmentOfResolved);
    }
}