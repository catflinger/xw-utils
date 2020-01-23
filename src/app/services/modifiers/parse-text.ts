import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { ParseData } from '../parsing/text/parse-data';
import { TextParsingService } from '../parsing/text/text-parsing-service';
import { Grid } from 'src/app/model/grid';
import { TextParsingOptions } from '../parsing/text/types';
import { TextParsingErrorM } from './mutable-model/text-parsing-error-m';
import { AddPlaceholders } from './add-placeholders';
import { ProviderService } from '../provider.service';
import { PuzzleProvider } from 'src/app/model/interfaces';

// interface GridReference {
//     // for example: 2 down or 23 across
//     clueNumber: number,
//     clueGroup: ClueGroup 
// }

export class ParseText implements IPuzzleModifier {

    constructor(
        private textParsingService: TextParsingService,
        private providerService: ProviderService
    ) { }

    public exec(puzzle: PuzzleM): void {
        let parseData = new ParseData();
        parseData.clueDataType = "text";
        parseData.rawData = puzzle.provision.source;
        parseData.grid = puzzle.grid ? new Grid(puzzle.grid) : null;

        let parser = this.textParsingService.parser(parseData, this.getParsingOptions(puzzle.info.provider));
        let context = parser.next();

        while(!context.done) {
            context = parser.next();
        }

        // TO DO: error handling in parsing is getting confused
        // decide once and for all
        // 1) when an exception will be thrown
        // 2) when the parsing will be abandoned and the puzzle update aborted
        // 2) when the errros will be recorded in the puzzle

        try {
            puzzle.clues = JSON.parse(JSON.stringify(context.value.clues));

            let error: TextParsingErrorM = JSON.parse(JSON.stringify(context.value.error));
            puzzle.provision.parseErrors = error ? [error] : [];
            puzzle.provision.parseWarnings = JSON.parse(JSON.stringify(context.value.warnings));

            puzzle.linked = false;
        
            new AddPlaceholders().exec(puzzle);

            if (!puzzle.info.title) {
                const titleExpression = new RegExp(String.raw`(no\.|crossword)\s+(?<serialNumber>[0-9,]+)\s+(set)?\s*by\s+(?<setter>[A-Za-z]+)`, "i");

                for (let line of context.value.preamble) {
                    let match = titleExpression.exec(line,);

                    if (match) {
                        let setter = match.groups["setter"].toString();
                        let serialNumber = match.groups["serialNumber"].toString();
                        
                        puzzle.info.title = this.providerService.getProviderString(puzzle.info.provider);

                        if (serialNumber) {
                            puzzle.info.title += " " + serialNumber;
                        }
                        if (setter) {
                            puzzle.info.title += " by " + setter;
                            puzzle.info.setter = setter;
                        }

                        break;

                    } else {
                        puzzle.info.title = "untitled";
                    }
                }

            }
        } catch (error) {
            throw new Error(`Failed to parse puzzle: ${error}`);
        }
    }

    private getParsingOptions(provider: PuzzleProvider): TextParsingOptions {
        let options: TextParsingOptions = {}

        if (provider !== "text") {
            options.allowPostamble = true;
            options.allowPreamble = true;
        }

        if (provider === "ft") {
            options.allowTypos = true;
        }

        if (provider === "azed") {
            options.azedFeatures = true;
        }

        return options;
    }

}