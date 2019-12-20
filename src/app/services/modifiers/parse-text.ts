import { IPuzzleModifier } from './puzzle-modifier';
import { PuzzleM } from './mutable-model/puzzle-m';
import { ParseData } from '../parsing/text/parse-data';
import { TextParsingOptions, TextParsingService } from '../parsing/text/text-parsing-service';
import { Injectable } from '@angular/core';
import { AddClues } from './add-clues';

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

    public exec(puzzle: PuzzleM): boolean {
        let cancel = false;

        try {
            let parseData = new ParseData();
            parseData.clueDataType = "text";
            parseData.rawData = puzzle.info.source;
    
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
                new AddClues({ clues: context.value.clues }).exec(puzzle);

            } else {
                // TO DO: work out where to add parse errors into the puzzle model
                //this.appService.setAlert("danger", "Parsing Error :" + context.value.error.message);
                cancel = true;
            }
        } catch(error) {
            // TO DO: work out where to add parse errors into the puzzle model
            //this.appService.setAlert("danger", "ERROR :" + error.message)
            cancel = true;
        }

        return cancel;
    }

}