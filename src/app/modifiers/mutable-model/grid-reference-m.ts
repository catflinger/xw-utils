import { IGridReference, Direction } from 'src/app/model/interfaces';

export abstract class GridReferenceM implements IGridReference {
    public abstract id: string;
    public abstract caption: number;
    public abstract direction: Direction;
}