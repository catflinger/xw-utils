import { DeltaOperation } from 'quill';
import { DateTime } from 'luxon';

export type Direction = "across" | "down";
export type ClueGroup = "across" | "down";
export type ClueValidationWarning = "missing answer" | "missing comment" | "missing definition";
export type PuzzleProvider = "cryptic" | "prize" | "azed" | "everyman" | "quiptic" | "ft" | "independent" | "ios";
export type Layouts = "table" | "list";
export type Spacings = "small" | "medium" | "large";

export type GridNavigation = "left" | "right" | "up" | "down" | "absolute" | null;

export type WritingDirection = "static" | "forward" | "backward";

export class QuillDelta implements ReadonlyQuillDelta{ 
    ops: DeltaOperation[]
}

export class ReadonlyQuillDelta {
    readonly ops: ReadonlyArray<DeltaOperation>;
}

export type GridStyle = "standard" | "barred";
export const GridStyles: {standard: GridStyle, barred: GridStyle} = {
    standard: "standard",
    barred: "barred",
}

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
    abstract readonly solution: string;
    abstract readonly annotation: string;
    abstract readonly redirect: boolean;
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
    abstract readonly shading: string;
    abstract readonly edit: boolean;
}

export abstract class IGridProperties {
    abstract readonly style: GridStyle;
    abstract readonly size: IGridSize;
    abstract readonly symmetrical: boolean;
}

export abstract class IGrid {
    abstract readonly properties: IGridProperties;
    abstract readonly cells: readonly IGridCell[];
}

export abstract class IPuzzle {
    abstract readonly info: IPuzzleInfo;
    abstract readonly publishOptions: IPublishOptions;
    abstract readonly notes: IPuzzleAnnotation;

    abstract readonly grid: IGrid;
    abstract readonly clues: readonly IClue[];

    abstract readonly linked: boolean;
    abstract readonly version: string;
    abstract readonly createdWithVersion: string;

    abstract readonly revision: number;
}

export abstract class IPuzzleInfo {
    abstract readonly id: string;
    abstract readonly title: string;
    abstract readonly puzzleDate: Date;
    abstract readonly provider: PuzzleProvider;
    abstract readonly setter: string;
    abstract readonly wordpressId: number;

    abstract readonly blogable: boolean;
    abstract readonly solveable: boolean;
    abstract readonly gridable: boolean;
} 

export abstract class IPublishOptions {
    abstract readonly layout: Layouts;
    abstract readonly answerStyle: ITextStyle;
    abstract readonly clueStyle: ITextStyle;
    abstract readonly definitionStyle: ITextStyle;
    abstract readonly includeGrid: boolean;
    abstract readonly spacing: Spacings;
}

export abstract class ITextStyle {
    abstract readonly color: string;
    abstract readonly bold: boolean;
    abstract readonly italic: boolean;
    abstract readonly underline: boolean;
}

export abstract class IPuzzleAnnotation {
    abstract readonly header: ReadonlyQuillDelta;
    abstract readonly body:  ReadonlyQuillDelta;
    abstract readonly footer:  ReadonlyQuillDelta;
}

export abstract class IGridSize {
    abstract readonly across: number;
    abstract readonly down: number;
}

export abstract class IDiary {
    abstract readonly entries: readonly IDiaryEntry[]
}

export abstract class IDiaryEntry {
    abstract readonly solver: string;
    abstract readonly provider: string;
    abstract readonly solveDate: DateTime;
    abstract readonly postDate: DateTime;
    abstract readonly solve: boolean;
}
