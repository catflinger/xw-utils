import { Line } from '../line';
import { ClueGroup } from 'src/app/model/interfaces';

export const parseTokenTypes = {
    ClueEndToken: Symbol("ClueEndToken"),
    ClueStartToken: Symbol("ClueStartToken"),
    ClueToken: Symbol("ClueToken"),
    AcrossMarkerToken: Symbol("AcrossMarkerToken"),
    DownMarkerToken: Symbol("DownMarkerToken"),
    TextToken: Symbol("TextToken"),
} 

export abstract class ParseToken {
    public readonly text: string; 
    public readonly lineNumber: number;
    public readonly type: Symbol;

    constructor(line: Line, type: Symbol) {
        this.text = line.rawText;
        this.lineNumber= line.lineNumber;
        this.type = type;
    }

    public toString(): string {
        return this.type.toString();
    }

    public toJSON(): any {
        return {
            type: this.type.toString(),
            line: this.lineNumber,
            text: this.text
        };
    }
}

export class AcrossMarkerToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.AcrossMarkerToken);
    }
}

export class DownMarkerToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.DownMarkerToken);
    }
}

export class ClueStartToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.ClueStartToken);
    }
}

export class ClueEndToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.ClueEndToken);
    }
}

export class ClueToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.ClueToken);
    }
}

export class TextToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.TextToken);
    }
}

// export class SyntaxErrorToken extends ParseToken {
//     public readonly message: string;
//     constructor(line, message: string) {
//         super(line, parseTokenTypes.SyntaxErrorToken);
//         this.message = message;
//     }
// }
