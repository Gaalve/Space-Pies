import {Player} from "../player";
import {PiSystem} from "../picalc/pi-system";
import {Healthbar} from "./healthbar";
import {PiTerm} from "../picalc/pi-term";
import {HealthType} from "./health-type";

export class Health {
    private player: Player;
    private shipBar: Healthbar;
    private zone1Bar: Healthbar;
    private zone2Bar: Healthbar;
    private zone3Bar: Healthbar;
    private zone4Bar: Healthbar;
    public constructor(scene: Phaser.Scene, player: Player, pi: PiSystem){
        this.player = player;
        this.shipBar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, false, 120);
        this.zone1Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 170);
        this.zone2Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 220);
        this.zone3Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 270);
        this.zone4Bar = new Healthbar(scene, player.isFirstPlayer() ? 1 : -1, true, 320);

        const pid = player.getNameIdentifier();
        pi.pushSymbol(
            pi.add.channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .channelInCB("hz"+pid, '', ()=>{this.shipBar.destroyBar()})
                .process("CoreExplosion"+pid, ()=>{console.log(pid+" lost.")})
        );
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);
        this.shipBar.addBar(HealthType.HitZoneBar);

        /**
         * Adding HitZone Pi-Terms
         */
        {
            let hbid: string = "z1";
            let zoneBar: Healthbar = this.zone1Bar;
            let regLS = Health.getPiRegLaserShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ShieldBar)});
            let regAS = Health.getPiRegArmorShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
            let lasShld = Health.getPiLaserShield(pi, pid, hbid, ()=>{console.log("destorying Bar");zoneBar.destroyBar()}, regLS, regAS);
            let armShld = Health.getPiArmorShield(pi, pid, hbid, ()=>{zoneBar.destroyBar()}, regLS, regAS);
            Health.addPiLaserShieldHelper(pi, pid, hbid, lasShld);
            Health.addPiArmorShieldHelper(pi, pid, hbid, armShld);
            Health.addPiHitzoneShield(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ShieldBar)});
        }
        {
            let hbid: string = "z2";
            let zoneBar: Healthbar = this.zone2Bar;
            let regLS = Health.getPiRegLaserShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ShieldBar)});
            let regAS = Health.getPiRegArmorShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
            let lasShld = Health.getPiLaserShield(pi, pid, hbid, ()=>{zoneBar.destroyBar()}, regLS, regAS);
            let armShld = Health.getPiArmorShield(pi, pid, hbid, ()=>{zoneBar.destroyBar()}, regLS, regAS);
            Health.addPiLaserShieldHelper(pi, pid, hbid, lasShld);
            Health.addPiArmorShieldHelper(pi, pid, hbid, armShld);
            Health.addPiHitzoneShield(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ShieldBar)});
        }
        {
            let hbid: string = "z3";
            let zoneBar: Healthbar = this.zone3Bar;
            let regLS = Health.getPiRegLaserShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ShieldBar)});
            let regAS = Health.getPiRegArmorShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
            let lasShld = Health.getPiLaserShield(pi, pid, hbid, ()=>{zoneBar.destroyBar()}, regLS, regAS);
            let armShld = Health.getPiArmorShield(pi, pid, hbid, ()=>{zoneBar.destroyBar()}, regLS, regAS);
            Health.addPiLaserShieldHelper(pi, pid, hbid, lasShld);
            Health.addPiArmorShieldHelper(pi, pid, hbid, armShld);
            Health.addPiHitzoneArmor(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ArmorBar)});
        }
        {
            let hbid: string = "z4";
            let zoneBar: Healthbar = this.zone4Bar;
            let regLS = Health.getPiRegLaserShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ShieldBar)});
            let regAS = Health.getPiRegArmorShield(pi, pid, hbid, ()=>{zoneBar.addBar(HealthType.ArmorBar)});
            let lasShld = Health.getPiLaserShield(pi, pid, hbid, ()=>{zoneBar.destroyBar()}, regLS, regAS);
            let armShld = Health.getPiArmorShield(pi, pid, hbid, ()=>{zoneBar.destroyBar()}, regLS, regAS);
            Health.addPiLaserShieldHelper(pi, pid, hbid, lasShld);
            Health.addPiArmorShieldHelper(pi, pid, hbid, armShld);
            Health.addPiHitzoneArmor(pi, pid, hbid,()=>{zoneBar.addBar(HealthType.ArmorBar)});
        }
    }

    public addToHz(pi: PiSystem, name: string, hzid: string){
        pi.pushSymbol(pi.add.channelOut(name+this.player.getNameIdentifier()+hzid, '').nullProcess());
    }

    /**
     * Returns the regenerative Function for Laser Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param regLSCB - callback to regenerate a laser shield bar
     */
    private static getPiRegLaserShield(pi: PiSystem, pid: string, hbid: string, regLSCB: Function): PiTerm{
        return pi.add.term('RegLS'+pid+hbid,
            pi.add.scope('reg1',
            pi.add.scope('reg2',
            pi.add.channelOutCB('reghelpls'+pid+hbid, 'reg1', regLSCB)
            .channelIn('reg1', '*')
            .channelOut('reghelpls'+pid+hbid, 'reg2').channelIn('reg2', '*')
            .channelOut('regout', '*').nullProcess()
        )));
    }

    /**
     * Returns the regenerative Function for Armor Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbid - health bar id
     * @param regASCB - callback to regenerate a armor shield bar
     */
    private static getPiRegArmorShield(pi: PiSystem, pid: string, hbid: string, regASCB: Function): PiTerm{
        return pi.add.term('RegAS'+pid+hbid,
            pi.add.scope('reg1',
            pi.add.scope('reg2',
            pi.add.channelOutCB('reghelpas'+pid+hbid, 'reg1', regASCB)
            .channelIn('reg1', '*')
            .channelOut('reghelpas'+pid+hbid, 'reg2').channelIn('reg2', '*')
            .channelOut('regout', '*').nullProcess()
        ))
        );
    }

    /**
     * Retruns the normal Function for Laser Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbig - health bar id
     * @param desLSCB - callback to destroy a laser shield bar
     * @param regLS - pi term to regenerate laser shield
     * @param regAS - pi term to regenerate armor shield
     */
    private static getPiLaserShield(pi: PiSystem, pid: string, hbig: string, desLSCB: Function,
                             regLS: PiTerm, regAS: PiTerm): PiTerm{
        return pi.add.term('LasShld'+pid+hbig, pi.add.sum([
            pi.add.channelInCB('shield'+pid,'', desLSCB) // laser shield of player X
                .channelOut('regout', '') // sync
                .nullProcess(),
            pi.add.channelIn('rshield'+pid+hbig, '') // regenerate laser shield
                .next(regLS),
            pi.add.channelIn('rarmor'+pid+hbig, '') // regenerate armor shield
                .next(regAS)
        ]));
    }

    /**
     * Returns the normal Function for Laser Shields
     * @param pi - pi system
     * @param pid - player id
     * @param hbig - health bar id
     * @param desLSCB - callback to destroy a laser shield bar
     * @param regLS - pi term to regenerate laser shield
     * @param regAS - pi term to regenerate armor shield
     */
    private static getPiArmorShield(pi: PiSystem, pid: string, hbig: string, desLSCB: Function,
                             regLS: PiTerm, regAS: PiTerm): PiTerm{
        return pi.add.term('ArmShld'+pid+hbig, pi.add.sum([
            pi.add.channelInCB('armor'+pid,'', desLSCB) // armor shield of player X
                .channelOut('regout', '') // sync
                .nullProcess(),
            pi.add.channelIn('rshield'+pid+hbig, '') // regenerate laser shield
                .next(regLS),
            pi.add.channelIn('rarmor'+pid+hbig, '') // regenerate armor shield
                .next(regAS)
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