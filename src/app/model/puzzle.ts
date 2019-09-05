import { PublishOptions, IPublishOptions } from './publish-options';
import { PuzzleInfo, IPuzzleInfo } from './puzzle-info';
import { PuzzleAnnotation, IPuzzleAnnotation } from './puzzle-annotation';
import { Grid, IGrid } from './grid';
import { Clue, IClue } from './clue';
import { GridCell } from './grid-cell';

export type Direction = "across" | "down";
export type GridStyle = "standard" | "barred";
export type ClueGroup = "across" | "down";

export const definitionMaskMarker: string = "d";

export interface IPuzzle {
    info: IPuzzleInfo;
    publishOptions: IPublishOptions;
    notes: IPuzzleAnnotation;

    grid: IGrid;
    clues: readonly IClue[];

    linked: boolean;
    solveable: boolean;
    version: string;
    createdWithVersion: string;

    revision: number;
}

export class Puzzle implements IPuzzle {
    public readonly info: PuzzleInfo;
    public readonly publishOptions: PublishOptions;
    public readonly notes: PuzzleAnnotation;

    public readonly grid: Grid;
    public readonly clues: readonly Clue[];

    public readonly linked: boolean;
    public readonly solveable;
    public readonly version: string;
    public readonly createdWithVersion: string;

    public readonly revision: number;

    constructor(data: any) {

        this.revision = data.revision ? data.revision : 0;

        if (data.grid) {
            this.grid = new Grid(data.grid);
        } else {
            this.grid = null;
        }
        
        let clues: Clue[] = [];
        data.clues.forEach(clue => clues.push(new Clue(clue)));
        this.clues = clues;

        this.info = new PuzzleInfo(data.info);

        this.notes = new PuzzleAnnotation(data.notes);

        this.publishOptions = new PublishOptions(data.publishOptions);

        this.linked = data.linked;
        this.solveable = data.solveable;
        this.version = data.version;
        this.createdWithVersion = data.createdWithVersion;
    }

    public cellAt(x: number, y: number): GridCell {
        return this.grid.cells.find((cell) => cell.x === x && cell.y === y);
    }

    public getSelectedClue(): Clue {
        return this.clues.find((clue) => clue.highlight);
    }

    public getLatestAnswer(clueId: string): string {
        let result: string = "";
        let clue = this.clues.find((clue) => clue.id === clueId);
        clue.entries.forEach((entry) => {
            entry.cellIds.forEach((id) => {
                let cell = this.grid.cells.find((cell) => cell.id === id);
                let letter = cell.content.length > 0 ? cell.content.charAt(0) : "_"
                result += letter + " ";
            })
        });

        return result.trim();
    }

}


