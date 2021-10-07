import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { countEmptyGridCells, getMaxAnchor, makeXXXFromPuzzle, XAnswer, XCell, XCurrent, XPlacement, XXX } from 'src/app/ui/puzzle-solving/jigsaw/jigsaw-model';

const maxAttempts = 10000;
const delayMillis = 250;


@Injectable({
    providedIn: 'root'
})
export class JigsawService {

    private depth = 0;

    private stack: XXX[] = [];

    // TO DO: figure out how to make the type of this readonly so subscribers can't accidentally modify the values they get
    private bsXXX: BehaviorSubject<XXX | null> = new BehaviorSubject<XXX | null>(null);

    constructor(
        //private scratchpadService: ScratchpadService,
    ) { }

    public observe(): Observable<XXX> {
        return this.bsXXX.asObservable();
    }

    public start(puzzle: Puzzle) {
        this.depth = 0;
        this.stack = [];

        // make a copy of the important bits
        const xxx = makeXXXFromPuzzle(puzzle);
        //push it onto the stack as the first pristine grid
        this.stack.push(xxx);
        //push a clone the stack as the first attempt
        this.stack.push(this.cloneIt(xxx));

        this.bsXXX.next(xxx);
        this.invokePlacement();
    }

    private invokePlacement() {
        setTimeout(_ => this.placeNextAnswer(), delayMillis);
    }

    // TO DO: WORK OUT HOW TO CANCEL TIS IF NO-ONE IS LITENING
    private placeNextAnswer(): void {

        this.depth++;

        if (this.depth > maxAttempts) {
            console.log(`Exceeded max numberof tries`);
            return;
        }

        // use the current stack frame
        let xxx = this.stack[this.stack.length - 1];

        // no empty grid cells ? return "success"
        if (countEmptyGridCells(xxx) === 0) {
            console.log(`SUCCESS: No empty cells left`);
            return;
        }

        // see if we have a search in progress, if not then start a new one
        if (!xxx.current) {
            let unplaced = xxx.answers.find(a => !a.placement);

            if (unplaced) {
                xxx.current = {
                    answer: this.cloneIt(unplaced),
                    attemptedPlacements: []
                }
            } else {
                // no more unplaced answers so we are finished!
                console.log(`SUCCESS: no unplaced answers left`);
                return;
            }
        }

        // try and find a place for this answer in the grid
        let placement = this.tryPlacement(xxx.current, xxx);

        if (placement) {
            //found a place, so push and continue
            console.log("B")
            // create a clone of current frame
            let clone: XXX = this.cloneIt(xxx);

            // update it with the placement
            let clue = clone.answers.find(c => c.clueId === placement.clueId);
            clue.placement = placement;

            // update the placed answers in the grid
            this.syncGrid(clone);

            // clear the current
            clone.current = null;;

            // push it
            this.stack.push(clone)

            // raise an event
            console.log("C")
            this.bsXXX.next(this.cloneIt(clone));

        } else {
            // failed to find a place so at a dead end, abandon this branch
            this.stack.pop();
            console.log("A")
            this.bsXXX.next(this.cloneIt(this.stack[this.stack.length - 1]));
            this.invokePlacement();
            return;
    }

        // invoke this function again (via a callback)
        console.log("F");
        this.invokePlacement();
    }

    private tryPlacement(current: XCurrent, xxx: XXX): XPlacement {

        let placement = this.tryAcrossPlacement(xxx, current);

        if (!placement) {
            placement = this.tryDownPlacement(xxx, current);
        }

        return placement;
    }

    private tryAcrossPlacement(xxx: XXX, current: XCurrent): XPlacement | null {
        const maxAnchor = getMaxAnchor(xxx.cells);
        let result: XPlacement | null = null;

        for (let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            let alreadyTried = current.attemptedPlacements.find(p => p.anchor === anchor && p.direction === "across");

            if (!alreadyTried) {
                current.attemptedPlacements.push({anchor, direction: "across" })
                
                if (this.tryAcrossFit(xxx, current.answer, anchor)) {
                    result = {
                        clueId: current.answer.clueId,
                        anchor,
                        direction: "across"
                    };
                }
            }
        }
        return result;
    }

    private tryDownPlacement(xxx: XXX, current: XCurrent): XPlacement | null {
        const maxAnchor = getMaxAnchor(xxx.cells);
        let result: XPlacement | null = null;

        for (let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            let alreadyTried = current.attemptedPlacements.find(p => p.anchor === anchor && p.direction === "down");

            if (!alreadyTried) {
                current.attemptedPlacements.push({anchor, direction: "down" })
                if (this.tryDownFit(xxx, current.answer, anchor)) {
                    result = {
                        clueId: current.answer.clueId,
                        anchor,
                        direction: "down"
                    };
                }
            }
        }
        return result;
    }

    private tryAcrossFit(xxx: XXX, answer: XAnswer, anchor): boolean {
        const entry = this.getAcrossEntry(xxx, anchor);
        return this.tryFit(answer, entry);
    }

    private tryDownFit(xxx: XXX, answer: XAnswer, anchor: number): boolean {
        const entry = this.getDownEntry(xxx, anchor);
        return this.tryFit(answer, entry);
    }

    private tryFit(answer: XAnswer, entry: XCell[]): boolean {
        let isFit = true;

        if (entry.length < 2 || entry.length !== answer.text.length) {
            isFit = false;
        } else {
            for (let i = 0; isFit && i < entry.length; i++) {
                const entryLetter = entry[i].content;
                const answerLetter = answer.text.charAt(i);

                if (entryLetter && entryLetter !== answerLetter) {
                    isFit = false;
                }
            };
        }
        return isFit;
    }



    // private countUnplacedAnswers(xxx: XXX): number {
    //     let counter = 0;

    //     xxx.answers.forEach(a => {
    //         if (!a.placement) {
    //             counter++;
    //         }
    //     })
    //     return counter;
    // }


    private getAcrossEntry(xxx: XXX, anchor): XCell[] {
        const startCell = xxx.cells.find(c => c.anchor === anchor);
        const cells = xxx.cells;
        let result: XCell[] = [];

        if (startCell.x > 0) {
            const prev = xxx.cells.find(c => c.y === startCell.y && c.x === startCell.x - 1);
            if (prev.light || prev.rightBar) {
                return [];
            }
        }

        for (
            let x = startCell.x;
            x < xxx.properties.across;
            x++
        ) {
            let cell = cells.find(c => c.x === x && c.y === startCell.y);

            if (cell.light) {
                result.push(cell);

                if (cell.rightBar) {
                    break;
                }

            } else {
                break;
            }
        }
        return result;
    }

    private getDownEntry(xxx: XXX, anchor): XCell[] {
        const startCell = xxx.cells.find(c => c.anchor === anchor);
        const cells = xxx.cells;
        let result: XCell[] = [];

        if (startCell.y > 0) {
            const prev = xxx.cells.find(c => c.x === startCell.x && c.y === startCell.y - 1);
            if (prev.light || prev.rightBar) {
                return [];
            }
        }

        for (
            let y = startCell.y;
            y < xxx.properties.down;
            y++
        ) {
            let cell = cells.find(c => c.y === y && c.x === startCell.x);

            if (cell.light) {
                result.push(cell);

                if (cell.bottomBar) {
                    break;
                }

            } else {
                break;
            }
        }
        return result;
    }

    private syncGrid(xxx: XXX) {
        xxx.cells.forEach(c => c.content = null);

        xxx.answers
            .filter(a => a.placement)
            .forEach(answer => {
                let entry = answer.placement.direction === "across" ?
                    this.getAcrossEntry(xxx, answer.placement.anchor) :
                    this.getDownEntry(xxx, answer.placement.anchor);

                for (let i = 0; i < entry.length; i++) {
                    entry[i].content = answer.text.charAt(i);
                }
            });
    }



    private cloneIt(src: any): any {
        return JSON.parse(JSON.stringify(src));
    }

}

