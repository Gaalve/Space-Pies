import Sprite = Phaser.GameObjects.Sprite;

export class Weapon{

	private level : number;						//level of weapon 1-3
	private wClass : string;					//projectile or laser
	private player : number;					//weapon belongs to player 1 or 2

	//textures
	private readonly wMod : Phaser.GameObjects.Sprite;
	private readonly wTex : Phaser.GameObjects.Sprite;

	protected constructor(scene : Phaser.Scene, x : number , y : number, wClass : string, 
						  modTex : string, weapTex : string, player : number){
		this.wClass = wClass;
		this.level = 1; 						//or 0, if weapon shouldn't be activated from the beginning
		this.player = player;

		this.wMod = new Sprite(scene, x, y, modTex);
		
		if(player == 1){
			this.wTex = new Sprite(scene, x + 70, y, weapTex);
		}else{
			this.wTex = new Sprite(scene, x - 70, y, weapTex);
		}

		this.wTex.setScale(0.5);
		this.wMod.setScale(0.7);

		scene.add.existing(this.wMod);
		scene.add.existing(this.wTex);

	}

	getLevel(){
		return this.level;
	}

	weaponUpgrade(newLevel : number, newTexture : string){
		this.level = newLevel;					//maybe just: this.level++
		//new Texture
	}
}