import { DeltaOperation } from 'quill';
import { DateTime } from 'luxon';
import { ClueEditModel } from '../ui/components/clue-text-editor/clue-text-editor.component';
import { GridLink } from './grid-link';
import { Grid } from './grid';

export type Base64Encoded = string;

export type Direction = "across" | "down";
export type ClueGroup = "across" | "down";
export type ClueValidationWarning = "missing answer" | "missing comment" | "missing definition";

// TO DO: think of a better provider than "grid" for grid-only puzzles
export type PuzzleProvider = "cryptic" | "prize" | "azed" | "everyman" | "quiptic" | "ft" | "independent" | "ios" | "pdf" | "text" | "grid" | "grid-text";  

export type Layouts = "table" | "list";
export type Spacing = "small" | "medium" | "large";
export type TextStyleName = "answer" | "clue" | "definition";

export type GridNavigation = "left" | "right" | "up" | "down" | "absolute" | null;
export type WritingDirection = "static" | "forward" | "backward";

export type ParsingErrorLevel = "warning" | "error";  // and "fatal-error" | "system-error" ??

export type TextParsingErrorCode =
    "unparsed" |
    "exception" |
    
    // naming convention X_Y is: unexpected token X found while in parsing state Y 
    "acrossMarker_across" | 
    "acrossMarker_down" | 
    "acrossMarker_ended" | 

    "downMarker_null" | 
    "downMarker_across" | 
    "downMarker_down" | 
    "downMarker_ended" | 

    "endMarker_null" | 
    "endMarker_across" | 
    "endMarker_down" | 

    "clue_null" | 
    "clue_ended" | 
    "clue_acrossdown" | 

    "clueStart_null" | 
    "clueStart_ended" | 
    "clueStart_acrossdown" | 

    "clueEnd_null" | 
    "clueEnd_ended" | 
    "clueEnd_acrossdown" | 

    "text_null" | 
    "text_across" | 
    "text_down";

export class QuillDelta implements ReadonlyQuillDelta { 
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

export abstract class IGridLink {
    warning: string;
    entries: ReadonlyArray<IGridEntry>;
}

export abstract class IGridReference {
    // for example: 2 down or 23 across
    abstract id: string;
    abstract readonly caption: number;
    abstract readonly direction: Direction; 
}

export abstract class IClue implements ClueEditModel {
    abstract readonly id: string;
    abstract readonly group: ClueGroup;
    abstract readonly caption: string;        // "1 across, 2 down"
    abstract readonly text: string;           // "How to train a dragon (5, 4)"
    abstract readonly letterCount: string;    // "(5, 4)"
    //abstract readonly answer: string;         // the answer entered int the grid
    abstract readonly answers: ReadonlyArray<string>;  // additional columns displayed in the blog (optional)
    abstract readonly solution: string;
    abstract readonly annotation: string;
    abstract readonly redirect: boolean;
    abstract readonly format: string;
    abstract readonly comment: QuillDelta;
    abstract readonly highlight: boolean;
    abstract readonly link: GridLink;
    //abstract readonly entries: ReadonlyArray<IGridEntry>;
    abstract readonly chunks: ReadonlyArray<ITextChunk>;
    abstract readonly warnings: ReadonlyArray<ClueValidationWarning>;
    //abstract readonly gridRefs: ReadonlyArray<IGridReference>;
}

export abstract class IGridEntry {
    abstract readonly gridRef: IGridReference;
    //abstract cellIds(grid: Grid): readonly string[];
}

export abstract class IGridCell {
    abstract readonly id: string;
    abstract readonly x: number;
    abstract readonly y: number;
    abstract readonly caption: number;
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
    abstract readonly provision: IPuzzleProvision;
    abstract readonly capability: IPuzzleCapability;

    abstract readonly grid: IGrid;
    abstract readonly clues: readonly IClue[];

    // TO DO: move linked to puzzle provision as it is temporary
    //abstract readonly linked: boolean;
    
    abstract readonly revision: number;
}

export abstract class IPuzzleCapability {
    // NOTE: a puzzle may be gridable or solveable but still not ready.  This represents the case
    // where there are parse errors or warnings outstanding.  The puzzle is capable of being blogged, 
    // but unless the user manually dismisses the warnings then the puzzle remains not ready and the
    // blogging component should not be available

    abstract readonly ready: boolean;       // puzzle is ready for use, has been fully parsed 

    abstract readonly blogable: boolean;    // puzzle has clues that can be annotated
    abstract readonly gridable: boolean;    // puzzle has a grid clues that can be edited or annotated
    abstract readonly solveable: boolean;   // puzzle has both clues and grid that are linked. Can be solved online.
}

export abstract class IPuzzleProvision {
    abstract readonly source: string;
    abstract readonly parseErrors: ReadonlyArray<ITextParsingError>;
    abstract readonly parseWarnings: ReadonlyArray<ITextParsingWarning>;
    //abstract readonly linkWarnings: ReadonlyArray<ILinkWarning>;
}

export abstract class IPuzzleInfo {
    abstract readonly id: string;
    abstract readonly title: string;
    abstract readonly puzzleDate: Date;
    abstract readonly provider: PuzzleProvider;
    abstract readonly setter: string;
    abstract readonly wordpressId: number;
} 

export abstract class IPublishOptions {
    abstract readonly layout: Layouts;
    abstract readonly textCols: ReadonlyArray<ITextColumn>;
    abstract readonly textStyles: ReadonlyArray<ITextStyle>;
    
    abstract readonly includeGrid: boolean;
    abstract readonly spacing: Spacing;
}

export abstract class ITextStyle {
    abstract readonly name: TextStyleName; 
    abstract readonly color: string;
    abstract readonly bold: boolean;
    abstract readonly italic: boolean;
    abstract readonly underline: boolean;
}

export abstract class ITextColumn {
    abstract readonly caption: string;
    abstract readonly style: TextStyleName;
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

export abstract class IParseToken {
    abstract readonly text: string; 
    abstract readonly lineNumber: number;
    abstract readonly type: Symbol;
}

export abstract class ITokenGroup {
        abstract readonly previous: IParseToken;
        abstract readonly current: IParseToken;
        abstract readonly next: IParseToken;
}


export abstract class ITextParsingError {
    public readonly code: TextParsingErrorCode;
    public readonly tokens: ITokenGroup;
    public readonly message: string;
}

export abstract class ITextParsingWarning {
    public readonly lineNumber: number;
    public readonly message: string;
}

export abstract class ILinkWarning {
    public readonly message: string;
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

export abstract class IPuzzleSummary {
    abstract readonly info: IPuzzleInfo;
    abstract readonly capability: IPuzzleCapability;
}
