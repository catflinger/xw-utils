import { Record, List, } from "immutable";

/***************************************
 * This is what the JSON will be like
 * 
 * TO DO: this has to manually kept in sync with teh readonly store entities 
 * This is error prone - find a way to bind this to the store interfaces
 * 
interface IPuzzle {
    revision: number;
    clues: IClue[];
}
interface IClue {
    id: string;
}
****************************************/

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


interface ImDeltaOperation {
    readonly insert: any;
}

interface ImQuillDelta {
    readonly ops: List<ImDeltaOperation>;
}

export interface ImParseToken {
    readonly text: string; 
    readonly lineNumber: number;
    readonly type: Symbol;
}

export interface ImTokenGroup {
    readonly previous: ImParseToken;
    readonly current: ImParseToken;
    readonly next: ImParseToken;
}

export interface ImTextParsingError {
    readonly code: TextParsingErrorCode;
    readonly tokens: ImTokenGroup;
    readonly message: string;
}

export interface ImTextParsingWarning {
    readonly lineNumber: number;
    readonly message: string;
}

export interface ImGridReference {
    readonly id: string;
    readonly caption: number;
    readonly direction: Direction; 
}

export interface ImGridEntry {
    readonly gridRef: ImGridReference;
}

export interface ImGridLink {
    warning: string;
    entries: List<ImGridEntry>;
}

export interface ImTextChunk {
    readonly text: string;
    readonly isDefinition: boolean;
}

export interface ImClue {
    readonly id: string;
    readonly group: ClueGroup;
    readonly caption: string;        // "1 across, 2 down"
    readonly text: string;           // "How to train a dragon (5, 4)"
    readonly letterCount: string;    // "(5, 4)"
    readonly solution: string;
    readonly annotation: string;
    readonly redirect: boolean;
    readonly format: string;
    readonly highlight: boolean;

    readonly answers: List<string>;  // additional columns displayed in the blog (optional)
    readonly link: ImGridLink;
    
    readonly comment: ImQuillDelta;
    readonly chunks: List<ImTextChunk>;
    readonly warnings: List<ClueValidationWarning>;
}

export interface ImPuzzleInfo {
    readonly id: string;
    readonly title: string;
    readonly puzzleDate: Date;
    readonly provider: PuzzleProvider;
    readonly setter: string;
    readonly wordpressId: number;
} 

export interface ImPuzzleOptions {
    readonly setGridRefsFromCaptions: boolean;
}

export interface ImTextStyle {
    readonly name: TextStyleName; 
    readonly color: string;
    readonly bold: boolean;
    readonly italic: boolean;
    readonly underline: boolean;
}

export interface ImTextColumn {
    readonly caption: string;
    readonly style: TextStyleName;
} 

export interface ImPublishOptions {
    readonly layout: Layouts;
    readonly textCols: List<ImTextColumn>;
    readonly textStyles: List<ImTextStyle>;
    
    readonly includeGrid: boolean;
    readonly spacing: Spacing;
}

export interface ImPuzzleAnnotation {
    readonly header: ImQuillDelta;
    readonly body:  ImQuillDelta;
    readonly footer:  ImQuillDelta;
}

export interface ImPuzzleProvision {
    readonly source: string;
    readonly parseErrors: List<ImTextParsingError>;
    readonly parseWarnings: List<ImTextParsingWarning>;
}

export interface ImPuzzleCapability {
    // NOTE: a puzzle may be gridable or solveable but still not ready.  This represents the case
    // where there are parse errors or warnings outstanding.  The puzzle is capable of being blogged, 
    // but unless the user manually dismisses the warnings then the puzzle remains not ready and the
    // blogging component should not be available

    readonly ready: boolean;       // puzzle is ready for use, has been fully parsed 
    readonly blogable: boolean;    // puzzle has clues that can be annotated
    readonly gridable: boolean;    // puzzle has a grid clues that can be edited or annotated
    readonly solveable: boolean;   // puzzle has both clues and grid that are linked. Can be solved online.
}

export interface ImGridCell {
    readonly id: string;
    readonly x: number;
    readonly y: number;
    readonly caption: number;
    readonly content: string;
    readonly light: boolean;
    readonly rightBar: boolean;
    readonly bottomBar: boolean;
    readonly highlight: boolean;
    readonly shading: string;
    readonly edit: boolean;
}

export interface ImGridSize {
    readonly across: number;
    readonly down: number;
}

export interface ImGridProperties {
    readonly style: GridStyle;
    readonly size: ImGridSize;
    readonly symmetrical: boolean;
}

export interface ImGrid {
    readonly properties: ImGridProperties;
    readonly cells: List<ImGridCell>;
}

export interface ImPuzzle {
    readonly revision: number;
    readonly clues: List<ImClue>;
    readonly uncommitted: boolean;

    readonly info: ImPuzzleInfo;
    
    readonly options: ImPuzzleOptions;
    readonly publishOptions: ImPublishOptions;
    readonly notes: ImPuzzleAnnotation;
    readonly provision: ImPuzzleProvision;
    readonly capability: ImPuzzleCapability;
    readonly grid: ImGrid;
};

//*************************************************************

const puzzleCapabilityRecordFactory = Record<ImPuzzleCapability>({
    ready: false,
    blogable: false,
    gridable: false,
    solveable: false,
});

const textColumnRecordFactory = Record<ImTextColumn>({
    caption: null,
    style: null,
});

const textStyleRecordFactory = Record<ImTextStyle>({
    name: null,
    bold: false,
    italic: false,
    underline: false,
    color: null,
});

const publishOptionsRecordFactory = Record<ImPublishOptions>({
    layout: null,
    includeGrid: false,
    spacing: null,
    textCols: List<ImTextColumn>(),
    textStyles: List<ImTextStyle>(),
});

const textChunkRecordFactory = Record<ImTextChunk>({
    text: null,
    isDefinition: false,
});

const deltaOperationRecordFactory = Record<ImDeltaOperation>({
    insert: null
})

const quillDeltaRecordFactory = Record<ImQuillDelta>({
    ops: List<ImDeltaOperation>(),
});

const puzzleOptionsRecordFactory = Record<ImPuzzleOptions>({
    setGridRefsFromCaptions: true
});

const puzzleInfoRecordFactory = Record<ImPuzzleInfo>({
    id: null,
    title: null,
    puzzleDate: null,
    provider: null,
    setter: null,
    wordpressId: null,
});

const puzzleAnnotationRecordFactory = Record<ImPuzzleAnnotation>({
    header: quillDeltaRecordFactory({ ops: List<ImDeltaOperation>() }),
    body: quillDeltaRecordFactory({ ops: List<ImDeltaOperation>() }),
    footer: quillDeltaRecordFactory({ ops: List<ImDeltaOperation>() }),
});

const parseTokenRecordFactory = Record<ImParseToken>({
    text: null, 
    lineNumber: null,
    type: null,
})

const tokenGroupRecordFactory = Record<ImTokenGroup>({
    previous: parseTokenRecordFactory(),
    current: parseTokenRecordFactory(),
    next: parseTokenRecordFactory(),

});

const textParsingErrorRecordFactory = Record<ImTextParsingError>({
    code: null,
    tokens: tokenGroupRecordFactory(),
    message: null,

});

const puzzleProvisionRecordFactory = Record<ImPuzzleProvision>({
    source: null,
    parseErrors: List<ImTextParsingError>(),
    parseWarnings: List<ImTextParsingWarning>(),
});

const gridCellRecordFactory = Record<ImGridCell>({
    id: null,
    x: null,
    y: null,
    caption: null,
    content: null,
    light: false,
    rightBar: false,
    bottomBar: false,
    highlight: false,
    shading: null,
    edit: false,
});

const gridSizeRecordFactory = Record<ImGridSize>({
    across: null,
    down: null,
});

const gridPropertiesRecordFactory = Record<ImGridProperties>({
    style: null,
    size: gridSizeRecordFactory(),
    symmetrical: false,
});

const gridRecordFactory = Record<ImGrid>({
    properties: gridPropertiesRecordFactory(),
    cells: List<ImGridCell>(),
});

const puzzleRecordFactory = Record<ImPuzzle>({
    revision: null,
    uncommitted: false,
    clues: List<ImClue>(),
    info: puzzleInfoRecordFactory(),
    options: puzzleOptionsRecordFactory(),
    publishOptions: publishOptionsRecordFactory(),
    notes: puzzleAnnotationRecordFactory(),
    provision: puzzleProvisionRecordFactory(),
    capability: puzzleCapabilityRecordFactory(),
    grid: gridRecordFactory(),
});

const gridLinkRecordFactory = Record<ImGridLink>({
    warning: null,
    entries: List<ImGridEntry>(),
})

const clueRecordFactory = Record<ImClue>({
    id: null, 
    group: null,
    caption: null,
    text: null,
    letterCount: null,
    solution: null,
    annotation: null,
    redirect: null,
    highlight: null,
    format: null,
    answers: List<string>(),
    link: gridLinkRecordFactory(),
    comment: quillDeltaRecordFactory(),
    chunks: List<ImTextChunk>(),
    warnings: List<ClueValidationWarning>(),
});

// Each factory when invoked will create an instance of a record
// for example: call recordFactories.clue() will return a clue record
export const recordFactories = {
    puzzle: puzzleRecordFactory,
    puzzleInfo: puzzleInfoRecordFactory,
    puzzleOptions: puzzleOptionsRecordFactory,
    puzzleAnnotationRecordFactory,

    clue: clueRecordFactory,
    gridLink: gridLinkRecordFactory,
    textChunk: textChunkRecordFactory,
    textStyle: textStyleRecordFactory,
    textColumn: textColumnRecordFactory,

    quillDelta: quillDeltaRecordFactory,
    deltaOp: deltaOperationRecordFactory,

    //TO DO: finish adding these...
};
