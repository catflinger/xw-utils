
import { DateTime } from 'luxon';

export const latestPuzzleVersion: number = 1; 

/*************************** Type ALIASES FOR IPUZZLE ***************************************/

export type ClueGroup = "across" | "down";
export type Direction = "across" | "down";
export type PuzzleProvider = "cryptic" | "prize" | "azed" | "everyman" | "quiptic" | "ft" | "independent" | "ios" | "pdf" | "local" | "text" | "grid" | "grid-text";  
export type ClueValidationWarning = "missing answer" | "missing comment" | "missing definition";
export type Layouts = "table" | "list";
export type Spacing = "small" | "medium" | "large";
export type TextStyleName = "answer" | "clue" | "definition";
export type GridStyle = "standard" | "barred";
export type CaptionStyle = "numbered" | "alphabetical" | "any";
export type GridLinkMethod = "auto" | "manual";


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

export type ParseTokenType = 
    "StartMarkerToken" | 
    "AcrossMarkerToken" |
    "DownMarkerToken" |
    "EndMarkerToken" |
    "ClueStartToken" |
    "ClueToken" |
    "ClueEndToken" |
    "TextToken" |
    "NullToken"; 

export const GridStyles: {standard: GridStyle, barred: GridStyle} = {
    standard: "standard",
    barred: "barred",
}

/*************************** OTHER MISCELLANOUS TYPE DEFS ***************************************/

export type Base64Encoded = string;

export type GridNavigation = "left" | "right" | "up" | "down" | "absolute" | null;
export type WritingDirection = "static" | "forward" | "backward";
export type ParsingErrorLevel = "warning" | "error";  // and "fatal-error" | "system-error" ??

/*************************** MISCELLANEOUS INTERFACES FOR IPUZZLE ***************************************/

export interface IDeltaOperation {
    insert: any;
}

export interface IQuillDelta {
    ops: Array<IDeltaOperation>;
}

export interface IParseToken {
    text: string; 
    lineNumber: number;
    type: ParseTokenType;
}

export interface ITokenGroup {
    previous: IParseToken;
    current: IParseToken;
    next: IParseToken;
}

export interface ITextParsingError {
    code: TextParsingErrorCode;
    tokens: ITokenGroup;
    message: string;
}

export interface ITextParsingWarning {
    lineNumber: number;
    message: string;
}

export interface IGridReference {
    id: string;
    anchor: number;
    direction: Direction; 
}

export interface IGridLink {
    warning: string;
    gridRefs: Array<IGridReference>;
}

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
    solution: string;
    annotation: string;
    redirect: string;
    format: string;
    highlight: boolean;

    answers: Array<string>;  // additional columns displayed in the blog (optional)
    link: IGridLink;
    
    comment: IQuillDelta;
    chunks: Array<ITextChunk>;
    warnings: Array<ClueValidationWarning>;
}

export interface IPuzzleInfo {
    id: string;
    title: string;
    puzzleDate: Date;
    provider: PuzzleProvider;
    setter: string;
    wordpressId: number;
    instructions: string;
} 

export interface IPuzzleOptions {
    linkMethod: GridLinkMethod;
}

export interface ITextStyle {
    name: TextStyleName; 
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    class: string;
}

export interface ITextColumn {
    caption: string;
    style: TextStyleName;
} 

export interface IPublishOptions {
    layout: Layouts;
    textCols: Array<ITextColumn>;
    textStyles: Array<ITextStyle>;
    
    includeGrid: boolean;
    spacing: Spacing;

    showClueGroups: boolean;
    showClueCaptions: boolean;
}

export interface IPuzzleAnnotation {
    header: IQuillDelta;
    body:  IQuillDelta;
    footer:  IQuillDelta;
}

export interface IPuzzleProvision {
    source: string;
    parseErrors: Array<ITextParsingError>;
    parseWarnings: Array<ITextParsingWarning>;
    captionStyle: CaptionStyle,
    hasLetterCount: boolean,
    hasClueGroupHeadings: boolean,
}

export interface IGridCell {
    // identifier unique in the grid
    id: string;
    
    // x and y are grid cell offsets, the first row has x = 0, the first column has y = 0
    x: number;
    y: number;

    // the grid number: having a non-zero grid number marks the cell as the start of an across or down light
    anchor: number;

    // the letter(s) the cell contains (normally the answer to a clue)
    content: string;

    // decorations: in addition to visual appearance light also indicates the cell is part of a light in the crossword sense (a grid entry cell)
    light: boolean;
    shading: string;
    rightBar: boolean;
    bottomBar: boolean;

    // transitory property indicating the cell is part of a user selection
    highlight: boolean;
    // transitory property indicating the cell is being edited
    edit: boolean;
}

export interface IGridSize {
    across: number;
    down: number;
}

export interface IGridProperties {
    style: GridStyle;
    size: IGridSize;
    symmetrical: boolean;
    numbered: boolean;
}

export interface IGrid {
    properties: IGridProperties;
    cells: Array<IGridCell>;
}

export interface IPuzzle {
    version?: number;
    revision: number;
    clues: Array<IClue>;
    uncommitted: boolean;
    ready: boolean;

    info: IPuzzleInfo;
    
    options: IPuzzleOptions;
    publishOptions: IPublishOptions;
    notes: IPuzzleAnnotation;
    provision: IPuzzleProvision;
    grid: IGrid;
};


/*************************** MICELLANEOUS INTERFACES ***************************************/
// TO DO: find a better home for these

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
    abstract readonly ready: boolean;
    abstract readonly blogable: boolean;
    abstract readonly gridable: boolean;
    abstract readonly solveable: boolean;
}