import { IPuzzleInfo, PuzzleProvider } from '../interfaces';
import { PuzzleProvision } from './puzzle-provision';

export class PuzzleInfo implements IPuzzleInfo {
    public readonly id: string;
    public readonly title: string;
    public readonly puzzleDate: Date;
    public readonly provider: PuzzleProvider;
    public readonly setter: string;
    public readonly wordpressId: number;
    public readonly instructions: string;

    public readonly parsing: PuzzleProvision;

    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.puzzleDate = new Date(data.puzzleDate);
        this.provider = data.provider;
        this.setter = data.setter;
        this.wordpressId = data.wordpressId;
        this.instructions = data.instructions;
    }
}
