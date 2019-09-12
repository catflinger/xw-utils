import { IGridCell } from 'src/app/model/interfaces';

export class GridCellM implements IGridCell {
    id: string;
    x: number;
    y: number;
    caption: string;
    content: string;
    light: boolean;
    rightBar: boolean;
    bottomBar: boolean;
    highlight: boolean;
}