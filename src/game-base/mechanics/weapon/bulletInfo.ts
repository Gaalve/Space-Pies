
export class BulletInfo {
    public miss: boolean;
    public toX: number;
    public toY: number;

    constructor(miss: boolean, toX: number, toY: number) {
        this.miss = miss;
        this.toX = toX;
        this.toY = toY;
    }
}