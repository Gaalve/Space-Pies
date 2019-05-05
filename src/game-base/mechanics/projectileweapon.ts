import {Weapon} from "./weapon";

export class PWeapon extends Weapon{

	public constructor(scene : Phaser.Scene, x : number, y : number, player : number, modTex : string, weapTex : string){
		super(scene, x, y, "projectile", modTex, weapTex, player);
	}

	shoot(){
		//pi kalkül  shield<*>.0
	}
}