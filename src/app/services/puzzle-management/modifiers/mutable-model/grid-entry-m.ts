import { IGridEntry } from 'src/app/model/interfaces';

export abstract class GridEntryM implements IGridEntry {
    public abstract cellIds: readonly string[];
}