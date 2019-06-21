import {Player} from "../player";
import {PiSystem} from "../picalc/pi-system";
import {Healthbar} from "./healthbar";
import {PiTerm} from "../picalc/pi-term";
import {HealthType} from "./health-type";
import {HealthbarSprites} from "./healthbar-sprites";
import {PiAction} from "../picalc/pi-action";
import {PiAnimSystem} from "../pianim/pi-anim-system";

export class Health {
    private player: Player;
    public shipBar: Healthbar;
    public readonly zone1Bar: Healthbar;
    public readonly zone2Bar: Healthbar;
    public readonly zone3Bar: Healthbar;
    public readonly zone4Bar: Healthbar;
    private readonly piAnmimSys: PiAnimSystem;

    public constructor(scene: Phaser.Scene, player: Player, pi: PiSystem, piAnmimSys: PiAnimSystem){
        this.player = player;
        this.piAnmimSys = piAnmimSys;
        const pid = player.getNameIdentifier();

        this.shipBar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, false, 120,
            "CoreExplosion"+pid, pid);
        this.zone1Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 170,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);
        this.zone2Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 220,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);
        this.zone3Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 270,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);
        this.zone4Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 320,
            HealthbarSprites.getAbbreviation(HealthType.HitZoneBar)+pid.toLowerCase()+'< >', pid);


        pi.pushSymbol(
            pi.add.channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .process("CoreExplosion"+pid, ()=>{console.log(pid+" lost."); this.player.ship.explosion()})
        );
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);

        /**
         * Adding HitZone Pi-Terms
         */
        this.createHitZoneInPiShield(pi, pid, "z1", this.zone1Bar);
        this.createHitZoneInPiShield(pi, pid, "z2", this.zone2Bar);
        this.createHitZoneInPiArmor(pi, pid, "z3", this.zone3Bar);
        this.createHitZoneInPiArmor(pi, pid, "z4", this.zone4Bar);
    }

    private createHitZoneInPiShield(pi: PiSystem, pid:string, hbid: string, zoneBar: Healthbar){
        this.createHitZonePiChannels(pi, pid, hbid, zoneBar);
        Health.addPiHitzoneShield(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ShieldBar)});
    }

    private createHitZonePiChannels(pi: PiSystem, pid:string, hbid: string, zoneBar: Healthbar){
        let des = ()=>{zoneBar.destroyBar()};
        let regLSCB = ()=>{zoneBar.addBar(HealthType.ShieldBar)};
        let regASCB = ()=>{zoneBar.addBar(HealthType.ArmorBar)};
        let regRSCB = ()=>{zoneBar.addBar(HealthType.RocketBar)};
        let regNSCB = ()=>{zoneBar.addBar(HealthType.NanoBar)};
        let regADSCB = ()=>{zoneBar.addBar(HealthType.AdaptiveBar2); zoneBar.addBar(HealthType.AdaptiveBar)};
        let lasShld = Health.getPiLaserShield(pi, pid, hbid, des, regLSCB, regASCB, regRSCB, regNSCB, regADSCB);
        let armShld = Health.getPiArmorShield(pi, pid, hbid, des, regLSCB, regASCB, regRSCB, regNSCB, regADSCB);
        let rockShld = Health.getPiRocketShield(pi, pid, hbid, des, regLSCB, regASCB, regRSCB, regNSCB, regADSCB);
        let nanoShld = Health.getPiNanoShield(pi, pid, hbid, des, regLSCB, regASCB, regRSCB, regNSCB, regADSCB);
        let adapShld = Health.getPiAdapShield(pi, pid, hbid, des, regLSCB, regASCB, regRSCB, regNSCB, regADSCB,
            ()=>{zoneBar.removeBar()});
        Health.addPiLaserShieldHelper(pi, pid, hbid, lasShld);
        Health.addPiArmorShieldHelper(pi, pid, hbid, armShld);
        Health.addPiRocketShieldHelper(pi, pid, hbid, rockShld);
        Health.addPiNanoShieldHelper(pi, pid, hbid, nanoShld);
        Health.addPiAdapShieldHelper(pi, pid, hbid, adapShld);
    }

    private createHitZoneInPiArmor(pi: PiSystem, pid:string, hbid: string, zoneBar: Healthbar){
        this.createHitZonePiChannels(pi, pid, hbid, zoneBar);
        Health.addPiHitzoneArmor(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ArmorBar)});
    }

    public addToHz(pi: PiSystem, name: string, hzid: string){
        pi.pushSymbol(pi.add.channelOut(name+this.player.getNameIdentifier()+hzid, '').nullProcess());
    }

    /**
     * Returns the normal Function for Laser Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param desLSCB - callback to destroy a laser shield bar
     * @param regLSCB - callback to regenerate laser shield bar
     * @param regASCB - callback to regenerate armor shield bar
     * @param regRSCB - callback to regenerate rocket shield bar
     * @param regNSCB - callback to regenerate nano shield bar
     * @param regADSCB - callback to regenerate adaptive shield bar
     */
    private static getPiLaserShield(pi: PiSystem, pid: string, hbid: string, desLSCB: ()=>any,
                             regLSCB: ()=>any, regASCB: ()=>any, regRSCB: ()=>any, regNSCB: ()=>any, regADSCB: ()=>any): PiTerm{
        return pi.add.term('LasShld'+pid+hbid, pi.add.sum([
            pi.add.channelInCB('shield'+pid,'', desLSCB) // laser shield of player X
                .channelOut('regout', '') // sync
                .nullProcess(),
            pi.add.channelInCB('rocket'+pid,'', desLSCB)
                .channelOut('regout','')
                .nullProcess(),
            pi.add.channelIn('rshield'+pid+hbid, '') // regenerate laser shield
                .scope('reg1',
            pi.add.scope('reg2',
                pi.add.channelOutCB('reghelpls'+pid+hbid, 'reg1', regLSCB)
                .channelIn('reg1', '*')
                .channelOut('reghelpls'+pid+hbid, 'reg2').channelIn('reg2', '*')
                .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rarmor'+pid+hbid, '') // regenerate armor shield
                .scope('reg1',
                pi.add.scope('reg2',
                pi.add.channelOutCB('reghelpas'+pid+hbid, 'reg1', regASCB)
                .channelIn('reg1', '*')
                .channelOut('reghelpls'+pid+hbid, 'reg2').channelIn('reg2', '*')
                .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rrocket'+pid+hbid, '') // regenerate rocket shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelprs'+pid+hbid, 'reg1', regRSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpls'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rnano'+pid+hbid, '') // regenerate nano shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpns'+pid+hbid, 'reg1', regNSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpls'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('radap'+pid+hbid, '') // regenerate adaptive shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpads'+pid+hbid, 'reg1', regADSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpls'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
        ]));
    }

    /**
     * Returns the normal Function for Armor Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param desASCB - callback to destroy a armor shield bar
     * @param regLSCB - callback to regenerate laser shield bar
     * @param regASCB - callback to regenerate armor shield bar
     * @param regRSCB - callback to regenerate rocket shield bar
     * @param regNSCB - callback to regenerate nano shield bar
     * @param regADSCB - callback to regenerate adaptive shield
     */
    private static getPiArmorShield(pi: PiSystem, pid: string, hbid: string, desASCB: ()=>any,
                                    regLSCB: ()=>any, regASCB: ()=>any, regRSCB: ()=>any, regNSCB: ()=>any, regADSCB: ()=>any): PiTerm{
        return pi.add.term('ArmShld'+pid+hbid, pi.add.sum([
            pi.add.channelInCB('armor'+pid,'', desASCB) // laser shield of player X
                .channelOut('regout', '') // sync
                .nullProcess(),
            pi.add.channelInCB('rocket'+pid,'', desASCB)
                .channelOut('regout','')
                .nullProcess(),
            pi.add.channelIn('rshield'+pid+hbid, '') // regenerate laser shield
                .scope('reg1',
                pi.add.scope('reg2',
                pi.add.channelOutCB('reghelpls'+pid+hbid, 'reg1', regLSCB)
                .channelIn('reg1', '*')
                .channelOut('reghelpas'+pid+hbid, 'reg2').channelIn('reg2', '*')
                .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rarmor'+pid+hbid, '') // regenerate armor shield
                .scope('reg1',
                pi.add.scope('reg2',
                pi.add.channelOutCB('reghelpas'+pid+hbid, 'reg1', regASCB)
                .channelIn('reg1', '*')
                .channelOut('reghelpas'+pid+hbid, 'reg2').channelIn('reg2', '*')
                .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rrocket'+pid+hbid, '') // regenerate armor shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelprs'+pid+hbid, 'reg1', regRSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpas'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rnano'+pid+hbid, '') // regenerate nano shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpns'+pid+hbid, 'reg1', regNSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpas'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('radap'+pid+hbid, '') // regenerate adaptive shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpads'+pid+hbid, 'reg1', regADSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpas'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
        ]));
    }

    /**
     * Returns the normal Function for Rocket Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param desRSCB - callback to destroy a rocket shield bar
     * @param regLSCB - callback to regenerate laser shield bar
     * @param regASCB - callback to regenerate armor shield bar
     * @param regRSCB - callback to regenerate rocket shield bar
     * @param regNSCB - callback to regenerate nano shield bar
     * @param regADSCB - callback to regenerate adaptive shield bar
     */
    private static getPiRocketShield(pi: PiSystem, pid: string, hbid: string, desRSCB: ()=>any,
                                    regLSCB: ()=>any, regASCB: ()=>any, regRSCB: ()=>any, regNSCB: ()=> any, regADSCB: ()=>any): PiTerm{
        return pi.add.term('RockShld'+pid+hbid, pi.add.sum([
            pi.add.channelInCB('armor'+pid,'', desRSCB) // rocketshield of player X
                .channelOut('regout', '') // sync
                .nullProcess(),
            pi.add.channelInCB('shield'+pid,'', desRSCB)
                .channelOut('regout','')
                .nullProcess(),
            pi.add.channelIn('rrocket'+pid+hbid, '') // regenerate rocket shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelprs'+pid+hbid, 'reg1', regRSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelprs'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rshield'+pid+hbid, '') // regenerate laser shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpls'+pid+hbid, 'reg1', regLSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelprs'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rarmor'+pid+hbid, '') // regenerate armor shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpas'+pid+hbid, 'reg1', regASCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelprs'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rnano'+pid+hbid, '') // regenerate nano shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpns'+pid+hbid, 'reg1', regNSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelprs'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('radap'+pid+hbid, '') // regenerate adaptive shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpads'+pid+hbid, 'reg1', regADSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelprs'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess()))
        ]));
    }

    /**
     * Returns the normal Function for Nano Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param desNSCB - callback to destroy a rocket shield bar
     * @param regLSCB - callback to regenerate laser shield bar
     * @param regASCB - callback to regenerate armor shield bar
     * @param regRSCB - callback to regenerate rocket shield bar
     * @param regNSCB - callback to regenerate nano shield bar
     * @param regADSCB - callback to regenerate adaptive shield bar
     */
    private static getPiNanoShield(pi: PiSystem, pid: string, hbid: string, desNSCB: ()=>any,
                                     regLSCB: ()=>any, regASCB: ()=>any, regRSCB: ()=>any, regNSCB: ()=>any, regADSCB: ()=>any): PiTerm{
        return pi.add.term('NanoShld'+pid+hbid, pi.add.sum([
            pi.add.channelInCB('armor'+pid,'', desNSCB) // nanoshield of player X
                .channelOut('regout', '') // sync
                .nullProcess(),
            pi.add.channelInCB('shield'+pid,'', desNSCB)
                .channelOut('regout','')
                .nullProcess(),
            pi.add.channelInCB('rocket'+pid,'', desNSCB)
                .channelOut('regout','')
                .nullProcess(),
            pi.add.channelIn('rnano'+pid+hbid, '') // regenerate nano shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpns'+pid+hbid, 'reg1', regNSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpns'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rshield'+pid+hbid, '') // regenerate laser shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpls'+pid+hbid, 'reg1', regLSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpns'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rarmor'+pid+hbid, '') // regenerate armor shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpas'+pid+hbid, 'reg1', regASCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpns'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('rrocket'+pid+hbid, '') // regenerate rocket shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelprs'+pid+hbid, 'reg1', regRSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpns'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess())),
            pi.add.channelIn('radap'+pid+hbid, '') // regenerate adaptive shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelpads'+pid+hbid, 'reg1', regADSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpns'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess()))
        ]));
    }

    /**
     * Returns the normal Function for Adaptive Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param desADSCB - callback to destroy an adaptive shield bar
     * @param regLSCB - callback to regenerate laser shield bar
     * @param regASCB - callback to regenerate armor shield bar
     * @param regRSCB - callback to regenerate rocket shield bar
     * @param regNSCB - callback to regenerate nano shield bar
     * @param regADSCB - callback to regenerate adaptive shield
     * @param remAdap - callback to remove adaptive shield
     */
    private static getPiAdapShield(pi: PiSystem, pid: string, hbid: string, desADSCB: ()=>any,
                                   regLSCB: ()=>any, regASCB: ()=>any, regRSCB: ()=>any, regNSCB: ()=>any, regADSCB: ()=>any, remAdap: ()=>any): PiTerm{

        let regAdap : PiAction = pi.add.channelIn('radap'+pid+hbid,'')
            .scope('reg1',
                pi.add.scope('reg2',
                    pi.add.channelOutCB('reghelpads'+pid+hbid, 'reg1', regADSCB)
                        .channelIn('reg1','*')
                        .channelOut('reghelpads'+pid+hbid, 'reg2').channelIn('reg2','*')
                        .channelOut('regout','*').nullProcess()));

        let regShield : PiAction = pi.add.channelIn('rshield'+pid+hbid,'')
            .scope('reg1',
                pi.add.scope('reg2',
                    pi.add.channelOutCB('reghelpls'+pid+hbid, 'reg1', regLSCB)
                        .channelIn('reg1','*')
                        .channelOut('reghelpads'+pid+hbid, 'reg2').channelIn('reg2','*')
                        .channelOut('regout','*').nullProcess()));

        let regArmor : PiAction = pi.add.channelIn('rarmor'+pid+hbid,'')
            .scope('reg1',
                pi.add.scope('reg2',
                    pi.add.channelOutCB('reghelpas'+pid+hbid, 'reg1', regASCB)
                        .channelIn('reg1','*')
                        .channelOut('reghelpads'+pid+hbid, 'reg2').channelIn('reg2','*')
                        .channelOut('regout','*').nullProcess()));

        let regRocket : PiAction = pi.add.channelIn('rrocket'+pid+hbid, '') // regenerate armor shield
                .scope('reg1',
                    pi.add.scope('reg2',
                        pi.add.channelOutCB('reghelprs'+pid+hbid, 'reg1', regRSCB)
                            .channelIn('reg1', '*')
                            .channelOut('reghelpads'+pid+hbid, 'reg2').channelIn('reg2', '*')
                            .channelOut('regout', '*').nullProcess()));

        let regNano : PiAction = pi.add.channelIn('rnano'+pid+hbid, '') // regenerate armor shield
            .scope('reg1',
                pi.add.scope('reg2',
                    pi.add.channelOutCB('reghelpns'+pid+hbid, 'reg1', regNSCB)
                        .channelIn('reg1', '*')
                        .channelOut('reghelpads'+pid+hbid, 'reg2').channelIn('reg2', '*')
                        .channelOut('regout', '*').nullProcess()));


        return pi.add.term('AdapShld'+pid+hbid, pi.add.sum([
            pi.add.channelInCB('armor'+pid,'', desADSCB) // adaptive shield of player X
                .channelOut('regout', '')
                .channelOutCB('rshield' + pid + hbid, '', remAdap)
                .nullProcess(),

            pi.add.channelInCB('shield'+pid,'', desADSCB)
                .channelOut('regout','')
                .channelOutCB('rarmor' + pid + hbid, '', remAdap)
                .nullProcess(),

            pi.add.channelInCB('rocket'+pid,'', desADSCB)
                .channelOut('regout', '')
                .channelOutCB('rrocket' + pid + hbid, '', remAdap)
                .nullProcess(),

            regAdap, regShield, regArmor, regRocket, regNano
        ]));
    }

    /**
     * Adds the helper Function for Laser Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param lasShld - term of the laser shield
     */
    private static addPiLaserShieldHelper(pi: PiSystem, pid: string, hbid: string, lasShld: PiTerm){
        pi.pushSymbol(pi.add.replication(pi.add.channelIn('reghelpls'+pid+hbid, 'regout').next(lasShld)));
    }

    /**
     * Adds the helper Function for Armor Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param armShld - term of the armor shield
     */
    private static addPiArmorShieldHelper(pi: PiSystem, pid: string, hbid: string, armShld: PiTerm){
        pi.pushSymbol(pi.add.replication(pi.add.channelIn('reghelpas'+pid+hbid, 'regout').next(armShld)));
    }

    /**
     * Adds the helper Function for Rocket Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param rockShld - term of the rocket shield
     */
    private static addPiRocketShieldHelper(pi: PiSystem, pid: string, hbid: string, rockShld: PiTerm){
        pi.pushSymbol(pi.add.replication(pi.add.channelIn('reghelprs'+pid+hbid, 'regout').next(rockShld)));
    }

    /**
     * Adds the helper Function for Nano Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param nanoShld - term of the nano shield
     */
    private static addPiNanoShieldHelper(pi: PiSystem, pid: string, hbid: string, nanoShld: PiTerm){
        pi.pushSymbol(pi.add.replication(pi.add.channelIn('reghelpns'+pid+hbid, 'regout').next(nanoShld)));
    }

    /**
     * Adds the helper Function for Adaptive Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param adapShld - term of the adaptive shield
     */
    private static addPiAdapShieldHelper(pi: PiSystem, pid: string, hbid: string, adapShld: PiTerm){
        pi.pushSymbol(pi.add.replication(pi.add.channelIn('reghelpads'+pid+hbid, 'regout').next(adapShld)));
    }

    /**
     * Adds the first shield to a hitzone
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param regLSCB
     */
    private static addPiHitzoneShield(pi: PiSystem, pid: string, hbid: string, regLSCB: ()=>any){
        pi.pushSymbol(
            pi.add.channelInCB('rshield'+pid+hbid,'*', regLSCB).scope('reg1',
                pi.add.channelOut('reghelpls'+pid+hbid, 'reg1')
                    .channelIn('reg1', '*').channelOut('hz'+pid, '').nullProcess()
            )
        );
        pi.pushSymbol(pi.add.channelOut('rshield'+pid+hbid, '').nullProcess());
    }

    /**
     * Adds the first armor to a hitzone,
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param regASCB
     */
    private static addPiHitzoneArmor(pi: PiSystem, pid: string, hbid: string, regASCB){
        pi.pushSymbol(
            pi.add.channelInCB('rarmor'+pid+hbid,'*', regASCB).scope('reg1',
                pi.add.channelOut('reghelpas'+pid+hbid, 'reg1')
                    .channelIn('reg1', '*').channelOut('hz'+pid, '').nullProcess()
            )
        );
        pi.pushSymbol(pi.add.channelOut('rarmor'+pid+hbid, '').nullProcess());
    }

}