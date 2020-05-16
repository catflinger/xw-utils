
import { DateTime } from 'luxon';

/*************************** Type ALIASES FOR IPUZZLE ***************************************/

export type ClueGroup = "across" | "down";
export type Direction = "across" | "down";
export type PuzzleProvider = "cryptic" | "prize" | "azed" | "everyman" | "quiptic" | "ft" | "independent" | "ios" | "pdf" | "text" | "grid" | "grid-text";  
export type ClueValidationWarning = "missing answer" | "missing comment" | "missing definition";
export type Layouts = "table" | "list";
export type Spacing = "small" | "medium" | "large";
export type TextStyleName = "answer" | "clue" | "definition";
export type GridStyle = "standard" | "barred";

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
    caption: number;
    direction: Direction; 
}

export interface IGridEntry {
    gridRef: IGridReference;
}

export interface IGridLink {
    warning: string;
    entries: Array<IGridEntry>;
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
    redirect: boolean;
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
    setGridRefsFromCaptions: boolean;
}

export interface ITextStyle {
    name: TextStyleName; 
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
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
}

export interface IPuzzleCapability {
    // NOTE: a puzzle may be gridable or solveable but still not ready.  This represents the case
    // where there are parse errors or warnings outstanding.  The puzzle is capable of being blogged, 
    // but unless the user manually dismisses the warnings then the puzzle remains not ready and the
    // blogging component should not be available

    ready: boolean;       // puzzle is ready for use, has been fully parsed 
    blogable: boolean;    // puzzle has clues that can be annotated
    gridable: boolean;    // puzzle has a grid clues that can be edited or annotated
    solveable: boolean;   // puzzle has both clues and grid that are linked. Can be solved online.
}

export interface IGridCell {
    id: string;
    x: number;
    y: number;
    caption: number;
    content: string;
    light: boolean;
    rightBar: boolean;
    bottomBar: boolean;
    highlight: boolean;
    shading: string;
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
}

export interface IGrid {
    properties: IGridProperties;
    cells: Array<IGridCell>;
}

export interface IPuzzle {
    revision: number;
    clues: Array<IClue>;
    uncommitted: boolean;

    info: IPuzzleInfo;
    
    options: IPuzzleOptions;
    publishOptions: IPublishOptions;
    notes: IPuzzleAnnotation;
    provision: IPuzzleProvision;
    capability: IPuzzleCapability;
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
    abstract readonly capability: IPuzzleCapability;
}