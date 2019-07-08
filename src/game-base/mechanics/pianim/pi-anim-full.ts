

export class PiAnimFull {
    replications: string[]; //Page, Row
    drawFct: ()=>any;

    public constructor(){
        this.replications=[];
        this.drawFct = ()=>{};
    }

    reset(): void{
        this.replications=[];
    }


    addReplication(seq: string): void{
        this.replications.push(seq);
    }

    end(): void{
        this.drawFct();
    }
}