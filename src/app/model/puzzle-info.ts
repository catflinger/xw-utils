import { IPuzzleInfo, PuzzleProvider } from './interfaces';
import { PuzzleSource } from './puzzle-source';

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

    public readonly source: PuzzleSource;

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

        if (data.source) {
            this.source = new PuzzleSource(data.source); 
        }
    }
}
