import { IPuzzle } from 'src/app/model/interfaces';
import { PuzzleInfoM } from './puzzle-info-m';
import { PublishOptionsM } from './publish-options-m';
import { PuzzleAnnotationM } from './puzzle-annotation-m';
import { GridM } from './grid-m';
import { ClueM } from './clue-m';

export class PuzzleM implements IPuzzle {
    info: PuzzleInfoM;
    publishOptions: PublishOptionsM;
    notes: PuzzleAnnotationM;

    grid: GridM;
    clues: ClueM[];

    linked: boolean;
    solveable: boolean;
    version: string;
    createdWithVersion: string;

    revision: number;
}