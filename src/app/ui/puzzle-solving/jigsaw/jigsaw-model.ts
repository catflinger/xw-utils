import { ClueGroup, Direction } from "src/app/model/interfaces";
import { Puzzle } from "src/app/model/puzzle-model/puzzle";

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
}

export interface XGridProperties {
    across: number,
    down: number,
    numbered: boolean,
}
export interface XLight {
    anchor: number,
    direction: Direction,
}
export interface XCurrent {
    answer: XAnswer,
    attemptedPlacements: XLight[],
}

export interface XXX {
    properties: XGridProperties,
    cells: XCell[],
    answers: XAnswer[],
    current: XCurrent,
}

export interface XPlacement {
    clueId: string,
    anchor: number,     // TO DO: nake this use XLight
    direction: Direction,
}

export function makeXXXFromPuzzle(puzzle: Puzzle): XXX {
    const x: XXX = {
        cells: [],
        answers: [],
        properties: {
            across: puzzle.grid.properties.size.across,
            down: puzzle.grid.properties.size.down,
            numbered: puzzle.grid.properties.numbered,
        },
        current: null
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
        let text = trimAnswer(c.answers[0]);

        if (text) {
            unsortedAnswers.push({
                clueId: c.id,
                group: c.group ? c.group : null,
                text,
                placement: null,
                //attemptedAcross: false,
                //attemptedDown: false,
            });
        }
    });

    x.answers = sortAnswers(shuffleAnswers(unsortedAnswers));
    return x;
}

export function getMaxAnchor(cells: XCell[]): number {
    let max = 0;
    cells.forEach(c => {
        if (c.anchor && c.anchor > 0) {
            max = Math.max(max, c.anchor);
        }
    });
    return max;
}

export function countEmptyGridCells(xxx: XXX): number {
    let counter = 0;

    xxx.cells.forEach(c => {
        if (c.light && !c.content) {
            counter++;
        }
    })
    return counter;
}
function shuffleAnswers(answers: XAnswer[]): XAnswer[] {
    let currentIndex = answers.length, randomIndex;

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

function sortAnswers(answers: XAnswer[]): XAnswer[] {
    return answers.sort((a, b) => b.text.length - a.text.length);
}

function trimAnswer(src: string): string | null {
    if (!src) {
        return null;
    }
    return src.replace(/[^A-Z]/g, "");
}



