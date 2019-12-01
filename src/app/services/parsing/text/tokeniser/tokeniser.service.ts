import { Injectable } from '@angular/core';
import { Line } from '../line';
import { ParseToken, ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken } from './tokens';
import { ParseData } from '../parse-data';

export class TokenGroup {
    constructor(
        public readonly previous: ParseToken,
        public readonly current: ParseToken,
        public readonly next: ParseToken
    ) {}
}

export class TokenList {
    constructor(private _tokens: ReadonlyArray<ParseToken>) {}

    public get tokens(): ReadonlyArray<ParseToken> {
        return this._tokens;
    }

    *getIterator(): IterableIterator<TokenGroup> {
        const max = this._tokens.length - 1;
        const min = 0;

        let previous: ParseToken = null;
        let current: ParseToken = null;
        let next: ParseToken = null;

        for(let i = min; i <= max; i++) {
            current = this._tokens[i];
            previous = (i - 1 >= min) ? this._tokens[i - 1] : null;
            next = (i + 1 <= max) ? this._tokens[i + 1] : null;

            yield(new TokenGroup(previous, current, next));
        }

        return null as TokenGroup;
    }
}

@Injectable({
  providedIn: 'root'
})
export class TokeniserService {

    constructor() { }

    public parse(data: string): TokenList {
        let tokens: ParseToken[] = [];

        // make an array of lines from the source data
        let lines: Line[] = [];
        data.replace("\r", "").split("\n").forEach((line, index) => lines.push(new Line(line, index)));

        lines.forEach(line => {
            switch (line.lineType) {
                case "acrossMarker":
                    tokens.push(new AcrossMarkerToken(line));
                    break;
                case "downMarker":
                    tokens.push(new DownMarkerToken(line));
                    break;
                case "clue":
                    tokens.push(new ClueToken(line));
                    break;
                case "partialClueStart":
                    tokens.push(new ClueStartToken(line));
                    break;
                case "partialClueEnd":
                    tokens.push(new ClueEndToken(line));
                    break;
                case "unknown":
                    tokens.push(new TextToken(line));
                    break;
                case "empty":
                    // ignore this line
                    break;
            }
        });
        return new TokenList(tokens);
    }
}
