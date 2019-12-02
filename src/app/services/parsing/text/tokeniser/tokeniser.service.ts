import { Injectable } from '@angular/core';
import { Line } from '../line';
import { ParseToken, ClueToken, ClueStartToken, ClueEndToken, TextToken, AcrossMarkerToken, DownMarkerToken, EndMarkerToken, StartMarkerToken, NullToken } from './tokens';

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

        // set some defaults here so that if there are no lines to read the flow 
        // of control will fall through and return a TokenGroup with current=EOF
        let previous: ParseToken = new NullToken();
        let current: ParseToken = new StartMarkerToken();
        let next: ParseToken = new EndMarkerToken();

        for(let i = min; i <= max; i++) {
            previous = (i - 1 >= min) ? this._tokens[i - 1] : new NullToken();
            current = this._tokens[i];
            next = (i + 1 <= max) ? this._tokens[i + 1] : new NullToken();

            yield(new TokenGroup(previous, current, next));
        }

        return new TokenGroup(current, next, new NullToken());
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

        tokens.push(new StartMarkerToken());

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

        tokens.push(new EndMarkerToken());

        return new TokenList(tokens);
    }
}
