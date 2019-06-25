import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;


export class NeutronAnimation {
    private readonly circle;
    private pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private neutronParts: Phaser.GameObjects.Particles.ParticleEmitter;
    public constructor(pem: ParticleEmitterManager){


        this.pem = pem;


        this.neutronParts = this.pem.createEmitter( {
            frame: "particle_1",
            // emitZone: {
            //     source: new Phaser.Geom.Circle(960, 540, 100),
            //     type: 'edge',
            //     quantity: 0,
            //     stepRate: 2},
            tint: [0xaaeeff, 0x2ad4ff],
            scale: {start: 0.33, end: 0},
            // quantity: 2,
            // frequency:1,
            lifespan: 5000,
            // speed: 150,
            on: false,
            alpha: {start: 1, end: 0}
            // blendMode: Phaser.BlendModes.ADD
        });



    }

    public emit(): void{
        // let randomAngle = 2 * Math.PI * Math.random();
        // this.neutronParts.setAngle(randomAngle * Phaser.Math.RAD_TO_DEG);
        // this.neutronParts.emitParticle(1, 960 + Math.cos(randomAngle)* 75,  540 + Math.sin(randomAngle)*75)
        this.neutronParts.emitParticle(1, 1920 * Math.random(),  1080 * Math.random());
    }



}