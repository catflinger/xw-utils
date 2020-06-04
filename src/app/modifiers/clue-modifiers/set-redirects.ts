import { IPuzzle, ClueGroup } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';
import { Clue } from 'src/app/model/puzzle-model/clue';

interface ClueRef {
    number: number,
    group: ClueGroup,
}

export class HousekeepClues implements IPuzzleModifier {
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
            //what?

            // to begin with find the clue number of the first cross ref
            // work out how to handle more complex cases later, maybe return ClueRef[] instead
            //
            // eg simplest case: "1 See 2"
            // still simple: "1 See 2 down"
            // more difficult: "1 See 1 Down"
            // more ticky still: "1 See 3 Across, 1 Down"
            //
        }

        return result;
    }
}
