

export class Player {
    private nameIdentifier: string;

    public constructor(nameIdentifier: string){
        this.nameIdentifier = nameIdentifier;
    }

    getNameIdentifier(): string{
        return this.nameIdentifier;
    }
}