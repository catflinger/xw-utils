import { IGridCell } from 'src/app/model/interfaces';

export abstract class GridCellM implements IGridCell {
    public abstract id: string;
    public abstract x: number;
    public abstract y: number;
    public abstract caption: string;
    public abstract content: string;
    public abstract light: boolean;
    public abstract rightBar: boolean;
    public abstract bottomBar: boolean;
    public abstract highlight: boolean;
}