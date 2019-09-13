import { IGridSize } from 'src/app/model/interfaces';

export abstract class GridSizeM implements IGridSize {
    public abstract across: number;
    public abstract down: number;
}