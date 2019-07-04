

export class PiAnimFull {
    replications: string[]; //Page, Row
    channelOuts: string[];
    channelIns: string[];
    sums: string[];
    terms: string[];
    drawFct: ()=>any;

    public constructor(){
        this.replications=[];
        this.channelOuts=[];
        this.channelIns=[];
        this.sums=[];
        this.terms=[];
        this.drawFct = ()=>{};
    }

    reset(): void{
        this.replications=[];
        this.channelOuts=[];
        this.channelIns=[];
        this.sums=[];
        this.terms=[];
    }


    addReplication(seq: string): void{
        this.replications.push(seq);
    }

    end(): void{
        this.drawFct();
    }
}