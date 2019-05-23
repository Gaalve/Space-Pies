import {Player} from "../player";
import {PiSystem} from "../picalc/pi-system";
import {Healthbar} from "./healthbar";
import {PiTerm} from "../picalc/pi-term";
import {HealthType} from "./health-type";

export class Health {
    private player: Player;
    private shipBar: Healthbar;
    private readonly zone1Bar: Healthbar;
    private readonly zone2Bar: Healthbar;
    private readonly zone3Bar: Healthbar;
    private readonly zone4Bar: Healthbar;
    public constructor(scene: Phaser.Scene, player: Player, pi: PiSystem){
        this.player = player;
        this.shipBar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, false, 120);
        this.zone1Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 170);
        this.zone2Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 220);
        this.zone3Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 270);
        this.zone4Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 320);

        const pid = player.getNameIdentifier();
        // todo: kara animate
        pi.pushSymbol(
            pi.add.channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar("hz"+pid)})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar("hz"+pid)})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar("hz"+pid)})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar("hz"+pid)})
                .process("CoreExplosion"+pid, ()=>{console.log(pid+" lost.")})
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
        let lasShld = Health.getPiLaserShield(pi, pid, hbid, ()=>{zoneBar.destroyBar("someterm")},
            ()=>{zoneBar.addBar(HealthType.ShieldBar)}, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
        let armShld = Health.getPiArmorShield(pi, pid, hbid, ()=>{zoneBar.destroyBar("someterm")},
            ()=>{zoneBar.addBar(HealthType.ShieldBar)}, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
        Health.addPiLaserShieldHelper(pi, pid, hbid, lasShld);
        Health.addPiArmorShieldHelper(pi, pid, hbid, armShld);
        Health.addPiHitzoneShield(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ArmorBar)});
    }
    private createHitZoneInPiArmor(pi: PiSystem, pid:string, hbid: string, zoneBar: Healthbar){
        let lasShld = Health.getPiLaserShield(pi, pid, hbid, ()=>{zoneBar.destroyBar("someterm")},
            ()=>{zoneBar.addBar(HealthType.ShieldBar)}, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
        let armShld = Health.getPiArmorShield(pi, pid, hbid, ()=>{zoneBar.destroyBar("someterm")},
            ()=>{zoneBar.addBar(HealthType.ShieldBar)}, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
        Health.addPiLaserShieldHelper(pi, pid, hbid, lasShld);
        Health.addPiArmorShieldHelper(pi, pid, hbid, armShld);
        Health.addPiHitzoneArmor(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ArmorBar)});
    }

    public addToHz(pi: PiSystem, name: string, hzid: string){
        pi.pushSymbol(pi.add.channelOut(name+this.player.getNameIdentifier()+hzid, '').nullProcess());
    }

    /**
     * Retruns the normal Function for Laser Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param desLSCB - callback to destroy a laser shield bar
     * @param regLSCB - callback to regenerate laser shield bar
     * @param regASCB - callback to regenerate armor shield bar
     */
    private static getPiLaserShield(pi: PiSystem, pid: string, hbid: string, desLSCB: Function,
                             regLSCB: Function, regASCB: Function): PiTerm{
        return pi.add.term('LasShld'+pid+hbid, pi.add.sum([
            pi.add.channelInCB('shield'+pid,'', desLSCB) // laser shield of player X
                .channelOut('regout', '') // sync
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
                .channelOut('regout', '*').nullProcess()))
        ]));
    }

    /**
     * Retruns the normal Function for Armor Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param desASCB - callback to destroy a armor shield bar
     * @param regLSCB - callback to regenerate laser shield bar
     * @param regASCB - callback to regenerate armor shield bar
     */
    private static getPiArmorShield(pi: PiSystem, pid: string, hbid: string, desASCB: Function,
                                    regLSCB: Function, regASCB: Function): PiTerm{
        return pi.add.term('ArmShld'+pid+hbid, pi.add.sum([
            pi.add.channelInCB('armor'+pid,'', desASCB) // laser shield of player X
                .channelOut('regout', '') // sync
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
                .channelOut('regout', '*').nullProcess()))
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
     * Adds the first shield to a hitzone
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param regLSCB
     */
    private static addPiHitzoneShield(pi: PiSystem, pid: string, hbid: string, regLSCB: Function){
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