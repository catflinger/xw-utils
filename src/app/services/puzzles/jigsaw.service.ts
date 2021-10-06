import { typeWithParameters } from '@angular/compiler/src/render3/util';
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
    attempted: boolean;
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
        this.stack.push(xxx);
        this.bsXXX.next(xxx);
        Promise.resolve()
        .then(_ => this.placeNextAnswer())
    }

    private placeNextAnswer(): Promise<JigsawStatus> {

        this.depth++;

        // use the current stack frame
        let xxx = this.stack[this.stack.length - 1];

        // no empty grid cells ? return "success"
        if (this.countEmptyGridCells(xxx) === 0) {
            //console.log(`No empty cells left`);
            return Promise.resolve<JigsawStatus>("success");
        }
        // no unplaced answers left ? return "success"
        if (this.countUnplacedAnswers(xxx) === 0) {
            //console.log(`No unplaced answers left`);
            return Promise.resolve<JigsawStatus>("success");
        }

        // get the unplaced and unattempted answer
        let unattempted = xxx.answers.find(a => !a.placement && !a.attempted)

        if (!unattempted) {
            //console.log(`No more unattempted answers`);
            return Promise.resolve<JigsawStatus>("success");
        }

        // find a place for it
        //console.log(`Attempting to place ${unattempted.text}`);
        const placement = this.tryPlacement(xxx, unattempted);
        unattempted.attempted = true;

        if (placement) {
            console.log(`Found a place for ${JSON.stringify(placement)}`);
            // create a clone of current frame
            let clone: XXX = JSON.parse(JSON.stringify(xxx));
            
            // update it with the placement
            let clue = clone.answers.find(c => c.clueId === placement.clueId);
            clue.placement = placement;

            // update the placed answers in the grid
            this.syncGrid(clone);

            // clear the attemped flags
            clone.answers.forEach(a => a.attempted = false);
            
            // push it
            this.stack.push(clone)
            
            // raise an event
            this.bsXXX.next(JSON.parse(JSON.stringify(clone)));
        }

        // invoke this function again (via a callback)
        Promise.resolve().then(_ => this.placeNextAnswer());
        console.log(`Returning at end of function`);

        return Promise.resolve<JigsawStatus>("success");
    }

    private tryPlacement(xxx: XXX, answer: XAnswer): XPlacement | null {
        const maxAnchor = this.getMaxAnchor(xxx.cells);
        let result: XPlacement | null = null;
        
        for(let anchor = 1; anchor <= maxAnchor && !result; anchor++) {
            if (this.tryAcrossFit(xxx, answer, anchor)) {
                result = { 
                    clueId: answer.clueId,
                    anchor,
                    direction: "across"
                };
            } else if (this.tryDownFit(xxx, answer, anchor)) {
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

        puzzle.clues.forEach(c => {
            let text = this.trimAnswer(c.answers[0]);

            if (text) {
                x.answers.push({
                    clueId: c.id,
                    group: c.group ? c.group : null,
                    text,
                    placement: null,
                    attempted: false,
                });
            }
        });

        x.answers = this.shuffle(x.answers);
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

    private shuffle(answers: XAnswer[]): XAnswer[] {
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
}
