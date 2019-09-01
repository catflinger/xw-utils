export interface IPuzzleAnnotation {
    header: string;
    body: string;
    footer: string;
}

export class PuzzleAnnotation implements IPuzzleAnnotation {
    public readonly header: string;
    public readonly body: string;
    public readonly footer: string;

    constructor(data: any) {
        this.header = data.header;
        this.body = data.body;
        this.footer = data.footer;
    }
}