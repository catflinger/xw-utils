export type Direction = "across" | "down";

export type GridStyle = "standard" | "barred";
export type ClueGroup = "across" | "down";

export class TextStyle {
    constructor(
        public color: string,
        public bold: boolean,
        public italic: boolean,
        public underline: boolean) { }

}

export class PublishOptions {
    public clueStyle: TextStyle;
    public definitionStyle: TextStyle;
    public answerStyle: TextStyle;
}

export class PuzzleInfo {
    public id: string;
    public title: string;
    public puzzleDate: Date;
    public providerName: string;
    public setter: string;

    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.puzzleDate = new Date(data.puzzleDate);
        this.providerName = data.providerName;
        this.setter = data.setter;
    }
}

export class PuzzleAnnotation {
    public header: string;
    public body: string;
    public footer: string;

    constructor(data: any) {
        this.header = data.header; 
        this.body = data.body; 
        this.footer = data.footer; 
    }
}

export class Puzzle {
    info: PuzzleInfo;
    publishOptions: PublishOptions;
    notes: PuzzleAnnotation;

    grid: Grid;
    clues: Clue[];

    linked: boolean;
    version: string;
    createdWithVersion: string;

    constructor(data: any) {

        this.grid = new Grid(data.grid);
        this.clues = [];

        data.clues.forEach(clue => this.clues.push(new Clue(clue)));

        this.info = new PuzzleInfo(data.info);

        this.notes = new PuzzleAnnotation(data.notes);

        this.publishOptions = new PublishOptions();
        this.publishOptions.clueStyle = new TextStyle("blue", false, false, false);
        this.publishOptions.definitionStyle = new TextStyle("blue", false, true, true);
        this.publishOptions.answerStyle = new TextStyle("black", true, false, false);

        this.linked = data.linked;
        this.version = data.version;
        this.createdWithVersion = data.createdWithVersion;
    }

    public cellAt(x: number, y: number): GridCell {
        return this.grid.cells.find((cell) => cell.x === x && cell.y === y);
    }

    public getSelectedClue(): Clue {
        return this.clues.find((clue) => clue.highlight);
    }

    public getLatestAnswer(clueId: string): string {
        let result: string = "";
        let clue = this.clues.find((clue) => clue.id === clueId);
        clue.entries.forEach((entry) => {
            entry.cellIds.forEach((id) => {
                let cell = this.grid.cells.find((cell) => cell.id === id);
                let letter = cell.content.length > 0 ? cell.content.charAt(0) : "_"
                result += letter + " ";
            })
        });

        return result.trim();
    }

}

export class Clue {
    id: string;
    group: ClueGroup;
    caption: string;        // "1 across, 2 down"
    text: string;           // "How to train a dragon (5, 4)"
    letterCount: string;    // "(5, 4)"
    answer: string;
    definition: string;
    format: string;
    comment: string;
    highlight: boolean;
    entries: GridEntry[];

    constructor(data: any) {
        this.id = data.id;
        this.group = data.group;
        this.caption = data.caption;
        this.text = data.text;
        this.letterCount = data.letterCount;
        this.answer = data.answer;
        this.definition = data.definition;
        this.format = data.format;
        this.comment = data.comment;
        this.highlight = data.highlight;
        this.entries = [];

        data.entries.forEach(entry => this.entries.push(new GridEntry(entry)));
    }
}

export const definitionMaskMarker: string = "d";

export class GridEntry {
    cellIds: string[];

    constructor(data: any) {
        this.cellIds = [];
        data.cellIds.forEach(id => this.cellIds.push(id));
    }
}

export class Grid {
    style: GridStyle;
    size: GridSize;
    cells: GridCell[];

    constructor(data: any) {
        this.style = data.style;
        this.size = new GridSize(data.size);
        this.cells = [];
        data.cells.forEach(cell => this.cells.push(new GridCell(cell)));
    }
}

export class GridSize {
    across: number;
    down: number;

    constructor(data: any) {
        this.across = data.across;
        this.down = data.down;
    }
}

export class GridCell {
    id: string;
    x: number;
    y: number;
    caption: string;
    content: string;
    light: boolean;
    rightBar: boolean;
    bottomBar: boolean;
    highlight: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.caption = data.caption;
        this.content = data.content;
        this.light = data.light;
        this.rightBar = data.rightBar;
        this.bottomBar = data.bottomBar;
        this.highlight = data.highlight;
    }
}
