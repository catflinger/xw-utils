import { Puzzle } from '../../../model/puzzle';
import { ParseWarning } from '../../../model/parse-warning';
import { Clue } from 'src/app/model/clue';

export type ParseStatus = "OK" | "Warnings" | "Fail";

export class ParseResult {

    // temporary, during development
    clues: ReadonlyArray<Clue> = [];

    // a hopefully working puzzle
    puzzle: Puzzle;

    // did the parsing work OK
    status: ParseStatus;

    // a list of warnings from the parser
    parseWarnings: ParseWarning[];

}