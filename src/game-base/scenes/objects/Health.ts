import {Player} from "../../mechanics/player";

/*
    HEALTH DATA
*/
export class Health {
    public player: Player;
    public armor: integer;
    public shield: integer;

    constructor(armor : integer, shield : integer) {
        this.armor = armor;
        this.shield = shield;
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
        return this.armor;
    }


    public getCurrentShield() : integer
    {
        return this.shield;
    }


    public damageArmor() : void
    {
        this.armor = this.armor - 1;
    }

    public damageShield() : void
    {
        this.shield = this.shield - 1;
    }

    public regenerateArmor() : void
    {
        this.armor = this.armor + 1;
    }

    public regenerateShield() : void
    {
        this.shield = this.shield + 1;
    }
}