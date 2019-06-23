import {Player} from "./player";
import {PiSystem} from "../mechanics/picalc/pi-system";
import {BulletInfo} from "./weapon/bulletInfo";


export class Motor {

    private player: Player;
    private system: PiSystem;
    private testnumber: number;
    private activeMotorsLaserP1: number;
    private activeMotorsProjectileP1: number;
    private activeMotorsRocketP1: number;
    private activeMotorsLaserP2: number;
    private activeMotorsProjectileP2: number;
    private activeMotorsRocketP2: number;

    //  private nameIdentifier : string;

    public constructor(scene: Phaser.Scene, player: Player, x: number, y: number,) {
        this.player = player;
        this.testnumber = 1;
        this.activeMotorsLaserP1 = 0;
        this.activeMotorsProjectileP1 = 0;
        this.activeMotorsRocketP1 = 0;
        this.activeMotorsLaserP2 = 0;
        this.activeMotorsProjectileP2 = 0;
        this.activeMotorsRocketP2 = 0;

            //  this.nameIdentifier = player.getNameIdentifier();

            //    this.system.pushSymbol(
            //       this.system.add.replication(
            //           this.system.add.channelIn('player1', '').nullProcess()
            //        )
            //  );



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
            channelOutCB('buildmotorlaser11', '', () => this.activeMotorsLaserP1 = this.activeMotorsLaserP1 + 1).
            channelIn('buymotorlaser12', '').
            channelOutCB('buildmotorlaser12', '', () => this.activeMotorsLaserP1 = this.activeMotorsLaserP1 + 1).
            channelIn('buymotorlaser13', '').
            channelOutCB('buildmotorlaser13', '', () => this.activeMotorsLaserP1 = this.activeMotorsLaserP1 + 1).nullProcess()
        );

        // creating projectile motors when bought in shop for p1
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorprojectile11', '').
            channelOutCB('buildmotorprojectile11', '', () => this.activeMotorsProjectileP1 = this.activeMotorsProjectileP1 + 1).
            channelIn('buymotorprojectile12', '').
            channelOutCB('buildmotorprojectile12', '', () => this.activeMotorsProjectileP1 = this.activeMotorsProjectileP1 + 1).
            channelIn('biymotorprojectile13', '').
            channelOutCB('buildmotorprojectile13', '', () => this.activeMotorsProjectileP1 = this.activeMotorsProjectileP1 + 1).nullProcess()
        );

        // creating rocket motors when bought in shop for p1
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorrocket11', '').
            channelOutCB('buildmotorrocket11', '', () => this.activeMotorsRocketP1  = this.activeMotorsRocketP1 + 1).
            channelIn('buymotorrocket12', '').
            channelOutCB('buildmotorrocket12', '', () => this.activeMotorsRocketP1  = this.activeMotorsRocketP1 + 1).
            channelIn('buymotorrocket13', '').
            channelOutCB('buildmotorrocket13', '', () => this.activeMotorsRocketP1  = this.activeMotorsRocketP1 + 1).nullProcess()
        );

        // creating laser motors when bought in shop for p2
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorlaser21', '').
            channelOutCB('buildmotorlaser21', '', () => this.activeMotorsLaserP2  = this.activeMotorsLaserP2 + 1).
            channelIn('buymotorlaser22', '').
            channelOutCB('buildmotorlaser22', '',() => this.activeMotorsLaserP2  = this.activeMotorsLaserP2 + 1).
            channelIn('buymotorlaser23', '').
            channelOutCB('buildmotorlaser23', '',() => this.activeMotorsLaserP2  = this.activeMotorsLaserP2 + 1).nullProcess()
        );

        // creating projectile motors when bought in shop for p2
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorprojectile21', '').
            channelOutCB('buildmotorprojectile21', '', () => this.activeMotorsProjectileP2  = this.activeMotorsProjectileP2 + 1).
            channelIn('buymotorprojectile22', '').
            channelOutCB('buildmotorprojectile22', '', () => this.activeMotorsProjectileP2  = this.activeMotorsProjectileP2 + 1).
            channelIn('biymotorprojectile23', '').
            channelOutCB('buildmotorprojectile23', '', () => this.activeMotorsProjectileP2  = this.activeMotorsProjectileP2 + 1).nullProcess()
        );

        // creating rocket motors when bought in shop for p2
        this.system.pushSymbol(
            this.system.add.channelIn('buymotorrocket21', '').
            channelOutCB('buildmotorrocket21', '', () => this.activeMotorsRocketP2  = this.activeMotorsRocketP2 + 1).
            channelIn('buymotorrocket22', '').
            channelOutCB('buildmotorrocket22', '', () => this.activeMotorsRocketP2  = this.activeMotorsRocketP2 + 1).
            channelIn('buymotorrocket23', '').
            channelOutCB('buildmotorrocket23', '', () => this.activeMotorsRocketP2  = this.activeMotorsRocketP2 + 1).nullProcess()
        );

        /*      this.system.pushSymbol(
                  this.system.add.channelIn('buildmotorlaser11', '').
                   replication(this.system.add.channelIn('shieldplayer1', '',
                      new BulletInfo(true, x, y + Math.random()*800 - 400, 0.4).nullProcess()));
                  )
              )
           */

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser11', '').replication(this.system.add.channelIn('armorP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser12', '').replication(this.system.add.channelIn('armorP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser13', '').replication(this.system.add.channelIn('armorP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorprojectile11', '').replication(this.system.add.channelIn('shieldP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorprojectile12', '').replication(this.system.add.channelIn('shieldP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorprojectile13', '').replication(this.system.add.channelIn('shieldP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorrocket11', '').replication(this.system.add.channelIn('rocketP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorrocket12', '').replication(this.system.add.channelIn('rocketP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorrocket13', '').replication(this.system.add.channelIn('rocketP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        //
        // PLAYER 2
        //

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser21', '').replication(this.system.add.channelIn('armorP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser22', '').replication(this.system.add.channelIn('armorP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser23', '').replication(this.system.add.channelIn('armorP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorprojectile21', '').replication(this.system.add.channelIn('shieldP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorprojectile22', '').replication(this.system.add.channelIn('shieldP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorprojectile23', '').replication(this.system.add.channelIn('shieldP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorrocket21', '').replication(this.system.add.channelIn('rocketP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorrocket22', '').replication(this.system.add.channelIn('rocketP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorrocket23', '').replication(this.system.add.channelIn('rocketP2', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        ///////////////////////////////

        this.startMotor();

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

    }
    public buildMotor(){

        }

       private buildProjectileMotor(){

       }

       private buildRocketMotor(){

       }
   */



    }
  /*  public buildMotor(){

        //Player 1
        let motorlaser11 = this.system.add.term('motorLaser11', undefined);
        let motorlaser12 = this.system.add.term('motorLaser12', undefined);
        let motorlaser13 =  this.system.add.term('motorLaser13', undefined);
        let motorprojectile11 = this.system.add.term('motorprojectile11', undefined);
        let motorprojectile12 = this.system.add.term('motorprojectile12', undefined);
        let motorprojectile13 = this.system.add.term('motorprojectile13', undefined);
        let motorrocket11 = this.system.add.term('motorprojectile11', undefined);
        let motorrocket12 = this.system.add.term('motorprojectile12', undefined);
        let motorrocket13 = this.system.add.term('motorprojectile13', undefined);

        //Player 2
        let motorlaser21 = this.system.add.term('motorLaser21', undefined);
        let motorlaser22 = this.system.add.term('motorLaser22', undefined);
        let motorlaser23 =  this.system.add.term('motorLaser23', undefined);
        let motorprojectile21 = this.system.add.term('motorprojectile21', undefined);
        let motorprojectile22 = this.system.add.term('motorprojectile22', undefined);
        let motorprojectile23 = this.system.add.term('motorprojectile23', undefined);
        let motorrocket21 = this.system.add.term('motorprojectile21', undefined);
        let motorrocket22 = this.system.add.term('motorprojectile22', undefined);
        let motorrocket23 = this.system.add.term('motorprojectile23', undefined);

    this.system.pushSymbol(system.add.channelIn("buildmotorlaser11", '').next(motorlaser11));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser11', '').replication(this.system.add.channelIn('armorP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser12', '').replication(this.system.add.channelIn('armorP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.5).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorlaser13', '').replication(this.system.add.channelIn('armorP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.6).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorprojectile11', '').replication(this.system.add.channelIn('shieldP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

        this.system.pushSymbol(
            this.system.add.channelIn('buildmotorrocket11', '').replication(this.system.add.channelIn('rocketP1', '',
                new BulletInfo(true, x, y + Math.random() * 800 - 400), 0.4).nullProcess()));

    }
*/
    public startMotor(){
        //For Player 1
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorlaser11', '').nullProcess()
        );
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorprojectile11', '').nullProcess()
        );
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorrocket11', '').nullProcess()
        );

        //For Player 2
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorlaser21', '').nullProcess()
        );
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorprojectile21', '').nullProcess()
        );
        this.system.pushSymbol(
            this.system.add.channelOut('buymotorrocket21', '').nullProcess()
        );

    }
    getactiveMotorLaserP1(): number{
        return this.activeMotorsLaserP1;
    }

    getactiveMotorProjectileP1(): number{
        return this.activeMotorsProjectileP1;
    }

    getactiveMotorRocketP1(): number{
        return this.activeMotorsRocketP1;
    }

    getactiveMotorLaserP2(): number{
        return this.activeMotorsLaserP2;
    }

    getactiveMotorProjectileP2(): number{
        return this.activeMotorsProjectileP2;
    }

    getactiveMotorRocketP2(): number{
        return this.activeMotorsRocketP2;
    }
}