import { IGridProperties, GridStyle } from 'src/app/model/interfaces';
import { GridSizeM } from './grid-size-m';

export abstract class GridPropertiesM implements IGridProperties {
    abstract style: GridStyle;
    abstract size: GridSizeM;
    abstract symmetrical: boolean;
}