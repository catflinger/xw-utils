import { PublishOptions } from './publish-options';
import { PuzzleInfo } from './puzzle-info';
import { PuzzleAnnotation } from './puzzle-annotation';
import { Grid } from './grid';
import { Clue } from './clue';
import { ClueGroup, IPuzzle } from '../interfaces';
import { PuzzleProvision } from './puzzle-provision';
import { PuzzleOptions } from './puzzle-options';

export const definitionMaskMarker: string = "d";

export class Puzzle implements IPuzzle {
    public readonly info: PuzzleInfo;
    public readonly options: PuzzleOptions;
    public readonly publishOptions: PublishOptions;
    public readonly notes: PuzzleAnnotation;
    public readonly provision: PuzzleProvision;
    public readonly ready: boolean;
    public uncommitted: boolean;
    public readonly version: number;

    public readonly grid: Grid;
    public readonly clues: Clue[];
    //public readonly linked: boolean;

    public revision: number;

    constructor(data: any) {

        this.version = data.version ? data.version : 0;

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

        this.provision = new PuzzleProvision( data.provision || { 
            captionStyle: "numbered"
        } );
        
        this.info = new PuzzleInfo(data.info);
        
        if (data.notes) {
            this.notes = new PuzzleAnnotation(data.notes);
        }
        
        if (data.publishOptions) {
            this.publishOptions = new PublishOptions(data.publishOptions);
        }
        this.ready = typeof data.ready === "boolean" ? data.ready : false;

    }

    public getSelectedClue(): Clue {
        return this.clues.find((clue) => clue.highlight);
    }

    public get hasSolutions(): boolean {
        let result = false;

        if (this.clues) {
            if (this.clues.find((c) => c.solution)) {
                result = true;
            }
        }

        return result;
    }

    public get parseable(): boolean {
        // TDO DO: think if this shold be more robust, check provider perhaps
        return this.provision && !!this.provision.source;
    }

    public get blogable(): boolean {
        return !!this.clues;
    }

    public get solveable(): boolean {
        return !!this.clues && !!this.grid;
    }

    public get gridable(): boolean {
        return !this.clues && !!this.grid;
    }

    public getMaxClueCaption(group: ClueGroup): number {
        if (this.provision.captionStyle === "numbered") {
            this.clues
            .filter(c => c.group === group)
            .reduce<number>(
                (acc: number, current: Clue) => Math.max(acc, parseInt(current.caption)), 
                0
            );
        } else {
            return 0;
        }
    }

}


