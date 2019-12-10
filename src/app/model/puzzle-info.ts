import { IPuzzleInfo, PuzzleProvider } from './interfaces';

export class PuzzleInfo implements IPuzzleInfo {
    public readonly id: string;
    public readonly title: string;
    public readonly puzzleDate: Date;
    public readonly provider: PuzzleProvider;
    public readonly setter: string;
    public readonly wordpressId: number;

    public readonly blogable: boolean;
    public readonly solveable: boolean;
    public readonly gridable: boolean;

    //public readonly ready: boolean;
    public readonly source: string;

    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.puzzleDate = new Date(data.puzzleDate);
        this.provider = data.provider;
        this.setter = data.setter;
        this.wordpressId = data.wordpressId;
        this.blogable = data.blogable;
        this.solveable = data.solveable;
        this.gridable = data.gridable;
        //this.ready = typeof data.ready === "boolean" ? data.ready : true; 
        this.source = typeof data.source === "string" ? data.source : null; 
        }
}
