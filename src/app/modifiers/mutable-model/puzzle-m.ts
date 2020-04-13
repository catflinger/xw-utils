import { IPuzzle } from 'src/app/model/interfaces';
import { PuzzleInfoM } from './puzzle-info-m';
import { PublishOptionsM } from './publish-options-m';
import { PuzzleAnnotationM } from './puzzle-annotation-m';
import { GridM } from './grid-m';
import { ClueM } from './clue-m';
import { PuzzleProvisionM } from './puzzle-provision-m';
import { PuzzleCapabilityM } from './puzzle-capability-m';
import { PuzzleOptionsM } from './puzzle-options-m';

export abstract class PuzzleM implements IPuzzle {
    public abstract info: PuzzleInfoM;
    public abstract options: PuzzleOptionsM;
    public abstract publishOptions: PublishOptionsM;
    public abstract notes: PuzzleAnnotationM;
    public abstract provision: PuzzleProvisionM;
    public abstract capability: PuzzleCapabilityM;
    public abstract grid: GridM;
    public abstract clues: ClueM[];

    //public abstract linked: boolean;

    public abstract revision: number;
    public abstract uncommitted: boolean;
}