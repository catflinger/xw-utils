import { ClueGroup } from '../../../../model/interfaces';
import { Line } from '../line';

export class ParseToken {
    protected readonly rawText: string; 
    protected readonly lineNumber: number;

    constructor(line: Line) {
        this.rawText = line.rawText;
        this.lineNumber= line.lineNumber;
    }

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

    public toString(): string {
        return `GroupMarkerToken ${this.groupMarker} ${super.toString()}}`;
    }
}

export class ClueStartToken extends ParseToken {
    public toString(): string {
        return `ClueStartToken ${super.toString()}}`;
    }
}

export class ClueEndToken extends ParseToken {
    public toString(): string {
        return `ClueEndToken ${super.toString()}}`;
    }
}

export class ClueToken extends ParseToken {
    public toString(): string {
        return `ClueToken ${super.toString()}}`;
    }
}

export class TextToken extends ParseToken {
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

    public toString(): string {
        return `SyntaxErrorToken "${this.message}" ${super.toString()}}`;
    }
}
