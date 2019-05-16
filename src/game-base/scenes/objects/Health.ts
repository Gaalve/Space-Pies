import {Player} from "../../mechanics/player";

/*
    HEALTH DATA
*/
export class Health {
    public player: Player;
    public maxArmor: integer;
    public maxShield: integer;
    public currentArmor: integer;
    public currentShield: integer;

    constructor(maxArmor : integer, maxShield : integer) {
        this.maxArmor = maxArmor;
        this.maxShield = maxShield;
        this.currentArmor = maxArmor;
        this.currentShield = maxShield;
    }


    public setPlayer(player : Player) : void
    {
        this.player = player;
    }

    public getPlayer(player : Player) : Player
    {
        return this.player;
    }

    public getCurrentArmor() : integer
    {
        return this.currentArmor;
    }


    public getCurrentShield() : integer
    {
        return this.currentShield;
    }

    public getMaxArmor() : integer
    {
        return this.maxArmor;
    }

    public getMaxShield() : integer
    {
        return this.maxShield;
    }

    public damageArmor() : void
    {
        this.currentArmor = this.currentArmor - 1;
    }

    public damageShield() : void
    {
        this.currentShield = this.currentShield - 1;
    }

    public regenerateArmor() : void
    {
        this.currentArmor = this.currentArmor + 1;
    }

    public regenerateLife() : void
    {
        this.currentShield = this.currentShield + 1;
    }
}