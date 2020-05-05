import { PublishOptions } from './publish-options';
import { PuzzleInfo } from './puzzle-info';
import { PuzzleAnnotation } from './puzzle-annotation';
import { Grid } from './grid';
import { Clue } from './clue';
import { IPuzzle } from '../interfaces';
import { PuzzleProvision } from './puzzle-provision';
import { PuzzleCapability } from './puzzle-capability';
import { PuzzleOptions } from './puzzle-options';

export const definitionMaskMarker: string = "d";

export class Puzzle implements IPuzzle {
    public readonly info: PuzzleInfo;
    public readonly options: PuzzleOptions;
    public readonly publishOptions: PublishOptions;
    public readonly notes: PuzzleAnnotation;
    public readonly provision: PuzzleProvision;
    public readonly capability: PuzzleCapability;
    public uncommitted: boolean;

    public readonly grid: Grid;
    public readonly clues: Clue[];
    //public readonly linked: boolean;

    public revision: number;

    constructor(data: any) {

        this.revision = data.revision ? data.revision : 0;

        this.uncommitted = !!data.uncommitted;

        this.options = new PuzzleOptions(data.options);

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
        // backwards compatibility
        if (data.capability === undefined) {
            data.capability = {
                ready: true,
                solveable: data.info.solveable,
                blogable: data.info.blogable,
                gridable: data.info.blogable,
            };
        }

        this.provision = data.provision ? new PuzzleProvision(data.provision) : null;
        this.info = new PuzzleInfo(data.info);
        this.notes = new PuzzleAnnotation(data.notes);
        this.publishOptions = new PublishOptions(data.publishOptions);
        this.capability = new PuzzleCapability(data.capability);

        //this.linked = data.linked;
    }

    public getSelectedClue(): Clue {
        return this.clues.find((clue) => clue.highlight);
    }
}


