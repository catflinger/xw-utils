import { Injectable } from '@angular/core';
import { Line } from '../line';
import { ParseToken, GroupMarkerToken, SyntaxErrorToken, ClueToken, ClueStartToken, ClueEndToken, TextToken } from './tokens';

type TextParseDirection = "across" | "down" | null;

export const TextParsingError = Symbol("TextParsingError");

type TextParseState = 

    // currently reading and discarding lines of junk
    // waiting for somethinng interesting to appear
    "waiting" |

    // currently waiting for a clue to parse
    "waitingForClue" |

    // currently reading a clue and waiting for the end
    "waitingForClueEnd" |

    // currently discarding junk and expecting the stream to end
    "ending";

interface ParseState {
    readonly state: TextParseState,
    readonly direction: TextParseDirection,
}

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

    *getIterator() {
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

export interface TokeniserOptions {
    allowPreamble?: boolean,
    allowPostamble?: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class TokeniserService {

    constructor() { }

    public parse(lines: ReadonlyArray<Line>, options: TokeniserOptions): TokenList {
        let tokens: ParseToken[] = [];

        const _options: TokeniserOptions = {
            allowPreamble: options && options.allowPreamble,
            allowPostamble: options && options.allowPostamble,
        }

        let state: ParseState = { direction: null, state: "waiting" };
        let nextState: ParseState;

        try {

            lines.forEach(line => {

                if (state.state === "waiting" && state.direction !== null) {
                    tokens.push(new SyntaxErrorToken(line, "invalid parse state - waiting but direction not null"));
                    throw TextParsingError;

                } else if (state.state === "waitingForClue" && state.direction === null ) {
                    tokens.push(new SyntaxErrorToken(line, "invalid parse state - waiting for clue but direction is null"));
                    throw TextParsingError;

                } else if (state.state === "waitingForClueEnd" && state.direction === null) {
                    tokens.push(new SyntaxErrorToken(line, "invalid parse state - waiting for clue end but direction is null"));
                    throw TextParsingError;

                } else if (state.state === "ending" && state.direction !== null) {
                    tokens.push(new SyntaxErrorToken(line, "invalid parse state - ended but direction is not null"));
                    throw TextParsingError;

                } else if (state.state === "waiting") {
                    nextState = this.onWaiting(state, line, tokens, _options);

                } else if (state.state === "waitingForClue") {
                    nextState = this.onWaitingForClue(state, line, tokens, _options);

                } else if (state.state === "waitingForClueEnd") {
                    nextState = this.onWaitingForClueEnd(state, line, tokens, _options);

                } else if (state.state === "ending") {
                    nextState = this.onEnding(state, line, tokens, _options);
                
                } else {
                    tokens.push(new SyntaxErrorToken(line, "unexpcted parse state"));
                    throw TextParsingError;
                }

                state = nextState;
            });

        } catch (error) {
            if (error !== TextParsingError) {
                throw error;
            }
        }

        return new TokenList(tokens);
    }

    private onWaiting(currentState: ParseState, line: Line, tokens: ParseToken[], options: TokeniserOptions): ParseState {
        let nextState: ParseState;

        switch (line.lineType) {
            case "empty":
                // ignore this line
                nextState = currentState;
                break;

            case "unknown":
                if (options.allowPreamble) {
                    // ignore this line
                    nextState = currentState;
                } else {
                    tokens.push(new SyntaxErrorToken(line, "unexpected text before ACROSS marker"));
                    throw TextParsingError;
                }
                break;
        
            case "acrossMarker":
                // found the start of the across clues
                tokens.push(new GroupMarkerToken(line, "across"));
                nextState = { state: "waitingForClue", direction: "across" };
                break;
            
            default:
                // no other line types allowed here
                tokens.push(new SyntaxErrorToken(line, "expected to find the ACROSS marker before this point"));
                throw TextParsingError;
            }

        return nextState;
    }

    private onWaitingForClue(currentState: ParseState, line: Line, tokens: ParseToken[], options: TokeniserOptions): ParseState {
        let nextState: ParseState;

        switch (line.lineType) {
            case "empty":
                // ignore this line
                nextState = currentState;
                break;
        
            case "downMarker":
                if (currentState.direction === "across") {
                    // found the start of the down clues
                    tokens.push(new GroupMarkerToken(line, "down"));
                    nextState = { state: "waitingForClue", direction: "down"};
                } else {
                    tokens.push(new SyntaxErrorToken(line, "unexpected DOWN marker in the down clues"));
                    throw TextParsingError;
                }
                break;
            
            case "clue":
                tokens.push(new ClueToken(line));
                nextState = { state: "waitingForClue", direction: currentState.direction};
                break;

            case "partialClueStart":
                tokens.push(new ClueStartToken(line));
                nextState = { state: "waitingForClueEnd", direction: currentState.direction};
                break;

            case "unknown":
                if (currentState.direction === "down" && options.allowPostamble) {
                    nextState = { state: "ending", direction: null };
                } else {
                    tokens.push(new SyntaxErrorToken(line, "expected start of a clue but found text"));
                    throw TextParsingError;
                }
                break;
        
            default:
                // no other line types allowed here
                tokens.push(new SyntaxErrorToken(line, "expected start of a clue but found " + line.lineType));
                throw TextParsingError;
            }

        return nextState;
    }

    private onWaitingForClueEnd(currentState: ParseState, line: Line, tokens: ParseToken[], options: TokeniserOptions): ParseState {
        let nextState: ParseState;

        switch (line.lineType) {
            case "empty":
                // ignore this line
                nextState = currentState;
                break;

            case "partialClueEnd":
                // found the end of the clue
                tokens.push(new ClueEndToken(line));
                nextState = { state: "waitingForClue", direction: currentState.direction};
                break;

            case "unknown":
                // found what might be the middle of this clue
                tokens.push(new TextToken(line));
                nextState = currentState;
                break;

            default:
                // no other line types allowed here
                tokens.push(new SyntaxErrorToken(line, "expected to find the ending for a clue"));
                throw TextParsingError;
            }

        return nextState;
    }


    private onEnding(currentState: ParseState, line: Line, tokens: ParseToken[], options: TokeniserOptions): ParseState {
        let nextState: ParseState;

        switch (line.lineType) {
            case "empty":
                // ignore this line
                nextState = currentState;
                break;
            
            case "unknown":
                if (options.allowPostamble) {
                    // ignore this line
                    nextState = currentState;
                } else {
                    tokens.push(new SyntaxErrorToken(line, "unexpected text after the end of the clues"));
                    throw TextParsingError;
                    }
                break;

            default:
                // no other line types allowed here
                tokens.push(new SyntaxErrorToken(line, "unexpected text after the end of the clues"));
                throw TextParsingError;
            }

        return nextState;
    }
}
