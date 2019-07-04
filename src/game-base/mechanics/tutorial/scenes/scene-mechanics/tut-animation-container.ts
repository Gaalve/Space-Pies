import {Explosion} from "../../../animations/explosion";
import {LaserImpact} from "../../../animations/laser-impact";
import {ProjectileImpact} from "../../../animations/projectile-impact";
import {LaserTrail} from "../../../animations/laser-trail";
import {RocketTrail} from "../../../animations/rocket-trail";
import {BulletTrail} from "../../../animations/bullet-trail";
import {collectEnergy_ship} from "../../../animations/collectEnergy_ship";
import {BlackholeParticle} from "../../../animations/blackhole-particle";
import {DustAnimation} from "../../../animations/dust-animation";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {NeutronAnimation} from "../../../animations/neutron-animation";
import {NeutronTurb} from "../../../animations/neutron-turb";
import {NeutronExplosion} from "../../../animations/neutron-explosion";


export class TutAnimationContainer {
    public pem: Phaser.GameObjects.Particles.ParticleEmitterManager;
    public explosion: Explosion;
    public laserImpact: LaserImpact;
    public projectileImpact: ProjectileImpact;
    public laserTrail: LaserTrail;
    public rocketTrail: RocketTrail;
    public bulletTrail: BulletTrail;
    public collectE: collectEnergy_ship;
    public blackholeParticles: BlackholeParticle;
    public dustAnimation: DustAnimation;

    public constructor(pem: ParticleEmitterManager){
        this.explosion = new Explosion(pem);
        this.laserImpact = new LaserImpact(pem);
        this.projectileImpact = new ProjectileImpact(pem);
        this.laserTrail = new LaserTrail(pem);
        this.rocketTrail = new RocketTrail(pem);
        this.bulletTrail = new BulletTrail(pem);
        this.collectE = new collectEnergy_ship(pem);
        this.blackholeParticles = new BlackholeParticle(pem);
        // this.neutronParticles = new NeutronAnimation(pem);
        // this.neutronTurb = new NeutronTurb(pem);
        // this.neutronExplosion = new NeutronExplosion(pem);
        this.dustAnimation = new DustAnimation(pem);
    }
}