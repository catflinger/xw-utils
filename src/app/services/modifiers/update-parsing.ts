import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { AddPlaceholders } from './add-placeholders';
import { IParseContext } from '../parsing/text/text-parsing-context';
import { TextParsingErrorM } from './mutable-model/text-parsing-error-m';

export class UpdateParsing implements IPuzzleModifier {
    constructor(
        public context: IParseContext
    ) { }

    exec(puzzle: PuzzleM) {
        if (puzzle) {
            puzzle.clues = JSON.parse(JSON.stringify(this.context.clues));

            let error: TextParsingErrorM = JSON.parse(JSON.stringify(this.context.error));
            puzzle.provision.parseErrors = error ? [error] : [];
            puzzle.provision.parseWarnings = JSON.parse(JSON.stringify(this.context.warnings));

            puzzle.linked = false;
            new AddPlaceholders().exec(puzzle);
        }
    }
}