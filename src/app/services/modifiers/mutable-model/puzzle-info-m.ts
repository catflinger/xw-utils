import { IPuzzleInfo } from 'src/app/model/interfaces';

export abstract class PuzzleInfoM implements IPuzzleInfo {
    public abstract id: string;
    public abstract title: string;
    public abstract puzzleDate: Date;
    public abstract provider: string;
    public abstract setter: string;
    public abstract wordpressId: number;
} 