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
