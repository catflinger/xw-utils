import { IPuzzle, ClueGroup } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';
import { Clue } from 'src/app/model/puzzle-model/clue';

interface ClueRef {
    number: number,
    group: ClueGroup,
}

export class SetRedirects implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle && puzzle.clues) {
            
            // clear all the redirects
            puzzle.clues.forEach(c => c.redirect = null);
            
            // re-calculate the redirect each clue
            puzzle.clues.forEach(clue => {

                let redirectionRef = this.parseRedirect(clue.text);

                if (redirectionRef) {
                    
                    //find any other clue that has this ref as one of its grid refernces
                    let targetClues = puzzle.clues.filter(targetClue => {
                        const isNotSameClue =  targetClue.id !== clue.id;

                        const refMatched = targetClue.link.gridRefs.find(gridRef => {
                                return gridRef.direction === redirectionRef.group &&
                                    gridRef.caption === redirectionRef.number;
                            }) !== null;

                        return isNotSameClue && refMatched;
                    });

                    if (targetClues.length > 0) {
                        clue.redirect = targetClues[0].id;
                    }
                }
            });
        }
    }

    private parseRedirect(text: string): ClueRef {
        let result: ClueRef = null;

        if (Clue.isRedirect(text)) {

            //we know this is of the form See xxxxx, xx, xxx
            // find the first group
            const trimmed = text.replace(/See\s+/i, "");
            let parts = trimmed.split(",");
            let firstPart = parts[0].trim();

            //find clue the number and an optional direction
            const exp = new RegExp(String.raw`^(?<number>\d{1,2})\s*(?<direction>across|down)?`, "i");

            const match = exp.exec(firstPart);

            if (match) {
                // redirect to this clue
            } else {
                // some sort of error has occurred
            }
        }

        return result;
    }
}
