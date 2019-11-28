import { Injectable } from '@angular/core';
import { Line } from '../line';
import { ParseToken, GroupMarkerToken, SyntaxErrorToken, ClueToken, ClueStartToken, ClueEndToken, TextToken } from './tokens';

const TextParsingErrors = {
    invalidState: Symbol("invalidState"),
    unexpectedLineType: Symbol("unexpectedLineType"),
    unexpectedDirectionMarker: Symbol("unexpectedDirectionMarker"),

    isParseError(error: any) {
        return  error === TextParsingErrors.invalidState ||
                error  === TextParsingErrors.unexpectedLineType ||
                error  === TextParsingErrors.unexpectedDirectionMarker;
    }
}

type TextParseDirection = "across" | "down" | null;

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

@Injectable({
  providedIn: 'root'
})
export class TokeniserService {

  constructor() { }

  public parse(lines: ReadonlyArray<Line>): ReadonlyArray<ParseToken> {
    let tokens: ParseToken[] = [];

    let state: ParseState = { direction: null, state: "waiting" };
    let nextState: ParseState;

    try {
        lines.forEach(line => {

            if (state.state === "waiting" && state.direction !== null ||
                state.state === "waitingForClue" && state.direction === null ||
                state.state === "waitingForClueEnd" && state.direction === null ||
                state.state === "ending" && state.direction !== null) {

                throw TextParsingErrors.invalidState;

            } else if (state.state === "waiting") {

                nextState = this.onWaiting(state, line, tokens);

            } else if (state.state === "waitingForClue") {

                nextState = this.onWaitingForClue(state, line, tokens);

            } else if (state.state === "waitingForClueEnd") {

                nextState = this.onWaitingForClueEnd(state, line, tokens);

            } else if (state.state === "ending") {

                nextState = this.onEnding(state, line, tokens);
            
            } else {

                throw TextParsingErrors.invalidState;
            }

            state = nextState;
        });
    
    } catch (error) {

        if (TextParsingErrors.isParseError(error)) {
            // TO DO: print out the tokens somewhere...
        } else {
            throw error;
        }
    }
    
    return tokens;
}

private onWaiting(currentState: ParseState, line: Line, tokens: ParseToken[]): ParseState {
    let nextState: ParseState;

    switch (line.lineType) {
        case "empty":
        case "unknown":
            // ignore this line
            nextState = currentState;
            break;
    
        case "acrossMarker":
            // found the start of the across clues
            tokens.push(new GroupMarkerToken(line, "across"));
            nextState = { state: "waitingForClue", direction: "across" };
            break;
        
        default:
            // no other line types allowed here
            tokens.push(new SyntaxErrorToken(line, "expected to find the ACROSS marker before this point"));
            throw TextParsingErrors.unexpectedLineType;
    }

    return nextState;
}

private onWaitingForClue(currentState: ParseState, line: Line, tokens: ParseToken[]): ParseState {
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
                throw TextParsingErrors.unexpectedDirectionMarker;
            }
            break;
        
        case "clue":
            // found the start of the down clues
            tokens.push(new ClueToken(line));
            nextState = { state: "waitingForClue", direction: currentState.direction};
            break;

        case "partialClueStart":
            // found the start of the down clues
            tokens.push(new ClueStartToken(line));
            nextState = { state: "waitingForClueEnd", direction: currentState.direction};
            break;

        default:
            // no other line types allowed here
            tokens.push(new SyntaxErrorToken(line, "expected start of a clue but found " + line.lineType));
            throw TextParsingErrors.unexpectedLineType;
    }

    return nextState;
}

private onWaitingForClueEnd(currentState: ParseState, line: Line, tokens: ParseToken[]): ParseState {
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
            throw TextParsingErrors.unexpectedLineType;
    }

    return nextState;
}


private onEnding(currentState: ParseState, line: Line, tokens: ParseToken[]): ParseState {
    let nextState: ParseState;

    switch (line.lineType) {
        case "empty":
        case "unknown":
            // ignore this line
            nextState = currentState;
            break;

        default:
            // no other line types allowed here
            tokens.push(new SyntaxErrorToken(line, "unexpected text after the end of the clues"));
            throw TextParsingErrors.unexpectedLineType;
    }


    return nextState;
}
}
