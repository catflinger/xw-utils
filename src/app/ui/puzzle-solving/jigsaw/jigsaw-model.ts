import { ClueGroup, Direction } from "src/app/model/interfaces";
import { Puzzle } from "src/app/model/puzzle-model/puzzle";

export interface JCell {
    x: number,
    y: number,
    light: boolean,
    rightBar: boolean,
    bottomBar: boolean,
    anchor: number | null,
    content: string | null,
}

export interface JLight {
    anchor: number,
    direction: Direction,
}

export interface JAnswer {
    clueId: string,
    group: ClueGroup | null,
    text: string | null,
    light: JLight | null;
}

export interface JGridProperties {
    across: number,
    down: number,
    numbered: boolean,
}

export interface XCurrent {
    answer: JAnswer,
    attemptedPlacements: JLight[],
}

export interface Jigsaw {
    properties: JGridProperties,
    cells: JCell[],
    answers: JAnswer[],
    current: XCurrent,
}

export function makeJigsawFromPuzzle(puzzle: Puzzle): Jigsaw {
    const jigsaw: Jigsaw = {
        cells: [],
        answers: [],
        properties: {
            across: puzzle.grid.properties.size.across,
            down: puzzle.grid.properties.size.down,
            numbered: puzzle.grid.properties.numbered,
        },
        current: null
    }

    puzzle.grid.cells.forEach(c => jigsaw.cells.push({
        x: c.x,
        y: c.y,
        anchor: c.anchor,
        content: "", // this.trimContent(c.content),
        light: c.light,
        rightBar: c.rightBar,
        bottomBar: c.bottomBar,
    }));

    const unsortedAnswers: JAnswer[] = [];

    puzzle.clues.forEach(c => {
        let text = trimAnswer(c.answers[0]);

        if (text) {
            unsortedAnswers.push({
                clueId: c.id,
                group: c.group ? c.group : null,
                text,
                light: null,
                //attemptedAcross: false,
                //attemptedDown: false,
            });
        }
    });

    jigsaw.answers = sortAnswers(shuffleAnswers(unsortedAnswers));
    return jigsaw;
}

export function getMaxAnchor(cells: JCell[]): number {
    let max = 0;
    cells.forEach(c => {
        if (c.anchor && c.anchor > 0) {
            max = Math.max(max, c.anchor);
        }
    });
    return max;
}

export function countEmptyGridCells(jigsaw: Jigsaw): number {
    let counter = 0;

    jigsaw.cells.forEach(c => {
        if (c.light && !c.content) {
            counter++;
        }
    })
    return counter;
}
function shuffleAnswers(answers: JAnswer[]): JAnswer[] {
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

function sortAnswers(answers: JAnswer[]): JAnswer[] {
    return answers.sort((a, b) => b.text.length - a.text.length);
}

function trimAnswer(src: string): string | null {
    if (!src) {
        return null;
    }
    return src.replace(/[^A-Z]/g, "");
}



