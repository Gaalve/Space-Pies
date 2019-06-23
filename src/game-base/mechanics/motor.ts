import {Player} from "./player";
import {motorType} from "./motor/motor-type";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {BulletInfo} from "./weapon/bulletInfo";
import {HealthType} from "./health/health-type";
import {Drone} from "./drone";
import {Ship} from "./ship";
import {Health} from "./health/health";
import {EnergyDrone} from "./energyDrone";
import {Explosion} from "./animations/explosion";
import {LaserImpact} from "./animations/laser-impact";
import {ProjectileImpact} from "./animations/projectile-impact";
import {LaserTrail} from "./animations/laser-trail";
import {RocketTrail} from "./animations/rocket-trail";
import {BulletTrail} from "./animations/bullet-trail";
import {collectEnergy_ship} from "./animations/collectEnergy_ship";
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import {BattleTimeBar} from "./battleTimeBar";
import get = Reflect.get;
import {collectEnergy_Drones} from "./animations/collectEnergy_Drones";
import {Anomaly} from "./anomalies/anomaly";
import {SunEruption} from "./anomalies/sun-eruption";
import {PiSystemAddAction} from "./picalc/pi-system-add-action";
import {WormHole} from "./anomalies/worm-hole";
import {NanoDrone} from "./nanoDrone";
import {PiSystemAdd} from "./picalc/pi-system-add";
import {BlackHole} from "./anomalies/black-hole";

export class Motor {

    private player: Player;
    private motorType: motorType;
    private system: PiSystem;
    private testnumber: number;
    private activeMotorsLaser: number;
    private activeMotorsProjectile: number;
    private activeMotorsRocket: number;

    //  private nameIdentifier : string;

    public constructor(scene: Phaser.Scene, player: Player, type: motorType, x: number, y: number,) {
        this.motorType = type;
        this.player = player;
        this.testnumber = 1;
        this.activeMotorsLaser = 0;
        this.activeMotorsProjectile = 0;
        this.activeMotorsRocket = 0;
        //  this.nameIdentifier = player.getNameIdentifier();

    //    this.system.pushSymbol(
     //       this.system.add.replication(
     //           this.system.add.channelIn('player1', '').nullProcess()
    //        )
      //  );
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorlaser11','').nullProcess()
        );
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorprojectile11','').nullProcess()
        );
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorrocket11','').nullProcess()
        );

        /* ALTERNATIVE
        //this.system.pushSymbol(
        //             this.system.add.channelIn('buymotorlaser1', '').
        //             channelOut('buildmotorlaser1', '').
        //
        //
        //
        */

        // creating laser motors when bought in shop for p1
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorlaser11', '').
            channelOutCB('buildmotorlaser11', '', () => this.activeMotorsLaser = this.activeMotorsLaser + 1).
            channelIn('buymotorlaser12', '').
            channelOutCB('buildmotorlaser12', '', () => this.activeMotorsLaser = this.activeMotorsLaser + 1).
            channelIn('buymotorlaser13', '').
            channelOutCB('buildmotorlaser13', '', () => this.activeMotorsLaser = this.activeMotorsLaser + 1).nullProcess()
        );

        // creating projectile motors when bought in shop for p1
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorprojectile11', '').
            channelOut('buildmotorprojectile11', '').
            channelIn('buymotorprojectile12', '').
            channelOut('buildmotorprojectile12', '').
            channelIn('biymotorprojectile13', '').
            channelOut('buildmotorprojectile13', '').nullProcess()
        );

        // creating rocket motors when bought in shop for p1
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorrocket11', '').
            channelOut('buildmotorrocket11', '').
            channelIn('buymotorrocket12', '').
            channelOut('buildmotorrocket12', '').
            channelIn('buymotorrocket13', '').
            channelOut('buildmotorrocket13', '').nullProcess()
        );

        // creating laser motors when bought in shop for p2
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorlaser21', '').
            channelOut('buildmotorlaser21', '').
            channelIn('buymotorlaser22', '').
            channelOut('buildmotorlaser22', '').
            channelIn('buymotorlaser23', '').
            channelOut('buildmotorlaser23', '').nullProcess()
        );

        // creating projectile motors when bought in shop for p2
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorprojectile21', '').
            channelOut('buildmotorprojectile21', '').
            channelIn('buymotorprojectile22', '').
            channelOut('buildmotorprojectile22', '').
            channelIn('biymotorprojectile23', '').
            channelOut('buildmotorprojectile23', '').nullProcess()
        );

        // creating rocket motors when bought in shop for p2
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorrocket21', '').
            channelOut('buildmotorrocket21', '').
            channelIn('buymotorrocket22', '').
            channelOut('buildmotorrocket22', '').
            channelIn('buymotorrocket23', '').
            channelOut('buildmotorrocket23', '').nullProcess()
        );

        this.system.pushSymbol(
            this.system.add.replication(
                this.system.add.channelIn('buildmotorlaser11', '').
                channelIn('shieldplayer1', '').nullProcess()
            )
        )
        /* this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn('buildmotorlaser11', '',
             new BulletInfo(true, x, y +Math.random()*800 - 400), 0.4).nullProcess()))
          */

   /*     this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn('buildmotorlaser11', ' ',
            new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn('buildmotorlaser12', '',
            new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));
        this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn('buildmotorlaser13', '',
            new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));
        //this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn(
        //     'shotblock'+this.nameIdentifier().charAt(1), "","", 0).nullProcess())
        //  );

        /*     this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('armor'+nameIdentifier, '',
                 new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
             this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('shield'+nameIdentifier, '',
                 new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
             this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('rocket'+this.nameIdentifier, '',
                 new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
             this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn(
                 'shotblock'+this.getNameIdentifier().charAt(1), "","", 0).nullProcess())
             ); */

        /*    this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('armor'+nameIdentifier, '',
                new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
            this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('shield'+nameIdentifier, '',
                new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
            this.system.pushSymbol(piSystem.add.replication(piSystem.add.channelIn('rocket'+nameIdentifier, '',
                new BulletInfo(true, x, y + Math.random()*800 - 400), 0.4).nullProcess()));
            this.system.pushSymbol(this.system.add.replication(this.system.add.channelIn(
                'shotblock'+this.getNameIdentifier().charAt(1), "","", 0).nullProcess())
            );
    */
        /*   this.system.add.channelIn('buymotorlaser11', '').
        channelOutCB('buildmotorlaser11', ''()=> this.buildLaserMotor()).
        channelIn('buymotorlaser12', '').
        channelOutCB('buildmotorlaser12', '', ()=> this.buildLaserMotor()).
        channelIn('buymotorlaser13', '').
        channelOutCB('buildmotorlaser13', '', ()=> this.buildLaserMotor());
        */

        /*    this.system.add.channelInCB('buildmotorlaser1', '', () => this.createLaserMotor());
            this.system.add.channelInCB('buyprojectilemotor1', '', () => this.createProjectileMotor());
            this.system.add.channelInCB('buyrocketmotor1', '', () => this.createRocketMotor());



        /*    this.system.pushSymbol(
                this.system.add.replication(
                    this.system.add.channelIn() */


        /*   this.system.pushSymbol(
               this.system.add.channelInCB('buymotorlaser11', '', () => this.buildLaserMotor()).
               channelInCB('buymotorlaser12', '', () => this.buildLaserMotor()).
               channelInCB('biymotorlaser13', '', () => this.buildLaserMotor()).nullProcess()

           );


       }

       private buildLaserMotor(){
           this.system.add.channelIn()

       }

       private buildProjectileMotor(){

       }

       private buildRocketMotor(){

       }
   */


    }
    getactiveMotorLaser(): number{
        return this.activeMotorsLaser;
    }

    getactiveMotorProjectile(): number{
        return this.activeMotorsProjectile;
    }

    getactiveMotorRocket(): number{
        return this.activeMotorsRocket;
    }
}