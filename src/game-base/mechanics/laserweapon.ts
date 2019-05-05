import {Weapon} from "./weapon";

export class LWeapon extends Weapon{

	public constructor(scene : Phaser.Scene, x : number, y : number, player : number, modTex : string, weapTex : string){
		super(scene, x, y, "laser", modTex, weapTex, player);
	}

	shoot(){
		//pi kalkül  armor<*>.0
	}
}