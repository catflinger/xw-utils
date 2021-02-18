import { GridNavigation, Direction } from 'src/app/model/interfaces';
import { GridProperties } from 'src/app/model/puzzle-model/grid-properties';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';

export class MockGrid {
    public properties: GridProperties;
    public cells: GridCell[];
    
    public cellAt(x: number, y: number): GridCell {
        throw new Error("Method not implemented.");
    }
    public getNavigator(startCellId: string, orientation: GridNavigation): Iterator<GridCell> {
        throw new Error("Method not implemented.");
    }
    public getGridEntryForCell(cellId: string): GridCell[] {
        throw new Error("Method not implemented.");
    }
    public getGridEntryForCaption(caption: string, direction: Direction): GridCell[] {
        return [
            this.mockGridCell("cell1-a"),
            this.mockGridCell("cell2-a"),
            this.mockGridCell("cell3-a"),
        ];
    }

    constructor() {}

    private mockGridCell(id: string): GridCell {
        return {
            id,
            x: 0,
            y: 0,
            anchor: null,
            content: "",
            light: false,
            bottomBar: false,
            rightBar: false,
            highlight: false,
            shading: "true",
            edit: false,
        }
    }
    // private getEntry(entryCell: GridCell, direction: Direction): GridCell[] {
    //     throw new Error("Method not implemented.");
    // }
}