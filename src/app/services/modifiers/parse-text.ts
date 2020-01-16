import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { ParseData } from '../parsing/text/parse-data';
import { TextParsingOptions, TextParsingService } from '../parsing/text/text-parsing-service';
import { Injectable } from '@angular/core';
import { Grid } from 'src/app/model/grid';
import { UpdateParsing } from './update-parsing';

// interface GridReference {
//     // for example: 2 down or 23 across
//     clueNumber: number,
//     clueGroup: ClueGroup 
// }

@Injectable({
    providedIn: 'root'
})
export class ParseText implements IPuzzleModifier {
    constructor(private textParsingService: TextParsingService) { }

    public exec(puzzle: PuzzleM): void {
        let parseData = new ParseData();
        parseData.clueDataType = "text";
        parseData.rawData = puzzle.provision.source;
        parseData.grid = new Grid(puzzle.grid);

        let options: TextParsingOptions = {
            allowPreamble: true,
            allowPostamble: true,
        }

        let parser = this.textParsingService.parser(parseData, options);
        let context = parser.next();

        while(!context.done) {
            context = parser.next();
        }

        if (!context.value.error) {
            new UpdateParsing(context.value).exec(puzzle);
        } else {
            throw new Error(`Failed to parse puzzle at line ${context.value.error.line} ${context.value.error.message}`);
        }
    }

}