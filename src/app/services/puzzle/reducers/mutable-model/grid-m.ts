import { GridStyle, IGrid } from 'src/app/model/interfaces';
import { GridCellM } from './grid-cell-m';
import { GridSizeM } from './grid-size-m';

export class GridM implements IGrid {
    style: GridStyle;
    size: GridSizeM;
    cells: GridCellM[];
}