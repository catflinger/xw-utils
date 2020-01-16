import { IPuzzle } from 'src/app/model/interfaces';
import { PuzzleInfoM } from './puzzle-info-m';
import { PublishOptionsM } from './publish-options-m';
import { PuzzleAnnotationM } from './puzzle-annotation-m';
import { GridM } from './grid-m';
import { ClueM } from './clue-m';
import { PuzzleProvisionM } from './puzzle-provision-m';

export abstract class PuzzleM implements IPuzzle {
    public abstract info: PuzzleInfoM;
    public abstract publishOptions: PublishOptionsM;
    public abstract notes: PuzzleAnnotationM;
    public abstract provision: PuzzleProvisionM;
    public abstract grid: GridM;
    public abstract clues: ClueM[];

    public abstract linked: boolean;

    public abstract revision: number;
}