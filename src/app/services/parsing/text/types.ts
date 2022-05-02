import { CaptionStyle } from "src/app/model/interfaces";

// one or two digits
const clueCaptionExpressionFirstPart = String.raw`\s*\d{1,2}`;

// optional space, a comma or slash, optional space, one or two digits, then an optioanl "across" or "down"
// TO DO: should be followed by a lookahead for a space (ie a space comes next but is not included in the match)
// the lookahead prevents clues such as "22,12 Downwards we go (8)" being parsed as "22,12 Down" and "wards we go (8)"
const clueCaptionExpressionAdditionalPart = String.raw`\s*(,|/)\s*\d{1,2}(\s?(across|down|ac|dn))?`;

// optional asterisk, optional space, (the first grid reference) then zero or more additional grid references
export const clueCaptionExpression = String.raw`^\s*\*?\s*(?<caption>\s*${clueCaptionExpressionFirstPart}(${clueCaptionExpressionAdditionalPart})*)`;

export const clueLetterCountExpression = String.raw`(?<letterCount>\((words|[0-9, -])+?\)\s*$)`;

export interface TextParsingOptions {
    captionStyle: CaptionStyle,
    allowPreamble: boolean,
    allowPostamble: boolean,
    allowTypos?: boolean,
    azedFeatures?: boolean,
    hasLetterCount?: boolean,
    hasClueGroupHeadings?: boolean,
}

export type LineType = 
    
    // contains whitespace only
    "empty" |

    // contains unidentified text
    "unknown" |

    // contains a whole clue eg "12 This is a clue (4)"
    "clue" |

    // contains the start of a clue but no end eg "12 This is a very long"
    "partialClueStart" |

    // contains the end of a clue, but not the start eg "end of a clue (8)"
    "partialClueEnd" |

    // contains an across marker, typically "ACROSS"
    "acrossMarker" |

    // contains a down marker, typically "DOWN"
    "downMarker";

