import { PublishOptions } from './publish-options';
import { PuzzleInfo } from './puzzle-info';
import { PuzzleAnnotation } from './puzzle-annotation';
import { Grid } from './grid';
import { Clue } from './clue';
import { GridCell } from './grid-cell';
import { IPuzzle } from './interfaces';

export const definitionMaskMarker: string = "d";

export class Puzzle implements IPuzzle {
    public readonly info: PuzzleInfo;
    public readonly publishOptions: PublishOptions;
    public readonly notes: PuzzleAnnotation;

    public readonly grid: Grid;
    public readonly clues: readonly Clue[];

    public readonly linked: boolean;
    //public readonly solveable;
    //public readonly version: string;
    //public readonly createdWithVersion: string;

    public readonly revision: number;

    constructor(data: any) {

        this.revision = data.revision ? data.revision : 0;

        if (data.grid) {
            this.grid = new Grid(data.grid);
        } else {
            this.grid = null;
        }
        
        if (data.clues) {
            let clues: Clue[] = [];
            data.clues.forEach(clue => clues.push(new Clue(clue)));
            this.clues = clues;
        } else {
            this.clues = null;
        }

        // backwards compatibility
        if (data.info.solveable === undefined) {
            data.info.solveable = data.solveable;
            data.info.blogable  = true;
            data.info.gridable  = false;
        }

        this.info = new PuzzleInfo(data.info);

        this.notes = new PuzzleAnnotation(data.notes);

        this.publishOptions = new PublishOptions(data.publishOptions);

        this.linked = data.linked;
        //this.version = data.version;
        //this.createdWithVersion = data.createdWithVersion;
    }

    public getSelectedClue(): Clue {
        return this.clues.find((clue) => clue.highlight);
    }
}


