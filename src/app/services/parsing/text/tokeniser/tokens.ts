import { ClueGroup } from '../../../../model/interfaces';
import { Line } from '../line';

export const parseTokenTypes = {
    ClueEndToken: Symbol("ClueEndToken"),
    ClueStartToken: Symbol("ClueStartToken"),
    ClueToken: Symbol("ClueToken"),
    GroupMarkerToken: Symbol("GroupMarkerToken"),
    TextToken: Symbol("TextToken"),
    SyntaxErrorToken: Symbol("SyntaxErrorToken"),
} 

export abstract class ParseToken {
    protected readonly rawText: string; 
    protected readonly lineNumber: number;
    protected readonly _type: Symbol;

    constructor(line: Line, type: Symbol) {
        this.rawText = line.rawText;
        this.lineNumber= line.lineNumber;
        this._type = type;
    }

    public get text() {
        return this.rawText;
    }

    public get type(): Symbol {
        return this._type;
    }

    public toString(): string {
        return this._type.toString();
    }

    public toJSON(): any {
        return {
            type: this._type.toString(),
            line: this.lineNumber,
            text: this.rawText
        };
    }
}

export class GroupMarkerToken extends ParseToken {
    public readonly groupMarker: ClueGroup;

    constructor(line: Line, groupMarker: ClueGroup) {
        super(line, parseTokenTypes.GroupMarkerToken);
        this.groupMarker = groupMarker;
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

export class SyntaxErrorToken extends ParseToken {
    public readonly message: string;
    constructor(line, message: string) {
        super(line, parseTokenTypes.SyntaxErrorToken);
        this.message = message;
    }
}
