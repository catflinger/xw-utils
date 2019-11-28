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

    constructor(line: Line) {
        this.rawText = line.rawText;
        this.lineNumber= line.lineNumber;
    }

    public abstract get type(): Symbol;

    public toString(): string {
        return `line ${this.lineNumber}: text="${this.rawText}"`;
    }
}

export class GroupMarkerToken extends ParseToken {
    public readonly groupMarker: ClueGroup;
    constructor(line: Line, groupMarker: ClueGroup) {
        super(line);
        this.groupMarker = groupMarker;
    }
    public get type(): Symbol {
        return parseTokenTypes.GroupMarkerToken;
    }
    public toString(): string {
        return `GroupMarkerToken ${this.groupMarker} ${super.toString()}}`;
    }
}

export class ClueStartToken extends ParseToken {
    public get type(): Symbol {
        return parseTokenTypes.ClueStartToken;
    }
    public toString(): string {
        return `ClueStartToken ${super.toString()}}`;
    }
}

export class ClueEndToken extends ParseToken {
    public get type(): Symbol {
        return parseTokenTypes.ClueEndToken;
    }
    public toString(): string {
        return `ClueEndToken ${super.toString()}}`;
    }
}

export class ClueToken extends ParseToken {
    public get type(): Symbol {
        return parseTokenTypes.ClueToken;
    }
    public toString(): string {
        return `ClueToken ${super.toString()}}`;
    }
}

export class TextToken extends ParseToken {
    public get type(): Symbol {
        return parseTokenTypes.TextToken;
    }
    public toString(): string {
        return `TextToken ${super.toString()}}`;
    }
}

export class SyntaxErrorToken extends ParseToken {
    public readonly message: string;
    constructor(line, message: string) {
        super(line);
        this.message = message;
    }
    public get type(): Symbol {
        return parseTokenTypes.SyntaxErrorToken;
    }
    public toString(): string {
        return `SyntaxErrorToken "${this.message}" ${super.toString()}}`;
    }
}
