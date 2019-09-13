import { GridStyle, IGrid } from 'src/app/model/interfaces';
import { GridCellM } from './grid-cell-m';
import { GridSizeM } from './grid-size-m';

export abstract class GridM implements IGrid {
    public abstract style: GridStyle;
    public abstract size: GridSizeM;
    public abstract cells: GridCellM[];
}