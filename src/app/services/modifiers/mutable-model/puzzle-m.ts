import { IPuzzle } from 'src/app/model/interfaces';
import { PuzzleInfoM } from './puzzle-info-m';
import { PublishOptionsM } from './publish-options-m';
import { PuzzleAnnotationM } from './puzzle-annotation-m';
import { GridM } from './grid-m';
import { ClueM } from './clue-m';

export abstract class PuzzleM implements IPuzzle {
    public abstract info: PuzzleInfoM;
    public abstract publishOptions: PublishOptionsM;
    public abstract notes: PuzzleAnnotationM;

    public abstract grid: GridM;
    public abstract clues: ClueM[];

    public abstract linked: boolean;
    //public abstract solveable: boolean;
    //public abstract version: string;
    //public abstract createdWithVersion: string;

    public abstract revision: number;
}