import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ClueGroup, Direction } from 'src/app/model/interfaces';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';

type JigsawStatus = "working" | "failure" | "success";

export interface XCell {
    x: number,
    y: number,
    light: boolean,
    rightBar: boolean,
    bottomBar: boolean,
    anchor: number | null,
    content: string | null,
}

export interface XPlacement {
    anchor: number,
    direction: Direction,
}

export interface XAnswer {
    clueId: string,
    group: ClueGroup | null,
    text: string | null,
    placement: XPlacement | null;
    attemptedAcross: boolean;
    attemptedDown: boolean;
}

export interface XGridProperties {
    across: number,
    down: number,
    numbered: boolean,
}

export interface XXX {
    properties: XGridProperties,
    cells: XCell[],
    answers: XAnswer[],
}

export interface XPlacement {
    clueId: string,
    anchor: number,
    direction: Direction,
}

@Injectable({
    providedIn: 'root'
})
export class JigsawService {

    private depth = 0;

    private stack: XXX[] = [];

    // TO DO: figure out how to make the type of this readonly so subscribers can't accidentally modify the values they get
    private bsXXX: BehaviorSubject<XXX | null> = new   BehaviorSubject<XXX | null>(null);

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
        const xxx = this.makeXXXFromPuzzle(puzzle);
        //push it onto the stack as the first pristine grid
        this.stack.push(xxx);
        //push a clone the stack as the first attempt
        this.stack.push(JSON.parse(JSON.stringify(xxx)));

        this.bsXXX.next(xxx);
        this.invokePlacement();
    }

    private invokePlacement() {
        setTimeout(_ => this.placeNextAnswer(), 100);
    } 


    private placeNextAnswer(): void {

        this.depth++;

        if (this.depth > 1000000) {
            console.log(`Exceeded max numberof tries`);
            return;
        }

        // use the current stack frame
        let xxx = this.stack[this.stack.length - 1];

        // no empty grid cells ? return "success"
        if (this.countEmptyGridCells(xxx) === 0) {
            //console.log(`No empty cells left`);
            return;
        }
        // no unplaced answers left ? return "success"
        if (this.countUnplacedAnswers(xxx) === 0) {
            //console.log(`No unplaced answers left`);
            return;
        }

        // get the unplaced and unattempted answer
        let unattempted = xxx.answers.find(a => !a.placement && (!a.attemptedAcross || !a.attemptedDown))

        if (!unattempted) {
            //console.log(`No more unattempted answers`);
            
            // this means we are at a dead end, abandon this route
            this.stack.pop();
            console.log("A")
            this.bsXXX.next(JSON.parse(JSON.stringify(this.stack[this.stack.length - 1])));
            this.invokePlacement();
            return;
        }

        // find a place for it
        //console.log(`Attempting to place ${unattempted.text}`);
        const placement = !unattempted.attemptedAcross ?
            this.tryAcrossPlacement(xxx, unattempted) :
            this.tryDownPlacement(xxx, unattempted);

        if (placement) {
            //console.log(`Found a place for ${unattempted.text}`);
            // create a clone of current frame
            console.log("B")
            let clone: XXX = JSON.parse(JSON.stringify(xxx));
            
            // update it with the placement
            let clue = clone.answers.find(c => c.clueId === placement.clueId);
            clue.placement = placement;

            // update the placed answers in the grid
            this.syncGrid(clone);

            // clear the attemped flags
            clone.answers.forEach(a => {
                if (!a.placement) {
                    a.attemptedAcross = false;
                    a.attemptedDown = false;
                }
            });
            
            // push it
            this.stack.push(clone)
            
            // raise an event
            console.log("C")
            this.bsXXX.next(JSON.parse(JSON.stringify(clone)));

        } else {
            if (unattempted.attemptedAcross && unattempted.attemptedDown) {

                // this means we are at a dead end, we have failed to place this word anywhere
                //abandon this route
                this.stack.pop();
                console.log("D");
                if (this.stack.length > 1) {
                    this.bsXXX.next(JSON.parse(JSON.stringify(this.stack[this.stack.length - 1])));
                    this.invokePlacement();
                }
                return;
            }
        }

        // invoke this function again (via a callback)
        this.invokePlacement();
        //console.log(`Returning at end of function`);

        //return Promise.resolve<JigsawStatus>("success");
    }

    private tryAcrossPlacement(xxx: XXX, answer: XAnswer): XPlacement | null {
        const maxAnchor = this.getMaxAnchor(xxx.cells);
        let result: XPlacement | null = null;

        answer.attemptedAcross = true;
        
        for(let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            if (this.tryAcrossFit(xxx, answer, anchor)) {
                result = { 
                    clueId: answer.clueId,
                    anchor,
                    direction: "across"
                };
            
            }
        }
        return result;
    }

    private tryDownPlacement(xxx: XXX, answer: XAnswer): XPlacement | null {
        const maxAnchor = this.getMaxAnchor(xxx.cells);
        let result: XPlacement | null = null;

        answer.attemptedDown = true;

        for(let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            if (this.tryDownFit(xxx, answer, anchor)) {
                result = { 
                    clueId: answer.clueId,
                    anchor,
                    direction: "down"
                };
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

                if (entryLetter && entryLetter !== answerLetter ) {
                    isFit = false;
                }
            };
        }
        return isFit;
    }


    private makeXXXFromPuzzle(puzzle: Puzzle): XXX {
        const x: XXX = {
            cells: [],
            answers: [],
            properties: {
                across: puzzle.grid.properties.size.across,
                down: puzzle.grid.properties.size.down,
                numbered: puzzle.grid.properties.numbered,
            }
        }

        puzzle.grid.cells.forEach(c => x.cells.push({
            x: c.x,
            y: c.y,
            anchor: c.anchor,
            content: "", // this.trimContent(c.content),
            light: c.light,
            rightBar: c.rightBar,
            bottomBar: c.bottomBar,
        }));

        const unsortedAnswers: XAnswer[] = [];
        
        puzzle.clues.forEach(c => {
            let text = this.trimAnswer(c.answers[0]);

            if (text) {
                unsortedAnswers.push({
                    clueId: c.id,
                    group: c.group ? c.group : null,
                    text,
                    placement: null,
                    attemptedAcross: false,
                    attemptedDown: false,
                });
            }
        });

        x.answers = this.sortAnswers( this.shuffleAnswers(unsortedAnswers));
        return x;
    }

    // TO DO: check that this really is redundant.  SHould it hav ebeen called somewhere?
    //  if not then delete it
    private trimContent(src: string): string | null {
        if (!src) {
            return null;
        }
        const match = src.match(/[A-Z]/);
        return match ? match[0] : null;
    }

    private trimAnswer(src: string): string | null {
        if (!src) {
            return null;
        }
        return src.replace(/[^A-Z]/g, "");
    }

    private countEmptyGridCells(xxx: XXX): number {
        let counter = 0;

        xxx.cells.forEach(c => {
            if(c.light && !c.content) {
                counter++;
            }
        })
        return counter;
    }

    private countUnplacedAnswers(xxx: XXX): number {
        let counter = 0;

        xxx.answers.forEach(a => {
            if(!a.placement) {
                counter++;
            }
        })
        return counter;
    }

    private getMaxAnchor(cells: XCell[]): number {
        let max = 0;
        cells.forEach(c => {
            if (c.anchor && c.anchor > 0 ) {
                max = Math.max(max, c.anchor);
            }
        });
        return max;
    }

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

        for(
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

        for(
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
            let entry= answer.placement.direction === "across" ?
                this.getAcrossEntry(xxx, answer.placement.anchor) :
                this.getDownEntry(xxx, answer.placement.anchor);

            for(let i = 0; i < entry.length; i++) {
            entry[i].content = answer.text.charAt(i);
            }
        });
    }

    private shuffleAnswers(answers: XAnswer[]): XAnswer[] {
        let currentIndex = answers.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [answers[currentIndex], answers[randomIndex]] = [
            answers[randomIndex], answers[currentIndex]];
        }
      
        return answers;
      }

      private sortAnswers(answers: XAnswer[]): XAnswer[] {
          return answers.sort((a,b) => b.text.length - a.text.length);
      }

}
