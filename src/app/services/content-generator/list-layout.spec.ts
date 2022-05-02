import * as _ from "lodash";
import { TestBed } from '@angular/core/testing';
import { IPuzzle, IClue, ClueGroup, IGridReference } from '../../model/interfaces';
import { ListLayout } from './list-layout';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';

describe('List Layout content generator', () => {

    let listLayout: ListLayout;

    describe('exec', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({});
            listLayout = TestBed.inject(ListLayout)
        });

        it('should generate from an empty puzzle', () => {
            let puzzle = new Puzzle(getEmptyPuzzle());

            let s = listLayout.getContent(puzzle, null);

            expect(s).toEqual("<div>\n</div>\n")
        });

        it('should generate html', () => {
            let puzzle = new Puzzle(getEmptyPuzzle());
            addTestClues(puzzle);

            let s = listLayout.getContent(puzzle, null);

            expect(s).toEqual(listLayoutResult)
        });


    }); 
});

function addTestClues(puzzle: IPuzzle) {

    // add 5 across
    puzzle.clues.push(makeClue(
        "5, 3 down", 
        "across", 
        "This has two grid entries (5, 5)",
        "WHOLE WHEAT",
        [
            {
                id: "",
                anchor: 5,
                direction: "across",
            },
            {
                id: "",
                anchor: 3,
                direction: "down",
            }
        ]
    ));

    puzzle.clues.push(makeClue(
        "1", 
        "across", 
        "This is one across (5)",
        "PHONE",
        [{
            id: "",
            anchor: 1,
            direction: "across"
        }]
    ));

    puzzle.clues.push(makeClue(
        "2", 
        "down",
        "BEANO  ", 
        "This is 2 down (5)",
        [{
            id: "",
            anchor: 2,
            direction: "down"
        }]
    ));

}

const listLayoutResult = `<div>
<div class="clue">
</div>
<div class="clue">
</div>
<div class="clue">
</div>
</div>
`;


function makeClue(caption: string, group: ClueGroup, text: string, answer: string, gridRefs: IGridReference[]): IClue {
    return {
        id: "",
        group,
        caption,
        text,
        letterCount: "",
        answers: [answer],
        solution: "",
        annotation: "",
        redirect: null,
        format: "",
        comment: null,
        highlight: false,
        chunks: [],
        warnings: [],
        link: {
            warning: null,
            gridRefs,
        }
    };
}

function getEmptyPuzzle(): IPuzzle {
    return {
        clues: [],
        grid: null,
        //linked: false,
        revision: 0,
        ready: true,
        uncommitted: false,
        options: {
            linkMethod: "auto",
        },
        info: {
            id: "abc123",
            title: "untitled",
            puzzleDate: new Date(),
            provider: "text",
            setter: "anon",
            wordpressId: null,
            instructions: null,
        },
        provision: null,
        notes: {
            header: { ops: [] },
            body: { ops: [] },
            footer: { ops: [] },
        },
        publishOptions: {
            useThemeDefaults: false,
            showClueCaptions: true,
            showClueGroups: true,
            textStyles: [
                {
                    name: "clue",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: "fts-clue",
                },
                {
                    name: "answer",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: "fts-answer",
                },
                {
                    name: "definition",
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                    class: "fts-definition",
                },
            ],
            textCols: [
                {
                    caption: "answer",
                    style: "answer",
                }
            ],
            includeGrid: false,
            layout: "table",
            spacing: "small",
        },
    };
}

