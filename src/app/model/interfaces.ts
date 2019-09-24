import { DeltaOperation } from 'quill';

export type Direction = "across" | "down";
export type GridStyle = "standard" | "barred";
export type ClueGroup = "across" | "down";
export type ClueValidationWarning = "missing answer" | "missing comment" | "missing definition";

export type QuillDelta = { ops: DeltaOperation[] }

// NOTE: using abtract classe rather than interface so that the members can be 
// marked as read-only

export abstract class ITextChunk {
    abstract readonly text: string;
    abstract readonly isDefinition: boolean;
}

export abstract class IClue {
    abstract readonly id: string;
    abstract readonly group: ClueGroup;
    abstract readonly caption: string;        // "1 across, 2 down"
    abstract readonly text: string;           // "How to train a dragon (5, 4)"
    abstract readonly letterCount: string;    // "(5, 4)"
    abstract readonly answer: string;
    abstract readonly format: string;
    abstract readonly comment: QuillDelta;
    abstract readonly highlight: boolean;
    abstract readonly entries: readonly IGridEntry[];
    abstract readonly chunks: readonly ITextChunk[];
    abstract readonly warnings: readonly ClueValidationWarning[]; 
}

export abstract class IGridEntry {
    abstract readonly cellIds: readonly string[];
}

export abstract class IGridCell {
    abstract readonly id: string;
    abstract readonly x: number;
    abstract readonly y: number;
    abstract readonly caption: string;
    abstract readonly content: string;
    abstract readonly light: boolean;
    abstract readonly rightBar: boolean;
    abstract readonly bottomBar: boolean;
    abstract readonly highlight: boolean;
}

export abstract class IGrid {
    abstract readonly style: GridStyle;
    abstract readonly size: IGridSize;
    abstract readonly cells: readonly IGridCell[];
}

export abstract class IPuzzle {
    abstract readonly info: IPuzzleInfo;
    abstract readonly publishOptions: IPublishOptions;
    abstract readonly notes: IPuzzleAnnotation;

    abstract readonly grid: IGrid;
    abstract readonly clues: readonly IClue[];

    abstract readonly linked: boolean;
    abstract readonly solveable: boolean;
    abstract readonly version: string;
    abstract readonly createdWithVersion: string;

    abstract readonly revision: number;
}

export abstract class IPuzzleInfo {
    abstract readonly id: string;
    abstract readonly title: string;
    abstract readonly puzzleDate: Date;
    abstract readonly provider: string;
    abstract readonly setter: string;
    abstract readonly wordpressId: number;
} 

export abstract class IPublishOptions {
    abstract readonly answerStyle: ITextStyle;
    abstract readonly clueStyle: ITextStyle;
    abstract readonly definitionStyle: ITextStyle;
    abstract readonly includeGrid: boolean;
}

export abstract class ITextStyle {
    abstract readonly color: string;
    abstract readonly bold: boolean;
    abstract readonly italic: boolean;
    abstract readonly underline: boolean;
}

export abstract class IPuzzleAnnotation {
    abstract readonly header: QuillDelta;
    abstract readonly body:  QuillDelta;
    abstract readonly footer:  QuillDelta;
}

export abstract class IGridSize {
    abstract readonly across: number;
    abstract readonly down: number;
}