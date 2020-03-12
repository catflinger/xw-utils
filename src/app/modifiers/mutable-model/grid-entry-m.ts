import { IGridEntry } from 'src/app/model/interfaces';
import { GridReferenceM } from './grid-reference-m';

export abstract class GridEntryM implements IGridEntry {
    public abstract gridRef: GridReferenceM;
    public abstract cellIds: string[];
}