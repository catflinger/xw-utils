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
import { PuzzleProvision } from 'src/app/model/puzzle-provision';

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

            for (let line of context.value.preamble) {
                if (!puzzle.info.title) {

                    // first look for an FT style title
                    let titleExpression = new RegExp(String.raw`(no\.|crossword)\s+(?<serialNumber>[0-9,]+)\s+(set)?\s*by\s+(?<setter>[A-Za-z]+)`, "i");

                    let match = titleExpression.exec(line);

                    if (match) {
                        // found an FT style title
                        let setter = match.groups["setter"].toString();
                        let serialNumber = match.groups["serialNumber"].toString();
                        let provider = this.providerService.getProviderString(puzzle.info.provider);
                        
                        puzzle.info.title = `${provider} ${serialNumber} by ${setter}`;
                        puzzle.info.setter = setter;

                    } else {
                        // no FT style title found so look for an Azed style title
                        titleExpression = new RegExp(String.raw`^\s*azed\s+no\.?\s+(?<serialNumber>\d,\d\d\d)(?<subtitle>.*)$`, "gi");

                        let match: RegExpExecArray;
                        
                        while (match = titleExpression.exec(line)) {
                            // Azed can also contains solutions to previous puzzles that look like a title line e.g.
                            // "Azed No 2,123 solutions and notes" or "Azed No. 2,481, The Observer, 90 York Way, London N1 9GU."
                            // Only use if the title line does not contain the word "solution"
                            let subtitle: string = match.groups["subtitle"] ? match.groups["subtitle"].toString().trim().toLowerCase() : null;

                            if (!subtitle || !(subtitle.includes("solution") || subtitle.includes("observer"))) {
                                puzzle.info.title = match[0].toString();
                                puzzle.info.setter = "Azed";
                            } 
                        }
                    }
                }
            }

            // if we have still not found a title then add a default
            if (!puzzle.info.title) {
                puzzle.info.title = "untitled";
                puzzle.info.setter = "anon";
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