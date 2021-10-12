import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { countEmptyGridCells, getMaxAnchor, makeJigsawFromPuzzle, JAnswer, JCell, XCurrent, JPlacement, Jigsaw } from 'src/app/ui/puzzle-solving/jigsaw/jigsaw-model';

const maxAttempts = 50000;
const delayMillis = 50;


@Injectable({
    providedIn: 'root'
})
export class JigsawService {

    private depth = 0;

    private stack: Jigsaw[] = [];

    // TO DO: figure out how to make the type of this readonly so subscribers can't accidentally modify the values they get
    private bsJigsaw: BehaviorSubject<Jigsaw | null> = new BehaviorSubject<Jigsaw | null>(null);

    constructor(
        //private scratchpadService: ScratchpadService,
    ) { }

    public observe(): Observable<Jigsaw> {
        return this.bsJigsaw.asObservable();
    }

    public stop() {
        this.stack = [];
        this.bsJigsaw.next(null);
    }

    public start(puzzle: Puzzle) {
        this.depth = 0;
        this.stack = [];

        // make a copy of the important bits
        const jigsaw = makeJigsawFromPuzzle(puzzle);
        //push it onto the stack as the first pristine grid
        this.stack.push(jigsaw);
        //push a clone the stack as the first attempt
        this.stack.push(this.cloneIt(jigsaw));

        this.bsJigsaw.next(jigsaw);
        this.invokePlacement();
    }

    private invokePlacement() {
        setTimeout(_ => this.placeNextAnswer(), delayMillis);
    }

    // TO DO: Test with barred grid
    // TO DO: Test with incomplete set of answers
    // TO DO: Test with an inconsistent set of answers
    private placeNextAnswer(): void {

        this.depth++;

        if (this.depth > maxAttempts) {
            // console.log(`Exceeded max numberof tries`);
            return;
        }

        if (this.stack.length === 0) {
            // console.log(`Empty stack, cancelling fill`);
            return;
        }

        // use the current stack frame
        let jigsaw = this.stack[this.stack.length - 1];

        // no empty grid cells ? return "success"
        if (countEmptyGridCells(jigsaw) === 0) {
            // console.log(`SUCCESS: No empty cells left`);
            return;
        }

        // see if we have a search in progress, if not then start a new one
        if (!jigsaw.current) {
            let unplaced = jigsaw.answers.find(a => !a.placement);

            if (unplaced) {
                jigsaw.current = {
                    answer: this.cloneIt(unplaced),
                    attemptedPlacements: []
                }
            } else {
                // no more unplaced answers so we are finished!
                // console.log(`SUCCESS: no unplaced answers left`);
                return;
            }
        }

        // try and find a place for this answer in the grid
        let placement = this.tryPlacement(jigsaw.current, jigsaw);

        if (placement) {
            //found a place, so push and continue
            // create a clone of current frame
            let clone: Jigsaw = this.cloneIt(jigsaw);

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
            this.bsJigsaw.next(this.cloneIt(clone));

        } else {
            // failed to find a place so at a dead end, abandon this branch
            this.stack.pop();
            this.bsJigsaw.next(this.cloneIt(this.stack[this.stack.length - 1]));
            this.invokePlacement();
            return;
    }

        // invoke this function again (via a callback)
        this.invokePlacement();
    }

    private tryPlacement(current: XCurrent, jigsaw: Jigsaw): JPlacement {

        let placement = this.tryAcrossPlacement(jigsaw, current);

        if (!placement) {
            placement = this.tryDownPlacement(jigsaw, current);
        }

        return placement;
    }

    private tryAcrossPlacement(jigsaw: Jigsaw, current: XCurrent): JPlacement | null {
        const maxAnchor = getMaxAnchor(jigsaw.cells);
        let result: JPlacement | null = null;

        for (let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            let alreadyTried = current.attemptedPlacements.find(p => p.anchor === anchor && p.direction === "across");

            if (!alreadyTried) {
                current.attemptedPlacements.push({anchor, direction: "across" })
                
                if (this.tryAcrossFit(jigsaw, current.answer, anchor)) {
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

    private tryDownPlacement(jigsaw: Jigsaw, current: XCurrent): JPlacement | null {
        const maxAnchor = getMaxAnchor(jigsaw.cells);
        let result: JPlacement | null = null;

        for (let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            let alreadyTried = current.attemptedPlacements.find(p => p.anchor === anchor && p.direction === "down");

            if (!alreadyTried) {
                current.attemptedPlacements.push({anchor, direction: "down" })
                if (this.tryDownFit(jigsaw, current.answer, anchor)) {
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

    private tryAcrossFit(jigsaw: Jigsaw, answer: JAnswer, anchor): boolean {
        const entry = this.getAcrossEntry(jigsaw, anchor);
        return this.tryFit(answer, entry);
    }

    private tryDownFit(jigsaw: Jigsaw, answer: JAnswer, anchor: number): boolean {
        const entry = this.getDownEntry(jigsaw, anchor);
        return this.tryFit(answer, entry);
    }

    private tryFit(answer: JAnswer, entry: JCell[]): boolean {
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

    private getAcrossEntry(jigsaw: Jigsaw, anchor): JCell[] {
        const startCell = jigsaw.cells.find(c => c.anchor === anchor);
        const cells = jigsaw.cells;
        let result: JCell[] = [];

        if (startCell.x > 0) {
            const prev = jigsaw.cells.find(c => c.y === startCell.y && c.x === startCell.x - 1);
            if (prev.light || prev.rightBar) {
                return [];
            }
        }

        for (
            let x = startCell.x;
            x < jigsaw.properties.across;
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

    private getDownEntry(jigsaw: Jigsaw, anchor): JCell[] {
        const startCell = jigsaw.cells.find(c => c.anchor === anchor);
        const cells = jigsaw.cells;
        let result: JCell[] = [];

        if (startCell.y > 0) {
            const prev = jigsaw.cells.find(c => c.x === startCell.x && c.y === startCell.y - 1);
            if (prev.light || prev.rightBar) {
                return [];
            }
        }

        for (
            let y = startCell.y;
            y < jigsaw.properties.down;
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

    private syncGrid(jigsaw: Jigsaw) {
        jigsaw.cells.forEach(c => c.content = null);

        jigsaw.answers
            .filter(a => a.placement)
            .forEach(answer => {
                let entry = answer.placement.direction === "across" ?
                    this.getAcrossEntry(jigsaw, answer.placement.anchor) :
                    this.getDownEntry(jigsaw, answer.placement.anchor);

                for (let i = 0; i < entry.length; i++) {
                    entry[i].content = answer.text.charAt(i);
                }
            });
    }



    private cloneIt(src: any): any {
        return JSON.parse(JSON.stringify(src));
    }

}

