import { Line } from '../line';
import { IParseToken, ParseTokenType } from 'src/app/model/interfaces';



abstract class ParseToken implements IParseToken {
    public readonly text: string; 
    public readonly lineNumber: number;
    public readonly type: ParseTokenType;

    constructor(line: Line, type: ParseTokenType) {
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
        super(line, "AcrossMarkerToken");
    }
}

export class DownMarkerToken extends ParseToken {
    constructor(line: Line) {
        super(line, "DownMarkerToken");
    }
}

export class ClueStartToken extends ParseToken {
    constructor(line: Line) {
        super(line, "ClueStartToken");
    }
}

export class ClueEndToken extends ParseToken {
    constructor(line: Line) {
        super(line, "ClueEndToken");
    }
}

export class ClueToken extends ParseToken {
    constructor(line: Line) {
        super(line, "ClueToken");
    }
}

export class TextToken extends ParseToken {
    constructor(line: Line) {
        super(line, "TextToken");
    }
}

export class StartMarkerToken extends ParseToken {
    constructor() {
        super(new Line("[start-of-file]", NaN, null), "StartMarkerToken");
    }
}

export class EndMarkerToken extends ParseToken {
    constructor() {
        super(new Line("[end-of-file]", NaN, null), "EndMarkerToken");
    }
}

export class NullToken extends ParseToken {
    constructor() {
        super(new Line("", NaN, null), "NullToken");
    }
}
