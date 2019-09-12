import { TextChunk } from './clue-text-chunk';
import { GridSize } from './grid-size';

export type Direction = "across" | "down";
export type GridStyle = "standard" | "barred";
export type ClueGroup = "across" | "down";
export type ClueValidationWarning = "missing answer" | "missing comment" | "missing definition";

export interface ITextChunk {
    text: string;
    isDefinition: boolean;
}

export interface IClue {
    id: string;
    group: ClueGroup;
    caption: string;        // "1 across, 2 down"
    text: string;           // "How to train a dragon (5, 4)"
    letterCount: string;    // "(5, 4)"
    answer: string;
    format: string;
    comment: string;
    highlight: boolean;
    entries: readonly IGridEntry[];
    chunks: readonly TextChunk[];
    warnings: readonly ClueValidationWarning[]; 
}

export interface IGridEntry {
    cellIds: readonly string[];
}

export interface IGridCell {
    id: string;
    x: number;
    y: number;
    caption: string;
    content: string;
    light: boolean;
    rightBar: boolean;
    bottomBar: boolean;
    highlight: boolean;
}

export interface IGrid {
    style: GridStyle;
    size: GridSize;
    cells: readonly IGridCell[];
}

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

export interface IPuzzleInfo {
    id: string;
    title: string;
    puzzleDate: Date;
    providerName: string;
    setter: string;
} 

export interface IPublishOptions {
    answerStyle: ITextStyle;
    clueStyle: ITextStyle;
    definitionStyle: ITextStyle;
}

export interface ITextStyle {
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
}

export interface IPuzzleAnnotation {
    header: string;
    body: string;
    footer: string;
}
export interface IGridSize {
    across: number;
    down: number;
}