import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    lastTriedIndex: number | null,
}

@Injectable({
    providedIn: 'root'
})
export class JigsawService {

    private stack: XXX[] = [];
    private bsXXX: BehaviorSubject<XXX | null> = new   BehaviorSubject<XXX | null>(null);

    constructor(
        //private scratchpadService: ScratchpadService,
    ) { }

    public observe(): Observable<XXX> {
        return this.bsXXX.asObservable();
    }

    public start(puzzle: Puzzle) {
        this.stack = [];
        // make a copy of the important bits
        const xxx = this.makeXXXFromPuzzle(puzzle);
        this.stack.push(xxx);
        this.bsXXX.next(xxx);
        Promise.resolve()
        .then(_ => this.placeNextAnswer())
    }

    private placeNextAnswer(): Promise<void> {

        // use the current stack frame
        
        // no unplaced answers left ? return "success"
        // no untried answers left ? return "failure"

        // get untried answer
        // find a place for it

        // success = YES
            // create a clone of current frame
            // update it with the placement
            // clear the attemped flags
            // push it
            // raise an event
            // push recusive call onto stack

        // success = NO
            // mark anwers as attempted

        return Promise.resolve()
    }


    private makeXXXFromPuzzle(puzzle: Puzzle): XXX {
        const x: XXX = {
            cells: [],
            answers: [],
            lastTriedIndex: null,
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
            x.answers.push({
                clueId: c.id,
                group: c.group ? c.group : null,
                text: this.trimAnswer(c.answers[0]),
                placement: null,
                attempted: false,
            });
        });

        return x;
    }

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
}
