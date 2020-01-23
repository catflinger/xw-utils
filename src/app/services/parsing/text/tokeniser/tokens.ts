import { Line } from '../line';
import { IParseToken } from 'src/app/model/interfaces';

export const parseTokenTypes = {

    StartMarker: Symbol("StartMarkerToken"),
    AcrossMarker: Symbol("AcrossMarkerToken"),
    DownMarker: Symbol("DownMarkerToken"),
    EndMarker: Symbol("EndMarkerToken"),

    ClueStart: Symbol("ClueStartToken"),
    Clue: Symbol("ClueToken"),
    ClueEnd: Symbol("ClueEndToken"),

    Text: Symbol("TextToken"),

    Null: Symbol("NullToken"),
} 

abstract class ParseToken implements IParseToken {
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
        super(line, parseTokenTypes.AcrossMarker);
    }
}

export class DownMarkerToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.DownMarker);
    }
}

export class ClueStartToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.ClueStart);
    }
}

export class ClueEndToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.ClueEnd);
    }
}

export class ClueToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.Clue);
    }
}

export class TextToken extends ParseToken {
    constructor(line: Line) {
        super(line, parseTokenTypes.Text);
    }
}

export class StartMarkerToken extends ParseToken {
    constructor() {
        super(new Line("[start-of-file]", NaN, {}), parseTokenTypes.StartMarker);
    }
}

export class EndMarkerToken extends ParseToken {
    constructor() {
        super(new Line("[end-of-file]", NaN, {}), parseTokenTypes.EndMarker);
    }
}

export class NullToken extends ParseToken {
    constructor() {
        super(new Line("", NaN, {}), parseTokenTypes.Null);
    }
}
