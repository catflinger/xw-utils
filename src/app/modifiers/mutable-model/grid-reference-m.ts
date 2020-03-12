import { IGridReference, Direction } from 'src/app/model/interfaces';

export abstract class GridReferenceM implements IGridReference {
    public abstract caption: string;
    public abstract direction: Direction;
}