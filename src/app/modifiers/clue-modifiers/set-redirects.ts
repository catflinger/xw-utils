import { IPuzzle, ClueGroup, IClue } from '../../model/interfaces';
import { IPuzzleModifier } from '../puzzle-modifier';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { HttpErrorResponse } from '@angular/common/http';

interface ClueRef {
    number: number,
    group: ClueGroup | null,
}

export class SetRedirects implements IPuzzleModifier {
    constructor() { }

    exec(puzzle: IPuzzle) {
        if (puzzle && puzzle.clues) {
            
            // clear all the redirects
            puzzle.clues.forEach(c => c.redirect = null);
            
            // re-calculate the redirect each clue
            puzzle.clues.forEach(clue => {

                let redirectionRef = this.parseRedirect(clue);

                if (redirectionRef) {
                    let candidates: IClue[] = [];
                    

                    if (!redirectionRef.group) {
                        // if there is no direction specified then first look in the clues for the same group
                        let ref: ClueRef = {
                            number: redirectionRef.number, 
                            group: clue.group
                        };

                        candidates = this.findCandidatesForRedirect(puzzle.clues, ref, clue.id);

                        if (candidates.length === 0) {

                            // no luck in same group so try the other group
                            ref = {
                                number: redirectionRef.number, 
                                group: clue.group === "across" ? "down" : "across",
                            };

                            candidates = this.findCandidatesForRedirect(puzzle.clues, ref, clue.id);
                        }
                    } else {

                        candidates = this.findCandidatesForRedirect(
                            puzzle.clues, 
                            redirectionRef, 
                            clue.id
                        );
                    }

                    if (candidates.length > 0) {
                        clue.redirect = candidates[0].id;
                    }
                }
            });
        }
    }

    private findCandidatesForRedirect(
        clues: IClue[],
        lookFor: ClueRef,
        excludeId: string)
        : IClue[] {

        return clues
        .filter(c => c.id !== excludeId)
        .filter(candidate => !!candidate.link.gridRefs.find(gr => 
            gr.direction === lookFor.group &&
            gr.anchor === lookFor.number));
    }

    private parseRedirect(clue: IClue): ClueRef {
        let result: ClueRef = null;

        if (Clue.isRedirect(clue.text)) {

            //we know this is of the form See xxxxx, xx, xxx
            // find the first group
            const trimmed = clue.text.replace(/See\s+/i, "");
            let parts = trimmed.split(",");
            let firstPart = parts[0].trim();

            //find clue the number and an optional direction
            const exp = new RegExp(String.raw`^(?<number>\d{1,2})\s*(?<direction>across|down)?`, "i");

            const match = exp.exec(firstPart);

            if (match) {
                let group: ClueGroup = null;

                if (match && match.groups["direction"]) {
                    group = match.groups["direction"] as ClueGroup;
                }
                
                result = { 
                    number: parseInt(match.groups["number"], 10),
                    group,
                };
            
            } else {
                // some sort of error has occurred
            }
        }

        return result;
    }
}
