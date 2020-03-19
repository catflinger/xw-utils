import { IGridLink } from 'src/app/model/interfaces';
import { GridEntryM } from './grid-entry-m';

export abstract class GridLinkM implements IGridLink {
    public abstract warning: string;
    public abstract entries: GridEntryM[];
}