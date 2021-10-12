import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { countEmptyGridCells, getMaxAnchor, makeJigsawFromPuzzle, JAnswer, JCell, XCurrent, JLight, Jigsaw } from 'src/app/ui/puzzle-solving/jigsaw/jigsaw-model';

export type JigsawStatus = "new" | "working"| "finished";

export interface JigsawEvent {
    status: JigsawStatus,
    jigsaw: Jigsaw | null,
    message?: string,
}

interface Placement {
    clueId: string,
    light: JLight,
}

const maxAttempts = 50000;
const delayMillis = 50;


@Injectable({
    providedIn: 'root'
})
export class JigsawService {

    private depth = 0;
    private puzzle: Puzzle | null = null;
    private stack: Jigsaw[] = [];
    private cancelFlag = false;

    // TO DO: figure out how to make the type of this readonly so subscribers can't accidentally modify the values they get
    private bsJigsaw: BehaviorSubject<JigsawEvent | null> = new BehaviorSubject<JigsawEvent | null>(null);

    constructor(
        //private scratchpadService: ScratchpadService,
    ) { }

    public observe(): Observable<JigsawEvent | null> {
        return this.bsJigsaw.asObservable();
    }

    public stop() {
        this.cancelFlag = true;
    }

    public usePuzzle(puzzle: Puzzle) {
        this.puzzle = puzzle;

        this.reset();

        const jigsaw = this.peek();

        this.bsJigsaw.next({
            status: "new",
            jigsaw
        });
}

    public start() {
        this.reset();

        const jigsaw = this.peek();

        if (jigsaw) {
            // //push a clone the stack as the first attempt
            // this.stack.push(this.cloneIt(jigsaw));

            this.bsJigsaw.next({
                status: "working",
                jigsaw
            });

            this.invokePlacement();
        } else {
            this.bsJigsaw.next({
                status: "finished",
                jigsaw: null,
                message: "No puzzle has been specified."
            });
        }

    }

    private reset() {
        this.depth = 0;
        this.stack = [];
        this.cancelFlag = false;

        if (this.puzzle) {
            // make a copy of the important bits
            const jigsaw = makeJigsawFromPuzzle(this.puzzle);

            //push it onto the stack as the first pristine grid 
            this.stack.push(jigsaw);
        }
    }

    private invokePlacement() {
        setTimeout(_ => this.placeNextAnswer(), delayMillis);
    }

    // TO DO: Test with barred grid
    // TO DO: Test with incomplete set of answers
    // TO DO: Test with an inconsistent set of answers
    private placeNextAnswer(): void {

        if (this.cancelFlag) {
            // console.log(`Cancelled`);
            this.bsJigsaw.next({
                status: "finished",
                jigsaw: null,
                message: "The grid-fill has been cancelled."
            });
            return;
        }

        this.depth++;

        if (this.depth > maxAttempts) {
            // console.log(`Exceeded max numberof tries`);
            this.bsJigsaw.next({
                status: "finished",
                jigsaw: null,
                message: "Maximum number if attempts exceeded."
            });
            return;
        }

        if (this.stack.length === 0) {
            // console.log(`Empty stack, cancelling fill`);
            this.bsJigsaw.next({
                status: "finished",
                jigsaw: null,
                message: "Failed to find a way to fill the grid using these words."

            });
            return;
        }

        // use the current stack frame
        let jigsaw = this.peek();

        // no empty grid cells ? return "success"
        if (countEmptyGridCells(jigsaw) === 0) {
            this.bsJigsaw.next({
                status: "finished",
                jigsaw,
                message: "Success, the grid is full."

            });
            // console.log(`SUCCESS: No empty cells left`);
            return;
        }

        // see if we have a search in progress, if not then start a new one
        if (!jigsaw.current) {
            let unplaced = jigsaw.answers.find(a => !a.light);

            if (unplaced) {
                jigsaw.current = {
                    answer: JSON.parse(JSON.stringify(unplaced)),
                    attemptedPlacements: []
                }
            } else {
                // no more unplaced answers so we are finished!
                // console.log(`SUCCESS: no unplaced answers left`);
                this.bsJigsaw.next({
                    status: "finished",
                    jigsaw,
                    message: "Success, all the available answers have been placed."
    
                });
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
            let answer = clone.answers.find(c => c.clueId === placement.clueId);
            answer.light = placement.light;

            // update the placed answers in the grid
            this.syncGrid(clone);

            // clear the current
            clone.current = null;;

            // push it
            this.stack.push(clone)

            // raise an event
            this.bsJigsaw.next({
                status: "working",
                jigsaw: this.cloneIt(clone)
            });

        } else {
            // failed to find a place so at a dead end, abandon this branch
            this.stack.pop();
            this.bsJigsaw.next({
                status: "working",
                jigsaw: this.cloneIt(this.peek())
            });
            this.invokePlacement();
            return;
    }

        // invoke this function again (via a callback)
        this.invokePlacement();
    }

    private tryPlacement(current: XCurrent, jigsaw: Jigsaw): Placement {

        let placement = this.tryAcrossPlacement(jigsaw, current);

        if (!placement) {
            placement = this.tryDownPlacement(jigsaw, current);
        }

        return placement;
    }

    private tryAcrossPlacement(jigsaw: Jigsaw, current: XCurrent): Placement | null {
        const maxAnchor = getMaxAnchor(jigsaw.cells);
        let result: Placement | null = null;

        for (let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            let alreadyTried = current.attemptedPlacements.find(p => p.anchor === anchor && p.direction === "across");

            if (!alreadyTried) {
                current.attemptedPlacements.push({anchor, direction: "across" })
                
                if (this.tryAcrossFit(jigsaw, current.answer, anchor)) {
                    result = {
                        clueId: current.answer.clueId,
                        light: {
                            anchor,
                            direction: "across"
                        }
                    };
                }
            }
        }
        return result;
    }

    private tryDownPlacement(jigsaw: Jigsaw, current: XCurrent): Placement | null {
        const maxAnchor = getMaxAnchor(jigsaw.cells);
        let result: Placement | null = null;

        for (let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            let alreadyTried = current.attemptedPlacements.find(p => p.anchor === anchor && p.direction === "down");

            if (!alreadyTried) {
                current.attemptedPlacements.push({anchor, direction: "down" })
                if (this.tryDownFit(jigsaw, current.answer, anchor)) {
                    result = {
                        clueId: current.answer.clueId,
                        light: {
                            anchor,
                            direction: "down"
                        }
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
            .filter(a => a.light)
            .forEach(answer => {
                let entry = answer.light.direction === "across" ?
                    this.getAcrossEntry(jigsaw, answer.light.anchor) :
                    this.getDownEntry(jigsaw, answer.light.anchor);

                for (let i = 0; i < entry.length; i++) {
                    entry[i].content = answer.text.charAt(i);
                }
            });
    }

    private cloneIt(src: Jigsaw): Jigsaw {
        return JSON.parse(JSON.stringify(src));
    }

    private peek(): Jigsaw {
        return this.stack.length ?
            this.stack[this.stack.length - 1] :
            null;
    }
}

