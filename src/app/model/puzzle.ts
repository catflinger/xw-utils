export type Direction = "across" | "down";
export type GridStyle = "standard" | "barred";

export class Puzzle {
    grid: Grid;
    acrossClues: Clue[];
    downClues: Clue[];
}

export class Clue {
    id: string;
    caption: string;        // "1 across, 2 down"
    text: string;           // "How to train a dragon"
    letterCount: string;    // "(4, 4)"
    entries: GridEntry[];
}

export class GridEntry {
    cellIds: string[];
}

export class Grid {
    style: GridStyle;
    size: GridSize;
    cells: GridCell[];
}

export class GridSize {
    across: number;
    down: number;
}
export class GridCell {
    id: string; // id encodes location in grid as "cell-row-column"
    content: string;
    light: boolean;
    rightBar: boolean;
    bottomBar: boolean;
}
