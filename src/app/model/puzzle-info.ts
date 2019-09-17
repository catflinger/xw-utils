import { IPuzzleInfo } from './interfaces';

export class PuzzleInfo implements IPuzzleInfo {
    public readonly id: string;
    public readonly title: string;
    public readonly puzzleDate: Date;
    public readonly provider: string;
    public readonly setter: string;

    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.puzzleDate = new Date(data.puzzleDate);
        this.provider = data.provider;
        this.setter = data.setter;
    }
}