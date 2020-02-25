import { IGrid } from 'src/app/model/interfaces';
import { GridCellM } from './grid-cell-m';
import { GridPropertiesM } from './grid-properties-m';

export abstract class GridM implements IGrid {
    public abstract properties: GridPropertiesM;
    public abstract cells: GridCellM[];
}