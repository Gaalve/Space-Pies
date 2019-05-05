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

    protected constructor(system: PiSystem, name: string, inOutPut: string, isInput: boolean){
        super(system, name.toLowerCase());
        this.inOutPut = inOutPut;
        this.next = new PiProcess(system);
        this.isInput = isInput;
        this.isNameScoped = false;
        this.isOutputScoped = false;
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

    private unsafeRename(argName: string, argValue: string): void{
        if(this.name == argName){
            this.name = argValue;
        }
        if(!this.isInput && this.inOutPut == argName){
            this.inOutPut = argValue;
        }
    }

    public rename(argName: string, argValue: string): void{
        if(this.name == argName && !this.isNameScoped) this.name = argValue;
        if(!this.isInput && this.inOutPut == argName && !this.isOutputScoped) this.inOutPut = argValue;
        this.next.rename(argName, argValue);
    }

    public scopedRename(argName: string, argValue: string, scope: PiScope): void {
        if(argName == this.name && this.scopes.indexOf(scope) > -1 )this.name = argValue;
        if(!this.isInput && argName == this.inOutPut && this.scopes.indexOf(scope) > -1 )this.inOutPut = argValue;
        this.next.scopedRename(argName, argValue, scope);
    }

    public alphaRename(argName: string, argValue: string, scope: PiScope): void {
        console.log('Alpha Rename: '+argName+" => "+argValue);
        if(argName == this.name && this.scopes.indexOf(scope) > -1 )this.name = argValue;
        if(argName == this.inOutPut && this.scopes.indexOf(scope) > -1 )this.inOutPut = argValue;
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
}