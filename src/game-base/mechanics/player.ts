import {HealthBar} from "../scenes/objects/HealthBar";


export class Player {
    private nameIdentifier: string;
    private maxHealth : number;
    private firstPlayer: boolean;
    private healthBar : HealthBar;

    public constructor(nameIdentifier: string, maxHealth: number, isFirstPlayer: boolean){
        this.nameIdentifier = nameIdentifier;
        this.maxHealth = maxHealth;
        this.firstPlayer = isFirstPlayer;
    }

    getNameIdentifier(): string{
        return this.nameIdentifier;
    }

    getMaxHealth(): number{
        return this.maxHealth;
    }

    isFirstPlayer(): boolean{
        return this.firstPlayer;
    }

}